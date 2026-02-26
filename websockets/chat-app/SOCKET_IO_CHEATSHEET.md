# Socket.IO Quick Reference Cheat Sheet

Perfect for quick lookup while coding or teaching!

---

## Backend Socket.IO Patterns

### 1. Basic Server Setup

```javascript
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});

app.use(cors());
app.use(express.json());

// Start server
const PORT = 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

### 2. Handle Connection

```javascript
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  
  // All socket event handlers go here
  
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});
```

### 3. Listen for Event from Client

```javascript
socket.on('eventName', (data) => {
  console.log('Received:', data);
  // Process data
  // Send response back
});
```

### 4. Send to Only One Client

```javascript
socket.emit('eventName', {
  message: 'Only this user receives this'
});
```

### 5. Send to All Users in Room

```javascript
io.to('roomName').emit('eventName', {
  message: 'Everyone in roomName receives this'
});
```

### 6. Send to All EXCEPT Sender

```javascript
socket.broadcast.to('roomName').emit('eventName', {
  message: 'Everyone in roomName except sender'
});
```

### 7. Send to All Connected Users

```javascript
io.emit('eventName', {
  message: 'EVERYONE connected gets this'
});
```

### 8. Add Socket to Room

```javascript
socket.on('join', (roomName) => {
  socket.join(roomName);
  console.log(`User ${socket.id} joined ${roomName}`);
});
```

### 9. Remove Socket from Room

```javascript
socket.leave('roomName');
console.log('User left room');
```

### 10. Get All Sockets in Room

```javascript
const sockets = io.sockets.adapter.rooms.get('roomName');
console.log('Users in room:', sockets.size);
```

### 11. Store Data with Socket

```javascript
socket.data.userName = 'Alice';
socket.data.isAdmin = false;

// Access later
console.log(socket.data.userName);
```

### 12. Handle Multiple Events

```javascript
socket.on('connection', (socket) => {
  socket.on('event1', (data) => { ... });
  socket.on('event2', (data) => { ... });
  socket.on('event3', (data) => { ... });
  socket.on('disconnect', () => { ... });
});
```

### 13. Get Socket by ID

```javascript
const targetSocket = io.sockets.sockets.get(socketId);
targetSocket.emit('message', 'Direct message');
```

### 14. Count Connected Users

```javascript
const count = io.engine.clientsCount;
console.log(`Connected users: ${count}`);
```

### 15. Broadcast with Error Handling

```javascript
io.to('roomName').emit('eventName', data, (acknowledgement) => {
  console.log('Acknowledgement received:', acknowledgement);
});
```

---

## Frontend Socket.IO Patterns

### 1. Initialize Socket

```javascript
import io from 'socket.io-client';

// Connect to backend
const socket = io('http://localhost:5000');

// Or with options
const socket = io('http://localhost:5000', {
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  reconnectionAttempts: 5
});
```

### 2. Emit Event to Server (No Response)

```javascript
socket.emit('eventName', { data: 'value' });

// Multiple arguments
socket.emit('eventName', 'arg1', { arg2: 'value' });
```

### 3. Emit Event with Response (Callback)

```javascript
socket.emit('eventName', data, (response) => {
  console.log('Server responded with:', response);
});
```

### 4. Listen for Event from Server

```javascript
socket.on('eventName', (data) => {
  console.log('Received from server:', data);
  // Update state, UI, etc.
});
```

### 5. Listen Once (Only First Time)

```javascript
socket.once('eventName', (data) => {
  console.log('This runs only once:', data);
});
```

### 6. Stop Listening to Event

```javascript
socket.off('eventName');
// or
socket.removeListener('eventName');
```

### 7. Setup in React useEffect

```javascript
useEffect(() => {
  // Listen for events
  socket.on('eventName', (data) => {
    console.log(data);
  });

  // Cleanup
  return () => {
    socket.off('eventName');
  };
}, []);
```

### 8. Multiple Listeners Cleanup

```javascript
useEffect(() => {
  socket.on('event1', handler1);
  socket.on('event2', handler2);
  socket.on('event3', handler3);

  return () => {
    socket.off('event1');
    socket.off('event2');
    socket.off('event3');
  };
}, []);
```

### 9. Check Connection Status

```javascript
if (socket.connected) {
  console.log('Connected');
} else {
  console.log('Disconnected');
}
```

### 10. Listen to Connection Events

```javascript
socket.on('connect', () => {
  console.log('Connected to server');
});

socket.on('disconnect', () => {
  console.log('Disconnected from server');
});

socket.on('connect_error', (error) => {
  console.log('Connection error:', error);
});
```

### 11. Emit with Acknowledgement

```javascript
socket.emit('eventName', { data: 'value' }, (acknowledgement) => {
  console.log('Server acknowledged:', acknowledgement);
});
```

### 12. Access Socket ID

```javascript
const mySocketId = socket.id;
console.log('My socket ID:', mySocketId);
```

### 13. Reconnect Manually

```javascript
socket.connect();
// or
socket.disconnect();
socket.connect();
```

### 14. Clear All Listeners

```javascript
socket.removeAllListeners();
```

### 15. Update State on Event

```javascript
socket.on('receivedData', (data) => {
  setData((prevData) => [...prevData, data]);
});
```

---

## Common Chat App Patterns

### Server: User Joins Room

```javascript
const users = [];

socket.on('join', (name) => {
  const user = { id: socket.id, name };
  users.push(user);
  socket.join('general');
  
  io.to('general').emit('userJoined', {
    message: `${name} joined`,
    users: users
  });
});
```

### Server: Send Message

```javascript
socket.on('sendMessage', (data) => {
  const user = users.find(u => u.id === socket.id);
  if (user) {
    io.to('general').emit('receiveMessage', {
      name: user.name,
      message: data.message,
      timestamp: new Date().toLocaleTimeString()
    });
  }
});
```

### Server: Typing Status

```javascript
socket.on('typing', (isTyping) => {
  const user = users.find(u => u.id === socket.id);
  if (user) {
    io.to('general').emit('userTyping', {
      name: user.name,
      isTyping: isTyping
    });
  }
});
```

### Server: User Disconnect

```javascript
socket.on('disconnect', () => {
  const user = users.find(u => u.id === socket.id);
  if (user) {
    users = users.filter(u => u.id !== socket.id);
    io.to('general').emit('userLeft', {
      message: `${user.name} left`,
      users: users
    });
  }
});
```

### Client: Join Chat

```javascript
const handleJoin = (name) => {
  socket.emit('join', name);
};
```

### Client: Send Message

```javascript
const handleSendMessage = (message) => {
  socket.emit('sendMessage', { message });
};

socket.on('receiveMessage', (data) => {
  setMessages([...messages, data]);
});
```

### Client: Typing Indicator

```javascript
const handleInputChange = (value) => {
  setInput(value);
  socket.emit('typing', true);
  
  clearTimeout(typingTimeout);
  setTypingTimeout(setTimeout(() => {
    socket.emit('typing', false);
  }, 2000));
};

socket.on('userTyping', (data) => {
  if (data.isTyping) {
    setTypingUser(`${data.name} is typing...`);
  } else {
    setTypingUser('');
  }
});
```

### Client: User List

```javascript
socket.on('userJoined', (data) => {
  setUsers(data.users);
});

socket.on('userLeft', (data) => {
  setUsers(data.users);
});
```

---

## Error Handling Patterns

### Server: Validate Data

```javascript
socket.on('sendMessage', (data) => {
  if (!data || !data.message) {
    socket.emit('error', { message: 'Invalid message' });
    return;
  }
  // Process message
});
```

### Client: Handle Errors

```javascript
socket.on('error', (data) => {
  console.log('Error from server:', data.message);
  // Show error message to user
});

socket.on('connect_error', (error) => {
  console.log('Connection error:', error);
  // Retry logic, show reconnecting message
});
```

### Server: Require Authentication

```javascript
socket.on('join', (data) => {
  if (!data.name || data.name.trim() === '') {
    socket.emit('error', { message: 'Name is required' });
    return;
  }
  // Continue with join
});
```

---

## Performance Tips

### 1. Don't Emit Too Frequently

```javascript
// ❌ BAD: Emits on every keystroke
const handleInput = (e) => {
  socket.emit('typing', true);
};

// ✅ GOOD: Throttle or debounce
const handleInput = (e) => {
  clearTimeout(typingTimeout);
  socket.emit('typing', true);
  setTypingTimeout(setTimeout(() => {
    socket.emit('typing', false);
  }, 2000));
};
```

### 2. Cleanup Listeners

```javascript
// ❌ BAD: Listeners accumulate
useEffect(() => {
  socket.on('event', handler);
});

// ✅ GOOD: Remove on unmount
useEffect(() => {
  socket.on('event', handler);
  return () => {
    socket.off('event');
  };
}, []);
```

### 3. Use Rooms for Targeted Broadcasting

```javascript
// ❌ BAD: Send to all users even if in different rooms
io.emit('message', data);

// ✅ GOOD: Send only to users in the room
io.to('roomName').emit('message', data);
```

### 4. Limit Message History

```javascript
// ❌ BAD: Store all messages in memory forever
let allMessages = [];

// ✅ GOOD: Keep recent messages, archive old ones
const MAX_MESSAGES = 100;
if (messages.length > MAX_MESSAGES) {
  messages.shift(); // Remove oldest
}
```

---

## Common Mistakes

### ❌ Not Removing Listeners in React

```javascript
// WRONG - listeners stack up, memory leak
useEffect(() => {
  socket.on('event', handler);
});

// RIGHT - cleanup listeners
useEffect(() => {
  socket.on('event', handler);
  return () => socket.off('event');
}, []);
```

### ❌ Using socket.emit() Instead of io.to().emit()

```javascript
// WRONG - only that socket gets message
socket.emit('message', data);

// RIGHT - all in room get message
io.to('roomName').emit('message', data);
```

### ❌ Not Handling socket.id in Backend

```javascript
// WRONG - no way to identify sender
io.to(room).emit('message', 'Hello');

// RIGHT - include socket id for identification
io.to(room).emit('message', {
  id: socket.id,
  name: user.name,
  text: 'Hello'
});
```

### ❌ Not Joining Room

```javascript
// WRONG - user not in room, won't receive broadcasts
socket.on('join', (name) => {
  // ... add to users
  // Missing: socket.join(room)
});

// RIGHT - explicitly join room
socket.on('join', (name) => {
  // ... add to users
  socket.join('general');
});
```

### ❌ Forgetting CORS Configuration

```javascript
// WRONG - frontend can't connect
const io = socketIo(server);

// RIGHT - allow frontend to connect
const io = socketIo(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});
```

### ❌ Not Validating Data on Backend

```javascript
// WRONG - trust client data (security risk)
socket.on('message', (data) => {
  users.push(data);
});

// RIGHT - validate and construct on server
socket.on('message', (data) => {
  const user = users.find(u => u.id === socket.id);
  if (user && data.text) {
    const message = {
      id: socket.id,
      name: user.name,
      text: data.text,
      timestamp: new Date()
    };
    io.to('room').emit('message', message);
  }
});
```

---

## Debugging Commands

### Check if Socket Connected

```javascript
// Frontend
console.log('Connected:', socket.connected); // true/false
console.log('Socket ID:', socket.id);
```

### Log All Emitted Events

```javascript
// Frontend - add to every emit
socket.emit('eventName', data);
console.log('Emitted:', 'eventName', data);
```

### Log All Received Events

```javascript
// Frontend - add to every listener
socket.on('eventName', (data) => {
  console.log('Received:', 'eventName', data);
});
```

### Check Connected Users

```javascript
// Backend
io.on('connection', (socket) => {
  console.log('Total connected:', io.engine.clientsCount);
});
```

### Inspect Room Members

```javascript
// Backend
const room = io.sockets.adapter.rooms.get('roomName');
console.log('Users in room:', Array.from(room));
```

---

## Quick Setup Template

### Backend (server.js)

```javascript
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: { origin: 'http://localhost:3000', methods: ['GET', 'POST'] }
});

app.use(cors());

let users = [];
const ROOM = 'general';

io.on('connection', (socket) => {
  socket.on('join', (name) => {
    users.push({ id: socket.id, name });
    socket.join(ROOM);
    io.to(ROOM).emit('userJoined', { users });
  });

  socket.on('message', (data) => {
    io.to(ROOM).emit('message', { id: socket.id, text: data });
  });

  socket.on('disconnect', () => {
    users = users.filter(u => u.id !== socket.id);
    io.to(ROOM).emit('userLeft', { users });
  });
});

server.listen(5000, () => console.log('Server on 5000'));
```

### Frontend (App.js)

```javascript
import { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:5000');

export default function App() {
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    socket.on('message', (data) => {
      setMessages(prev => [...prev, data]);
    });
    socket.on('userJoined', (data) => {
      setUsers(data.users);
    });
    return () => {
      socket.off('message');
      socket.off('userJoined');
    };
  }, []);

  const send = () => {
    socket.emit('message', input);
    setInput('');
  };

  return (
    <div>
      <h1>Chat ({users.length} online)</h1>
      <div>
        {messages.map((msg, i) => <p key={i}>{msg.text}</p>)}
      </div>
      <input value={input} onChange={e => setInput(e.target.value)} />
      <button onClick={send}>Send</button>
    </div>
  );
}
```

---

Print this cheat sheet and keep it handy! 📌

