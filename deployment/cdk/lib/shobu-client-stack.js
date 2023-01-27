
const { Stack, Duration } = require('aws-cdk-lib');
const ShobuClient = require('./shobu-client');


class ShobuClientStack extends Stack {

    constructor( scope, id, props ) {
        super( scope,id,props);

        new ShobuClient.ShobuClient( this, "ShobuClient", props );
    }
}


module.exports = { ShobuClientStack: ShobuClientStack }