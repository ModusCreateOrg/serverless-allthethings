const requestHelper = require("../shared/helpers/request-helper");

exports.handler = (event, context, callback) => {
  const { request } = event.Records[0].cf;

  if (requestHelper.isInvalidRequestRequiringRedirect({ request })) {
    return requestHelper.onInvalidRequestRequiringRedirect({
      request,
      callback,
    });
  } else if (requestHelper.isInvalidRequestRequiringRewrite({ request })) {
    requestHelper.onInvalidRequestRequiringRewrite({
      request,
    });
  }

  return callback(null, request);
};
