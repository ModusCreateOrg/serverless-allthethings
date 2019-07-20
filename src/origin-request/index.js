const CompressionHelper = require("../shared/helpers/compression-helper");
const RequestHelper = require("../shared/helpers/request-helper");

function setOriginalUri(
  { request = { headers: {}, uri: "" } } = {
    request: { headers: {}, uri: "" },
  },
) {
  const { headers, uri } = request;
  Object.assign(headers, {
    [RequestHelper.HEADER_X_URI]: [{ value: uri }],
  });
}

function appendIndexHtml({ request = { uri: "" } } = { request: { uri: "" } }) {
  const { uri } = request;
  if (uri.endsWith("/")) {
    Object.assign(request, {
      uri: `${uri}index.html`,
    });
  }
}

function appendCompressionExtension(
  { request = { uri: "" } } = { request: { uri: "" } },
) {
  const { headers, uri } = request;
  const compressionExtension = CompressionHelper.getCompressionExtension({
    headers,
  });
  if (
    !CompressionHelper.isPrecompressed({ uri }) &&
    compressionExtension &&
    !uri.endsWith(compressionExtension)
  ) {
    Object.assign(request, {
      uri: `${uri}${compressionExtension}`,
    });
  }
}

exports.handler = (event, context, callback) => {
  const { request } = event.Records[0].cf;

  setOriginalUri({ request });
  appendIndexHtml({ request });
  appendCompressionExtension({ request });

  return callback(null, request);
};
