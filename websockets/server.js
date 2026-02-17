import { WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: 8080 });

// 0" connecting , 1 open ,2 closing , 3 closed

// Connectiion Event
wss.on("connection", (socket, request) => {
  const ip = request.socket.remoteAddress;

  socket.on("message", (rawData) => {
    const message = rawData.toString();
    console.log({ rawData });

    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN)
        client.send(`Server Broadcast: ${message}`);
    });
  });

  socket.on("error", (err) => {
    console.error(`Error: ${err.message}: ${ip}`);
  });

  socket.on("close", () => {
    console.log("Client Disconnected");
  });
});

console.log("Websocket server is live on ws://localhost:8080")