#!/usr/bin/env node

const cdk = require('aws-cdk-lib');
const { ShobuClientStack } = require('../lib/shobu-client-stack');
const { ShobuStack } = require('../lib/shobu-stack');


const prodEnv = {
  account: '012478530188', region: 'us-west-2'
}

const app = new cdk.App();

new ShobuStack(app, 'ShobuStack', {
  env: prodEnv
});

new ShobuClientStack( app, 'ShobuClientStack', {
  env: prodEnv
});
