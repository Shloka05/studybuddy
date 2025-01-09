import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import io from 'socket.io-client';
import axios from 'axios';

const ENDPOINT = "http://localhost:5000"; // Server endpoint
let socket;

function CourseChat() {
  const [messages, setMessages] = useState([]); // Messages state
  const [input, setInput] = useState(''); // Input state

  useEffect(() => {
    // Fetch messages on component mount
    const fetchMessages = async () => {
      try {
        const authToken = localStorage.getItem("authToken");
        const response = await axios.get(
          `${ENDPOINT}/api/teachers/677f9b2cf483e600a21e87d4`, // Replace with actual chatId
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

    fetchMessages();
  }, []);

  useEffect(() => {
    // Initialize socket connection
    socket = io(ENDPOINT, {
      transports: ['websocket', 'polling'],
    });

    // Listen for new messages
    socket.on('message', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    // Cleanup socket connection on unmount
    return () => {
      socket.disconnect();
    };
  }, []);

  const handleSend = () => {
    const senderId = localStorage.getItem('id');
    if (input.trim()) {
      const message = {
        sender: { _id: senderId, uname: 'You' }, // Use actual user data
        content: input,
        chatId: '677f9b2cf483e600a21e87d4', // Replace with actual chatId
      };

      // Emit message via socket
      socket.emit('message', message);
      
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
    <div className="container mt-4" style={{ maxWidth: '500px' }}>
      <h2 className="text-center text-light mb-4">Course Chat</h2>
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
