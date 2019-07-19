const AwsRds = require("aws-sdk/clients/rds");
const cloudFormationResponse = require("cfn-response");

const rds = new AwsRds({ apiVersion: "2014-10-31" });

exports.handler = function(event, context) {
  rds
    .modifyDBCluster({
      DBClusterIdentifier: event.ResourceProperties.DBClusterIdentifier,
      EnableHttpEndpoint: true,
    })
    .promise()
    .then(() => {
      cloudFormationResponse.send(
        event,
        context,
        cloudFormationResponse.SUCCESS,
      );
    })
    .catch(() => {
      cloudFormationResponse.send(
        event,
        context,
        cloudFormationResponse.FAILED,
      );
    });
};
