const { Stack } = require('aws-cdk-lib');
const ShobuService = require('./shobu-service');
// const sqs = require('aws-cdk-lib/aws-sqs');

class ShobuStack extends Stack {
  /**
   *
   * @param {Construct} scope
   * @param {string} id
   * @param {StackProps=} props
   */
  constructor(scope, id, props) {
    super(scope, id, props);
  
    new ShobuService.ShobuService( this, "ShobuService", props )
  }
}

module.exports = { ShobuStack: ShobuStack }
