const ResponseHelper = require("./response-helper");

const HEADER_STRICT_TRANSPORT_SECURITY_KEY = "strict-transport-security";
const HEADER_STRICT_TRANSPORT_SECURITY_VALUE =
  "max-age=31536000; includeSubDomains; preload";

const HEADER_X_URI = "x-uri";

const ERROR_URI_PREFIX = "/error/";
const INVALID_URI = "/path/to/invalid";

const HEADER_VALUE_KEY = "value";

const INDEX_HTML_URI_PART = "/index.html";

const isNotLowerCaseUri = ({ uri = "" } = { uri: "" }) =>
  uri !== uri.toLowerCase();

const isTrailingSlash = ({ uri = "" } = { uri: "" }) =>
  uri.length > 1 && uri.endsWith("/");

const isQueryString = ({ queryString = "" } = { queryString: "" }) =>
  queryString ? true : false;

const isIndexHtmlPath = ({ uri = "" } = { uri: "" }) =>
  uri.endsWith(INDEX_HTML_URI_PART);

const isErrorPath = ({ uri = "" } = { uri: "" }) =>
  uri.startsWith(ERROR_URI_PREFIX);

const on301 = (
  { toUri = "", uri = "", callback = () => {} } = {
    toUri: "",
    uri: "",
    callback: () => {},
  },
) => {
  console.warn(`WARN: HTTP ${ResponseHelper.Constants.STATUS_VALUE_301}`, {
    uri,
    to: toUri,
  });
  callback(null, {
    headers: {
      location: [{ [HEADER_VALUE_KEY]: toUri }],
      [HEADER_STRICT_TRANSPORT_SECURITY_KEY]: [
        { [HEADER_VALUE_KEY]: HEADER_STRICT_TRANSPORT_SECURITY_VALUE },
      ],
    },
    status: ResponseHelper.Constants.STATUS_VALUE_301,
    statusDescription: ResponseHelper.httpCodeToStatusDescription({
      httpCode: ResponseHelper.Constants.STATUS_VALUE_301,
    }),
  });
};

const isInvalidRequestRequiringRedirect = (
  { request = { headers: {}, querystring: "", uri: "" } } = {
    request: { headers: {}, querystring: "", uri: "" },
  },
) => {
  const { querystring, uri } = request;

  return (
    isTrailingSlash({ uri }) ||
    isNotLowerCaseUri({ uri }) ||
    isQueryString({ querystring }) ||
    isIndexHtmlPath({ uri }) ||
    isErrorPath({ uri })
  );
};

const onInvalidRequestRequiringRedirect = (
  {
    request = { headers: {}, querystring: "", uri: "" },
    callback = () => {},
  } = {
    request: { headers: {}, querystring: "", uri: "" },
    callback: () => {},
  },
) => {
  const { querystring, uri } = request;

  if (isTrailingSlash({ uri })) {
    const toUri = uri.substring(0, uri.length - 1);
    on301({ toUri, uri, callback });
  } else if (isNotLowerCaseUri({ uri })) {
    const toUri = uri.toLowerCase();
    on301({ toUri, uri, callback });
  } else if (isQueryString({ querystring })) {
    const toUri = uri;
    on301({ toUri, uri, callback });
  } else {
    console.error("ERROR: Unhandled invalid request");
    callback("Unhandled invalid request.");
  }
};

const isInvalidRequestRequiringRewrite = (
  { uri = "" } = {
    uri: "",
  },
) => {
  return isIndexHtmlPath({ uri }) || isErrorPath({ uri });
};

const onInvalidRequestRequiringRewrite = (
  { request = {} } = {
    request: {},
  },
) => {
  console.warn("WARN: Invalid request requiring rewrite", {
    uri: request.uri,
  });
  // Replace with a URI that will result in an HTTP 404 error
  request.uri = INVALID_URI;
};

module.exports = {
  HEADER_X_URI,
  isInvalidRequestRequiringRedirect,
  isInvalidRequestRequiringRewrite,
  onInvalidRequestRequiringRedirect,
  onInvalidRequestRequiringRewrite,
};
