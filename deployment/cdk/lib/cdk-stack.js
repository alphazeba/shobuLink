const { Stack, Duration } = require('aws-cdk-lib');
const ShobuService = require('./shobu-service');
// const sqs = require('aws-cdk-lib/aws-sqs');

class CdkStack extends Stack {
  /**
   *
   * @param {Construct} scope
   * @param {string} id
   * @param {StackProps=} props
   */
  constructor(scope, id, props) {
    super(scope, id, props);
  
    new ShobuService.ShobuService( this, "ShobuService" )
    // The code that defines your stack goes here

    // example resource
    // const queue = new sqs.Queue(this, 'CdkQueue', {
    //   visibilityTimeout: Duration.seconds(300)
    // });
  }
}

module.exports = { CdkStack }
