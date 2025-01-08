import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import io from 'socket.io-client';
import axios from 'axios';
const ENDPOINT = "http://localhost:5000"; // Server endpoint
let socket; // Socket variable

function CourseChat() {
const [messages, setMessages] = useState([]); // Messages state
  const [input, setInput] = useState(''); // Input state

  // Fetch messages from the server on component mount
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get(
          `${ENDPOINT}/api/teachers/677d6846f90ba9c26b6a0652/677d71415ace9b9b4ca48964`,
          {
            headers: {
              Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3NzkxNzE2YWUyZjIzMDc2ZjMzYmM1NCIsInJvbGUiOiJ0ZWFjaGVyIiwiaWF0IjoxNzM2MzE2MTcyLCJleHAiOjE3MzY0MDI1NzJ9.1wc8FVLy6kcdikRjDqOGNklU0swb9ouLB8lAOEGIYpA',
            },
          }
        );
        console.log(response)
        setMessages(response.data.messages || []); // Set fetched messages to state
      } catch (error) {
        console.error('Error fetching messages:', error.response?.data || error.message);
      }
    };

    fetchMessages(); // Call the async function
  }, []);

  // Set up socket connection and listeners
  useEffect(() => {
    socket = io(ENDPOINT, {
      transports: ['polling', 'websocket'],
      reconnection: true, // Ensure WebSocket is used
    });

    // Listen for incoming messages from the server
    socket.on('message', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    // Cleanup on component unmount
    return () => {
      socket.disconnect();
    };
  }, []);

  // Handle sending messages
  const handleSend = () => {
    if (input.trim()) {
      const message = { text: input, sender: 'You' };

      // Emit the message to the server
      socket.emit('message', message);

      // Update local state to show the message instantly
      setMessages((prevMessages) => [...prevMessages, message]);
      setInput(''); // Clear the input field
    }
  };

  // Handle sending message on pressing Enter key
  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault(); // Prevent default form submission
      handleSend();
    }
  };

  return (
    <div className="container mt-4" style={{ maxWidth: '500px' }}>
      <h2 className="text-center text-light mb-4">Course Chat</h2>
      <div
        className="border rounded p-3 mb-3"
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
            className="mb-2 p-2 rounded"
            style={{
              maxWidth: '75%',
              alignSelf: message.sender === 'You' ? 'flex-end' : 'flex-start',
              backgroundColor: message.sender === 'You' ? '#495057' : '#adb5bd',
              color: 'white',
            }}
          >
            <strong>{message.sender}:</strong> {message.text}
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
