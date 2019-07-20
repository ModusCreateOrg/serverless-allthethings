const { createBundleRenderer } = require("vue-server-renderer");

const {
  VUE_TEMPLATE,
  isOriginResponseWithStatus,
  renderHtml,
} = require("./index.base");
const RequestHelper = require("../../shared/helpers/request-helper");
const ResponseHelper = require("../../shared/helpers/response-helper");
// Import the Vue SSR client manifest and server bundle that were generated in
// the Vue client (in webpack.vue.client.config.js) and server
// (in webpack.vue.server.config.js) webpack
const serverBundle = require("../../../dist/tmp/app/vue-ssr-server-bundle.json");
const clientManifest = require("../../../dist/tmp/app/vue-ssr-client-manifest.json");

const HEADER_VALUE_KEY = "value";

const bundleRenderer = createBundleRenderer(serverBundle, {
  clientManifest,
  inject: false,
  shouldPrefetch: () => false,
  shouldPreload: (file, type) => type === "script",
  template: VUE_TEMPLATE,
});

function getOriginalUri({ headers = {} } = { headers: {} }) {
  return headers &&
    RequestHelper.HEADER_X_URI in headers &&
    headers[RequestHelper.HEADER_X_URI].length &&
    HEADER_VALUE_KEY in headers[RequestHelper.HEADER_X_URI][0]
    ? headers[RequestHelper.HEADER_X_URI][0][HEADER_VALUE_KEY]
    : null;
}

function restoreOriginalUri(
  { request = { headers: {} } } = { request: { headers: {} } },
) {
  const { headers } = request;
  const originalUri = getOriginalUri({ headers });
  if (originalUri) {
    Object.assign(request, {
      uri: originalUri,
    });
  }
}

function handleRequestAndResponse(
  { request = {}, response = {}, callback = () => {} } = {
    request: {},
    response: {},
    callback: () => {},
  },
) {
  if (isOriginResponseWithStatus(response, "200")) {
    return callback(null, response);
  } else if (!isOriginResponseWithStatus(response, "403")) {
    console.error("ERROR: unhandled origin response", request, response);
    response.status = ResponseHelper.Constants.STATUS_VALUE_500;
    response.statusDescription = ResponseHelper.httpCodeToStatusDescription({
      httpCode: ResponseHelper.Constants.STATUS_VALUE_500,
    });
  } else {
    // Remove S3 403 (404) response status
    console.log("Remove S3 403 (404) response status");
    delete response.status;
    delete response.statusDescription;
  }

  restoreOriginalUri({ request });
  renderHtml(bundleRenderer, request, response, callback);
}

/*
 * AWS lambda function for the Vue SSR app.
 */
exports.handler = (event, context, callback) => {
  const { request, response } = event.Records[0].cf;

  handleRequestAndResponse({ request, response, callback });
};
