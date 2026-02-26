# Simple Chat App

A minimal real-time chat application built with Express, Socket.IO, React, and Tailwind CSS.

## Features

- ✅ Users join by entering their name
- ✅ Single shared chat room
- ✅ Real-time messaging with Socket.IO
- ✅ Online users list with status indicator
- ✅ Typing indicators
- ✅ System messages for user joins/leaves
- ✅ Timestamps for each message
- ✅ Clean, modern UI with Tailwind CSS

## Project Structure

```
chat-app/
├── backend/
│   ├── package.json
│   ├── server.js
│   └── node_modules/
└── frontend/
    ├── public/
    ├── src/
    ├── package.json
    ├── tailwind.config.js
    ├── postcss.config.js
    └── node_modules/
```

## Setup & Installation

### Backend Setup

1. Navigate to the backend folder:
   ```
   cd backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the server:
   ```
   npm start
   ```
   The server will run on http://localhost:5000

### Frontend Setup

1. Open a new terminal and navigate to the frontend folder:
   ```
   cd frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm start
   ```
   The app will open at http://localhost:3000

## How to Use

1. Open http://localhost:3000 in your browser
2. Enter your name and click "Join Chat"
3. See online users in the sidebar (with green status indicator)
4. Type messages in the input box and press "Send"
5. Typing indicator appears when someone is typing
6. System messages notify when users join or leave

## Socket Events

### Client → Server
- `join`: User joins with their name
- `sendMessage`: Send a message to the room
- `typing`: User is typing (true/false)

### Server → Client
- `userJoined`: Notification when user joins
- `receiveMessage`: Receive a message from the room
- `userLeft`: Notification when user leaves
- `userTyping`: Shows typing status

## Technologies Used

- **Backend**: Express.js, Socket.IO, Node.js
- **Frontend**: React, Socket.IO Client
- **Styling**: Tailwind CSS
- **Communication**: WebSockets

## Notes

- Only one chat room ("general") exists
- Messages are not persisted (lost on server restart)
- No authentication required
- No user data is stored permanently
