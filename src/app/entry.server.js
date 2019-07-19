import ApolloSSR from "vue-apollo/ssr";

import createApp from "./app";

/*
 * Export a function that creates the Vue app on the server side and loads the
 * appropriate route. This function is called by the bundle renderer in the
 * renderToString method (in ./server/index.base.js) and is automatically passed the
 * bundle renderer's context.
 */
export default (bundleRendererContext) =>
  new Promise((resolve, reject) => {
    const { apolloProvider, app, router, store } = createApp();
    const { uri } = bundleRendererContext;
    const { fullPath: properlyStructuredUri, matched } = router.resolve(
      uri,
    ).route;
    let httpCode = 200;

    if (uri !== properlyStructuredUri) {
      httpCode = 301;
      return reject({
        httpCode,
        toUri: properlyStructuredUri,
      });
    } else if (!matched.length) {
      httpCode = 404;
      return reject({
        httpCode,
      });
    }

    router.push(uri);

    return router.onReady(() => {
      // Expose the state on the bundle renderer's context so that it will be
      // automatically inlined into the page markup
      Object.assign(bundleRendererContext, {
        httpCode,
        rendered: () => {
          // After the app is rendered, our store is now
          // filled with the state from our components.
          // When we attach the state to the context, and the `template` option
          // is used for the renderer, the state will automatically be
          // serialized and injected into the HTML as `window.__INITIAL_STATE__`.
          Object.assign(bundleRendererContext, {
            apolloState: ApolloSSR.getStates(apolloProvider),
            state: store.state,
          });
        },
        vueMeta: app.$meta(),
      });

      resolve(app);
    });
  });
