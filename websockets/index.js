import { WebSocketServer, WebSocket } from "ws";

const wss = new WebSocketServer({ port: 8080 });

const users = new Map();

wss.on("connection", (socket, request) => {
  socket.on("message", (data) => {
    const msg = JSON.parse(data);

    if(msg.type === "regsiter"){
        users.set(msg.userId , socket);
        console.log(`${msg.userId} connected`)
    }

    // unicast
    if(msg.type === "private_message"){
        const targetClient = users.get(msg.to);

        if(targetClient?.readyState === WebSocket.OPEN){
            targetClient.send
            (
                JSON.stringify({
                    from:msg.userId,
                    text:msg.text
                })
            )
        }
    }
  });

  socket.on("error", (err) => {
    console.error("Socket Error:", err.message);
  });

  socket.on("close", () => {
    console.log("Client disconnected");
  });
});

console.log("Websocket server is live on ws://localhost:8080");
