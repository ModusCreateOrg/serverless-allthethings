import AWSAppSyncClient, { AUTH_TYPE } from "aws-appsync";

const createAppSyncClient = () => {
  return new AWSAppSyncClient(
    {
      auth: {
        type: AUTH_TYPE.AMAZON_COGNITO_USER_POOLS,
        jwtToken: null,
      },
      disableOffline: process.env.VUE_ENV === "server",
      region: process.env.APPSYNC_GRAPHQL_API_REGION,
      url: "/api/graphql",
    },
    {
      defaultOptions: {
        query: {
          errorPolicy: "all",
          fetchPolicy:
            process.env.VUE_ENV === "server"
              ? "network-only"
              : "cache-and-network",
        },
      },
      ssrMode: process.env.VUE_ENV === "server",
    },
  );
};

export default createAppSyncClient;
