import { WebSocket, WebSocketServer } from "ws";

const webSocketServer = new WebSocketServer({ port: 8082 });
const webSockets: WebSocket[] = [];
webSocketServer.on("connection", (webSocket) => {
  webSockets.push(webSocket);
  webSocket.on("message", (data) => {
    console.log(`received: ${data}`);
    webSockets.forEach((webSocket) => webSocket.send(data));
  });
});
