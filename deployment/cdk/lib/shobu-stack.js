const { Stack } = require('aws-cdk-lib');
const ShobuService = require('./shobu-service');
const ShobuWebsocketService = require('./shobu-websocket-service');

class ShobuStack extends Stack {
  /**
   *
   * @param {Construct} scope
   * @param {string} id
   * @param {StackProps=} props
   */
  constructor(scope, id, props) {
    super(scope, id, props);
  
    const shobuWebsocketService = new ShobuWebsocketService.ShobuWebsocketService(this, "ShobuWebsocketService", props);
    const shobuService = new ShobuService.ShobuService( this, "ShobuService", {
      ...props,
      webSocketApi: shobuWebsocketService.webSocketApi,
      connectionTable: shobuWebsocketService.connectionTable,
    });
  }
}

module.exports = { ShobuStack: ShobuStack }
