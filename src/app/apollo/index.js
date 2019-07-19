import Vue from "vue";
import VueApollo from "vue-apollo";

Vue.use(VueApollo);

const createApolloProvider = ({ appSyncClient }) => {
  return new VueApollo({
    defaultClient: appSyncClient,
  });
};

export default createApolloProvider;
