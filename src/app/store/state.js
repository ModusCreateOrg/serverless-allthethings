import StoreConstants from "./constants";

let jwtTokenPromiseResolve;
let jwtTokenPromiseReject;
const jwtTokenPromise = new Promise((resolve, reject) => {
  jwtTokenPromiseResolve = resolve;
  jwtTokenPromiseReject = reject;
});

export default {
  [StoreConstants.STATE.APPSYNC.JWT_TOKEN_PROMISE]: jwtTokenPromise,
  [StoreConstants.STATE.APPSYNC
    .JWT_TOKEN_PROMISE_REJECT]: jwtTokenPromiseReject,
  [StoreConstants.STATE.APPSYNC
    .JWT_TOKEN_PROMISE_RESOLVE]: jwtTokenPromiseResolve,
};
