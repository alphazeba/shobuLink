

const cdk = require( "aws-cdk-lib" );
const { Construct } = require( "constructs" );
const apigateway = require("aws-cdk-lib/aws-apigateway");
const lambda = require("aws-cdk-lib/aws-lambda");
const ddb = require("aws-cdk-lib/aws-dynamodb");
const s3 = require("aws-cdk-lib/aws-s3");
const s3Deployment = require("aws-cdk-lib/aws-s3-deployment");

class ShobuClient extends Construct {
    constructor( scope, id, props ){
        super( scope, id, props );

        const indexDocument = "index.html";
        const shobuClientBucket = new s3.Bucket( this, "ShobuClientBucket", {
            publicReadAccess: true,
            removalPolicy: cdk.RemovalPolicy.DESTROY,
            websiteIndexDocument: indexDocument,
            websiteErrorDocument: indexDocument, // react router handles everything
        });

        const deployment = new s3Deployment.BucketDeployment( 
            this, "deployShobuClient", 
        {
            sources: [ s3Deployment.Source.asset(
                "../../client/shobu_client/build")],
            destinationBucket: shobuClientBucket
        });
    }
}

module.exports = { ShobuClient: ShobuClient };