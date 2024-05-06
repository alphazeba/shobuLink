import boto3
import os
import util.jsonHelp as json

class ConnectionClient:
    def __init__(self):
        # https://boto3.amazonaws.com/v1/documentation/api/1.18.51/reference/services/apigatewaymanagementapi.html
        url = os.environ.get("websocketUrl")
        self.socketClient = boto3.client('apigatewaymanagementapi', endpoint_url=url)
        print("built connectionClient with url " + url)
    
    def sendToConnection(self, connectionId, payload):
        stringified = json.dumps(payload)
        print("sending " + stringified + " to " + connectionId)
        self.socketClient.post_to_connection(
            Data=stringified,
            ConnectionId=connectionId,
        )