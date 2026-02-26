import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:5000');

function App() {
  const [userName, setUserName] = useState('');
  const [isJoined, setIsJoined] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [users, setUsers] = useState([]);
  const [typingUser, setTypingUser] = useState('');
  const [tempName, setTempName] = useState('');
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    socket.on('userJoined', (data) => {
      setMessages((prev) => [...prev, {
        type: 'system',
        message: data.message,
        timestamp: new Date().toLocaleTimeString()
      }]);
      setUsers(data.users);
    });

    socket.on('receiveMessage', (data) => {
      setMessages((prev) => [...prev, {
        type: 'message',
        name: data.name,
        message: data.message,
        timestamp: data.timestamp,
        id: data.id
      }]);
      setTypingUser('');
    });

    socket.on('userLeft', (data) => {
      setMessages((prev) => [...prev, {
        type: 'system',
        message: data.message,
        timestamp: new Date().toLocaleTimeString()
      }]);
      setUsers(data.users);
    });

    socket.on('userTyping', (data) => {
      if (data.isTyping) {
        setTypingUser(`${data.name} is typing...`);
      } else {
        setTypingUser('');
      }
    });

    return () => {
      socket.off('userJoined');
      socket.off('receiveMessage');
      socket.off('userLeft');
      socket.off('userTyping');
    };
  }, []);

  const handleJoin = (e) => {
    e.preventDefault();
    if (tempName.trim()) {
      setUserName(tempName);
      setIsJoined(true);
      socket.emit('join', tempName);
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (inputMessage.trim()) {
      socket.emit('sendMessage', { message: inputMessage });
      setInputMessage('');
      socket.emit('typing', false);
    }
  };

  const handleInputChange = (e) => {
    setInputMessage(e.target.value);
    socket.emit('typing', true);

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set new timeout to emit typing false after 2 seconds of inactivity
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit('typing', false);
    }, 2000);
  };

  if (!isJoined) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-96">
          <h1 className="text-3xl font-bold text-center mb-8 text-white">Chat App</h1>
          <form onSubmit={handleJoin}>
            <input
              type="text"
              placeholder="Enter your name"
              value={tempName}
              onChange={(e) => setTempName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-600 mb-4"
              autoFocus
            />
            <button
              type="submit"
              className="w-full bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition"
            >
              Join Chat
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-900">
      {/* Sidebar - Online Users */}
      <div className="w-64 bg-gray-800 shadow-lg p-4 overflow-y-auto border-r border-gray-700">
        <h2 className="text-xl font-bold mb-4 text-white">Online Users ({users.length})</h2>
        <div className="space-y-2">
          {users.map((user) => (
            <div key={user.id} className="flex items-center space-x-2 p-2 bg-gray-700 rounded">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className={`text-sm font-medium ${user.name === userName ? 'text-gray-200 font-bold' : 'text-gray-300'}`}>
                {user.name === userName ? `${user.name} (you)` : user.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-gray-800 shadow p-4 border-b border-gray-700">
          <h1 className="text-2xl font-bold text-white">General Chat</h1>
          <p className="text-sm text-gray-400">Welcome, {userName}</p>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500 text-center">No messages yet. Start chatting!</p>
            </div>
          ) : (
            messages.map((msg, idx) => (
              <div key={idx}>
                {msg.type === 'system' ? (
                  <div className="text-center">
                    <p className="inline-block bg-gray-700 text-gray-400 text-xs px-3 py-1 rounded">
                      {msg.message}
                    </p>
                  </div>
                ) : (
                  <div className={`flex ${msg.id === socket.id ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-xs px-4 py-2 rounded-lg ${
                      msg.id === socket.id
                        ? 'bg-gray-700 text-white rounded-br-none'
                        : 'bg-gray-700 text-gray-100 border border-gray-600 rounded-bl-none'
                    }`}>
                      {msg.id !== socket.id && (
                        <p className="text-xs font-semibold text-gray-400 mb-1">
                          {msg.name}
                        </p>
                      )}
                      <p className="break-words">{msg.message}</p>
                      <p className={`text-xs mt-1 ${
                        msg.id === socket.id ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        {msg.timestamp}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
          {typingUser && (
            <div className="flex justify-start">
              <p className="text-xs italic text-gray-500">{typingUser}</p>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="bg-gray-800 border-t border-gray-700 p-4">
          <form onSubmit={handleSendMessage} className="flex space-x-2">
            <input
              type="text"
              placeholder="Type your message..."
              value={inputMessage}
              onChange={handleInputChange}
              className="flex-1 px-4 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-600"
            />
            <button
              type="submit"
              className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-6 rounded-lg transition"
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default App;
