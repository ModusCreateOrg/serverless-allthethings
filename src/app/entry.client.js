import "core-js/stable";

import createAppSyncClient from "./appsync";
import createApolloProvider from "./apollo";
import createApp from "./app";

const appSyncClient = createAppSyncClient({ store });
const apolloProvider = createApolloProvider({ appSyncClient });

const { app, router, store } = createApp({ apolloProvider });

if (window.__INITIAL_STATE__) {
  // Prime the store with the server initialized state that was automatically inlined into the page markup
  store.replaceState(window.__INITIAL_STATE__);
}

router.onReady(() => {
  app.$mount("#serverless-allthethings");
});

if ("https:" === location.protocol && "serviceWorker" in navigator) {
  navigator.serviceWorker.register("/service-worker.js");
}
