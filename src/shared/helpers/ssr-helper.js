const CompressionHelper = require("./compression-helper");

const App = require("../../../dist/app");

const HEADER_VALUE_KEY = "value";

const HEADERS_ACCEPT_ENCODING_NONE = {
  [CompressionHelper.HEADER_ACCEPT_ENCODING]: [
    {
      [HEADER_VALUE_KEY]: CompressionHelper.COMPRESSION_NONE_ENCODING,
    },
  ],
};

function getHtml(
  { headers = HEADERS_ACCEPT_ENCODING_NONE, uri = "/" } = {
    headers: HEADERS_ACCEPT_ENCODING_NONE,
    uri: "/",
  },
) {
  const event = {
    Records: [
      {
        cf: {
          request: {
            headers,
            originalUri: uri,
            uri,
          },
          response: {
            status: "403",
          },
        },
      },
    ],
  };

  return new Promise((resolve) => {
    App.handler(event, null, (error, response) => {
      resolve(response.body);
    });
  });
}

export default {
  getHtml,
};
