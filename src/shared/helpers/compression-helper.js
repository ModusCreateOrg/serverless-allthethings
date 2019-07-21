const COMPRESSION_BROTLI_ENCODING = "br";
const COMPRESSION_BROTLI_EXTENSION = ".br";
const COMPRESSION_GZIP_ENCODING = "gzip";
const COMPRESSION_GZIP_EXTENSION = ".gz";
const COMPRESSION_NONE_ENCODING = "none";
const COMPRESSION_NONE_EXTENSION = "";
const HEADER_ACCEPT_ENCODING = "accept-encoding";
const HEADER_CONTENT_ENCODING = "content-encoding";
const PRECOMPRESSED_EXTENSIONS = ["png", "zip"];

const ENCODING_BASE64 = "base64";
const HEADER_VALUE_KEY = "value";

function getAcceptableEncodings({ headers = {} } = { headers: {} }) {
  return headers &&
    HEADER_ACCEPT_ENCODING in headers &&
    headers[HEADER_ACCEPT_ENCODING].length &&
    HEADER_VALUE_KEY in headers[HEADER_ACCEPT_ENCODING][0]
    ? headers[HEADER_ACCEPT_ENCODING][0][HEADER_VALUE_KEY].split(",").map(
        (encoding) =>
          encoding
            .substring(
              0,
              encoding.indexOf(";") > -1
                ? encoding.indexOf(";")
                : encoding.length,
            )
            .trim(),
      )
    : [COMPRESSION_NONE_ENCODING];
}

function getCompressedResponseProperties(
  { encoding = COMPRESSION_NONE_ENCODING, html = "" } = {
    encoding: COMPRESSION_NONE_ENCODING,
    html: "",
  },
) {
  switch (encoding) {
    case COMPRESSION_GZIP_ENCODING: {
      return getGzipCompressedResponseProperties({ html });
    }
    default: {
      return {};
    }
  }
}

function getCompressionExtension({ headers = {} } = { headers: {} }) {
  const acceptableEncodings = getAcceptableEncodings({ headers });

  if (acceptableEncodings.includes(COMPRESSION_BROTLI_ENCODING)) {
    return COMPRESSION_BROTLI_EXTENSION;
  } else if (acceptableEncodings.includes(COMPRESSION_GZIP_ENCODING)) {
    return COMPRESSION_GZIP_EXTENSION;
  } else {
    return COMPRESSION_NONE_EXTENSION;
  }
}

function getGzipCompressedResponseProperties({ html = "" } = { html: "" }) {
  const zlib = require("zlib");
  return {
    body: zlib
      .gzipSync(html, { level: zlib.Z_BEST_COMPRESSION })
      .toString(ENCODING_BASE64),
    bodyEncoding: ENCODING_BASE64,
    headers: {
      [HEADER_CONTENT_ENCODING]: [
        { [HEADER_VALUE_KEY]: COMPRESSION_GZIP_ENCODING },
      ],
    },
  };
}

function getOptimalEncoding(
  { headers = {}, uri = "" } = { headers: {}, uri: "" },
) {
  if (
    headers &&
    HEADER_ACCEPT_ENCODING in headers &&
    headers[HEADER_ACCEPT_ENCODING].length &&
    HEADER_VALUE_KEY in headers[HEADER_ACCEPT_ENCODING][0]
  ) {
    const acceptableEncodings = getAcceptableEncodings({ headers });
    if (uri.endsWith(COMPRESSION_BROTLI_EXTENSION)) {
      return COMPRESSION_BROTLI_ENCODING;
    } else if (uri.endsWith(COMPRESSION_GZIP_EXTENSION)) {
      return COMPRESSION_GZIP_ENCODING;
    } else if (isBrCompressible({ acceptableEncodings, uri })) {
      return COMPRESSION_BROTLI_ENCODING;
    } else if (isGzipCompressible({ acceptableEncodings, uri })) {
      return COMPRESSION_GZIP_ENCODING;
    }
  }

  return COMPRESSION_NONE_ENCODING;
}

function isBrCompressible(
  { acceptableEncodings = [], uri = "" } = { acceptableEncodings: [], uri: "" },
) {
  return (
    acceptableEncodings.indexOf(COMPRESSION_BROTLI_ENCODING) >= 0 &&
    !isPrecompressed({ uri })
  );
}

function isGzipCompressible(
  { acceptableEncodings = [], uri = "" } = { acceptableEncodings: [], uri: "" },
) {
  return (
    acceptableEncodings.indexOf(COMPRESSION_GZIP_ENCODING) >= 0 &&
    !isPrecompressed({ uri })
  );
}

function isPrecompressed({ uri = "" } = { uri: "" }) {
  const lastPeriodIndex = uri.lastIndexOf(".");
  if (lastPeriodIndex < 0) {
    return false;
  }

  return (
    PRECOMPRESSED_EXTENSIONS.indexOf(uri.substring(lastPeriodIndex + 1)) >= 0
  );
}

module.exports = {
  COMPRESSION_BROTLI_ENCODING,
  COMPRESSION_BROTLI_EXTENSION,
  COMPRESSION_GZIP_ENCODING,
  COMPRESSION_GZIP_EXTENSION,
  COMPRESSION_NONE_ENCODING,
  COMPRESSION_NONE_EXTENSION,
  HEADER_ACCEPT_ENCODING,
  PRECOMPRESSED_EXTENSIONS,
  getCompressedResponseProperties,
  getCompressionExtension,
  getGzipCompressedResponseProperties,
  getOptimalEncoding,
  isBrCompressible,
  isGzipCompressible,
  isPrecompressed,
};
