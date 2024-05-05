const websocketApiUrl = 'wss://tj2xkkho5c.execute-api.us-west-2.amazonaws.com/prod/';
const ws = new WebSocket(websocketApiUrl);
ws.binaryType = "blob";

console.log("websocket code running");
ws.addEventListener("open", event => {
    console.log("Websocket conenction opened");
    let payload = {
        obj: "your mom",
        type: "Test",
    };
    sendWsMsg(payload);
});
ws.addEventListener("close", event => {
    console.log("Websocket connection closed");
});
ws.onmessage = function (message) {
    console.log("received message on websocket (plain): " + message);
    console.log("received message on websocket (json): " + JSON.stringify(message))
}
export function sendWsMsg(payload) {
    const stringified = JSON.stringify(payload);
    console.log("sending message on websocket: " + stringified);
    ws.send(stringified);
}