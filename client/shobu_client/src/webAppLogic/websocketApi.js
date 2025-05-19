import { useEffect, useRef } from 'react';

const websocketApiUrl = 'wss://tj2xkkho5c.execute-api.us-west-2.amazonaws.com/prod/';

export const useWebsocket = (callbackFn, connect) => {
    const wsRef = useRef(null);

    const initWebsocket = () => {
        console.log("opening new websocket connection");
        const ws = new WebSocket(websocketApiUrl);
        ws.binaryType = "blob";
        ws.addEventListener("open", event => {
            console.log("Websocket connection opened");
        });
        ws.addEventListener("close", event => {
            console.log("Websocket connection closed");
        });
        ws.addEventListener("message", event => {
            console.log("the other message event listenr")
            console.log( event );
            if (callbackFn) {
                callbackFn(JSON.parse(event['data']));
            }
        });
        return ws;
    }

    useEffect(() => {
        if (connect) {
            wsRef.current = initWebsocket();
        }
        return () => {
            if (wsRef.current != null && wsRef.current.readyState <= 1) {
                wsRef.current.close();
            }
        }
    }, [connect]);

    const SLEEP_MS = 500;
    const MAX_SLEEPS = 20;
    const send = async (payload) => {
        const stringified = JSON.stringify(payload);
        console.log("sending message on websocket: " + stringified);
        console.log("wsRef.current: ", wsRef.current);
        if (wsRef.current !== null) {
            for (let i=0; websocketIsNotReady(wsRef.current) && i<MAX_SLEEPS; i++) {
                console.log("websocket not open, sleeping: ", i);
                await new Promise(r => setTimeout(r, SLEEP_MS));
            }
            wsRef.current.send(stringified);
        } else {
            console.log("wsRef is null, did not send message")
        }
    }

    const websocketIsNotReady = (websocket) => {
        // https://developer.mozilla.org/en-US/docs/Web/API/WebSocket/readyState
        return websocket.readyState < 1;
    }

    return {
        send,
    }
}
