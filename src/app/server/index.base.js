const crypto = require("crypto");

const CompressionHelper = require("../../shared/helpers/compression-helper");
const ResponseHelper = require("../../shared/helpers/response-helper");

const ENCODING_BASE64 = "base64";
const HEADER_VALUE_KEY = "value";

const HEADER_CONTENT_SECURITY_POLICY_VALUE_DEFAULT =
  "default-src 'self'; object-src 'none'; frame-ancestors 'none'; base-uri 'none'; form-action 'self'; block-all-mixed-content";

const BASE_HTML_RESPONSE_HEADERS = {
  "cache-control": [{ value: "max-age=300, public" }],
  "content-security-policy": [
    { value: HEADER_CONTENT_SECURITY_POLICY_VALUE_DEFAULT },
  ],
  "content-type": [{ value: "text/html; charset=utf-8" }],
  "referrer-policy": [{ value: "strict-origin-when-cross-origin" }],
  "strict-transport-security": [
    { value: "max-age=31536000; includeSubDomains; preload" },
  ],
  "x-content-type-options": [{ value: "nosniff" }],
  "x-frame-options": [{ value: "DENY" }],
  "x-xss-protection": [{ value: "1; mode=block" }],
};

const VUE_TEMPLATE = `<!DOCTYPE html>
<html>
<head>
  <!--vue-meta-title-outlet-->
  <!--vue-meta-meta-outlet-->
  <!--vue-meta-link-outlet-->
  <!--vue-meta-style-outlet-->
  <!--vue-meta-script-outlet-->
  {{{ renderResourceHints() }}}
  {{{ renderStyles() }}}
</head>
<body>
  <!--vue-meta-noscript-outlet-->
  <!--vue-ssr-outlet-->
  {{{ renderState() }}}
  {{{ renderState({ contextKey: 'apolloState', windowKey: '__APOLLO_STATE__' }) }}}
  {{{ renderScripts() }}}
</body>
</html>`;

const REGEX_SCRIPT_SINGLE = /(?:<script>)([\s\S]*?)(?:<\/script>)/u;
const REGEX_STYLE_GLOBAL = /(?:<style[^>]*>)([\s\S]*?)(?:<\/style>)/gu;
const REGEX_STYLE_SINGLE = /(?:<style[^>]*>)([\s\S]*?)(?:<\/style>)/u;

function textToSha256Base64Hash(text) {
  return crypto
    .createHash("sha256")
    .update(text, "utf-8")
    .digest(ENCODING_BASE64);
}

function textToCspSrc(text) {
  return `'sha256-${textToSha256Base64Hash(text)}'`;
}

function htmlToCspHeaderValue(html) {
  const cspScriptHash = textToCspSrc(html.match(REGEX_SCRIPT_SINGLE)[1]);
  const cspStyleHashes = html
    .match(REGEX_STYLE_GLOBAL)
    .map((element) => textToCspSrc(element.match(REGEX_STYLE_SINGLE)[1]))
    .join(" ");

  return `${HEADER_CONTENT_SECURITY_POLICY_VALUE_DEFAULT}; script-src 'self' ${cspScriptHash}; style-src 'self' ${cspStyleHashes}`;
}

// Note: state and vueMeta will be set in bundleRenderer.renderToString
// (in ../entry.server.js)
function createBundleRendererContext(request, response) {
  return {
    state: null,
    uri:
      response && "status" in response && response.status.length
        ? `/error/${response.status}`
        : request.uri,
    vueMeta: null,
  };
}

function removeLinkStylesheets(html) {
  return html.replace(/<link rel="stylesheet"[^>]*>/g, "");
}

function getHtmlWithVueMetaInjected(
  html,
  { bodyAttrs, htmlAttrs, link, meta, noscript, script, style, title },
) {
  return html
    .replace("<body>", `<body ${bodyAttrs.text()}>`)
    .replace(
      "<html>",
      `<html data-vue-meta-server-rendered ${htmlAttrs.text()}>`,
    )
    .replace("<!--vue-meta-link-outlet-->", link.text())
    .replace("<!--vue-meta-meta-outlet-->", meta.text())
    .replace("<!--vue-meta-noscript-outlet-->", noscript.text())
    .replace("<!--vue-meta-script-outlet-->", script.text())
    .replace("<!--vue-meta-style-outlet-->", style.text())
    .replace("<!--vue-meta-title-outlet-->", title.text());
}

function isOriginResponse(response) {
  return response && "status" in response;
}

function isOriginResponseWithStatus(response, status) {
  return isOriginResponse(response) && status === response.status;
}

function on301(toUri, request, callback) {
  console.warn("WARN: HTTP 301", { uri: request.uri, to: toUri });
  return callback(null, {
    headers: {
      ...BASE_HTML_RESPONSE_HEADERS,
      location: [{ value: toUri }],
    },
    status: ResponseHelper.Constants.STATUS_VALUE_301,
    statusDescription: ResponseHelper.httpCodeToStatusDescription({
      httpCode: ResponseHelper.Constants.STATUS_VALUE_301,
    }),
  });
}

function on404(bundleRenderer, request, callback) {
  console.warn("WARN: HTTP 404", {
    uri: request.uri,
  });

  // Render /error/404
  renderHtml(
    bundleRenderer,
    request,
    {
      status: ResponseHelper.Constants.STATUS_VALUE_404,
      statusDescription: ResponseHelper.httpCodeToStatusDescription({
        httpCode: ResponseHelper.Constants.STATUS_VALUE_404,
      }),
    },
    callback,
  );
}

function on500(bundleRenderer, error, request, callback) {
  console.error("ERROR: HTTP 500", {
    uri: request.uri,
    error,
  });
  // Render /error/500
  renderHtml(
    bundleRenderer,
    request,
    {
      status: ResponseHelper.Constants.STATUS_VALUE_500,
      statusDescription: ResponseHelper.httpCodeToStatusDescription({
        httpCode: ResponseHelper.Constants.STATUS_VALUE_500,
      }),
    },
    callback,
  );
}

function onUnsuccessfulRender(
  bundleRenderer,
  error,
  request,
  response,
  callback,
) {
  if (error && "httpCode" in error) {
    switch (error.httpCode) {
      case 301: {
        if ("toUri" in error) {
          return on301(error.toUri, request, callback);
        }
        break;
      }
      case 404: {
        return on404(bundleRenderer, request, callback);
      }
      default: {
        return on500(bundleRenderer, error, request, callback);
      }
    }
  } else if (response && "status" in response && response.status.length) {
    // Respond with a status error on failure to render an error page
    // This block prevents recursive on404()/on500() function calls
    console.error(`ERROR: HTTP ${response.status}`, {
      request,
      response,
      uri: request.uri,
    });
    return callback(null, {
      headers: { ...BASE_HTML_RESPONSE_HEADERS },
      status: response.status,
      statusDescription: ResponseHelper.httpCodeToStatusDescription({
        httpCode: response.status,
      }),
    });
  }

  return on500(bundleRenderer, error, request, callback);
}

function onSuccessfulRender(
  htmlWithoutVueMeta,
  injectableVueMeta,
  httpCode,
  request,
  response,
  callback,
) {
  console.log(
    `LOG: HTTP ${
      response && "status" in response && response.status.length
        ? response.status
        : httpCode
    }`,
    { uri: request.uri },
  );

  const htmlWithVueMeta = getHtmlWithVueMetaInjected(
    htmlWithoutVueMeta,
    injectableVueMeta,
  );
  const html = removeLinkStylesheets(htmlWithVueMeta);
  const acceptableEncodings = request.headers[
    CompressionHelper.HEADER_ACCEPT_ENCODING
  ][0][HEADER_VALUE_KEY].split(", ");
  const uri = request.uri;
  const isGzipCompressible = CompressionHelper.isGzipCompressible({
    acceptableEncodings,
    uri,
  });
  const compressedResponseProperties = CompressionHelper.getCompressedResponseProperties(
    {
      encoding: isGzipCompressible
        ? CompressionHelper.COMPRESSION_GZIP_ENCODING
        : CompressionHelper.COMPRESSION_NONE_ENCODING,
      html,
    },
  );

  // Respond without overwriting any required values
  callback(null, {
    status: `${httpCode}`,
    statusDescription: ResponseHelper.httpCodeToStatusDescription({ httpCode }),
    ...response,
    body: html,
    ...compressedResponseProperties,
    headers: {
      ...(response && "headers" in response && response.headers),
      ...BASE_HTML_RESPONSE_HEADERS,
      ...("headers" in compressedResponseProperties &&
        compressedResponseProperties.headers),
      "content-security-policy": [{ value: htmlToCspHeaderValue(html) }],
    },
  });
}

function renderHtml(bundleRenderer, request, response, callback) {
  const bundleRendererContext = createBundleRendererContext(request, response);

  // Render the app server side (../entry.server.js is automatically called with
  // the bundle renderer's context in the renderToString function)
  bundleRenderer
    .renderToString(bundleRendererContext)
    .then((htmlWithoutVueMeta) =>
      onSuccessfulRender(
        htmlWithoutVueMeta,
        bundleRendererContext.vueMeta.inject(),
        bundleRendererContext.httpCode,
        request,
        response,
        callback,
      ),
    )
    .catch((error) => {
      onUnsuccessfulRender(bundleRenderer, error, request, response, callback);
    });
}

module.exports = {
  VUE_TEMPLATE,
  getHtmlWithVueMetaInjected,
  isOriginResponse,
  isOriginResponseWithStatus,
  renderHtml,
};
