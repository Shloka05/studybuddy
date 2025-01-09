import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import io from 'socket.io-client';
import axios from 'axios';

const ENDPOINT = "http://localhost:5000"; // Server endpoint

function CourseChat({ chatId }) {
  const [messages, setMessages] = useState([]); // Messages state
  const [input, setInput] = useState(''); // Input state
  const [socketInstance, setSocketInstance] = useState(null); // Track socket instance

  useEffect(() => {
    // Fetch messages whenever chatId changes
    const fetchMessages = async () => {
      try {
        const authToken = localStorage.getItem("authToken");
        console.log(`Fetching messages for chatId: ${chatId}`);
        const response = await axios.get(
          `${ENDPOINT}/api/teachers/${chatId}`,
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );
        console.log(response.data);
        setMessages(response.data.messages || []); // Set initial messages
      } catch (error) {
        console.error('Error fetching messages:', error.response?.data || error.message);
      }
    };

    if (chatId) {
      fetchMessages();
    }
  }, [chatId]);

  useEffect(() => {
    // Initialize or reinitialize socket connection when chatId changes
    if (socketInstance) {
      socketInstance.disconnect(); // Clean up existing socket connection
    }

    const socket = io(ENDPOINT, {
      transports: ['websocket', 'polling'],
    });
    setSocketInstance(socket);

    // Listen for new messages in the context of the current chatId
    socket.emit('joinChat', chatId); // Inform the server about joining a chat
    socket.on('message', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.disconnect(); // Cleanup socket connection on component unmount
    };
  }, [chatId]);

  const handleSend = () => {
    const senderId = localStorage.getItem('id');
    if (input.trim()) {
      const message = {
        sender: { _id: senderId, uname: 'You' },
        content: input,
        chatId,
      };

      // Emit message via socket
      socketInstance?.emit('message', message);

      // Add message locally for instant display
      setMessages((prevMessages) => [...prevMessages, message]);

      setInput(''); // Clear input field
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="container mt-4" style={{ maxWidth: '100%' }}>
      <div
        className="border rounded p-3 mb-3 flex flex-col"
        style={{
          height: '300px',
          overflowY: 'auto',
          backgroundColor: '#343a40',
          color: 'white',
        }}
      >
        {messages.map((message, index) => (
          <div
            key={index}
            className={`mb-2 p-2 rounded ${message.sender._id === localStorage.getItem('id') ? 'text-end' : 'text-start'}`}
            style={{
              maxWidth: '60%',
              alignSelf: message.sender._id === localStorage.getItem('id') ? 'flex-end' : 'flex-start',
              backgroundColor: message.sender._id === localStorage.getItem('id') ? '#495057' : '#adb5bd',
              color: 'white',
            }}
          >
            <strong>{message.sender._id === localStorage.getItem('id') ? 'You' : message.sender.uname}:</strong> {message.content}
          </div>
        ))}
      </div>
      <div className="input-group">
        <input
          type="text"
          className="form-control bg-dark text-light border-secondary"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button className="btn btn-primary" onClick={handleSend}>
          Send
        </button>
      </div>
    </div>
  );
}

export default CourseChat;
