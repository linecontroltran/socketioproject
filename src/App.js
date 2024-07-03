// src/App.js
import React, { useState, useEffect } from 'react';
import { connect, sendMessage, onMessageReceived } from './websocket';

function App() {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [connected, setConnected] = useState(false);

    useEffect(() => {
        connect(() => {
            setConnected(true);
            onMessageReceived((msg) => {
                setMessages((prevMessages) => [...prevMessages, msg]);
            });
        });
    }, []);

    const handleSend = () => {
        if (connected) {
            sendMessage(message);
            setMessage('');
        } else {
            console.error('Not connected to WebSocket');
        }
    };

    return (
        <div>
            <h1>WebSocket Chat</h1>
            <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
            />
            <button onClick={handleSend}>Send</button>
            <div>
                {messages.map((msg, index) => (
                    <div key={index}>{msg}</div>
                ))}
            </div>
        </div>
    );
}

export default App;
