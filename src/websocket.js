// src/websocket.js
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

let stompClient = null;

export const connect = (onConnected) => {
    const socket = new SockJS('http://localhost:8080/ws');
    stompClient = new Client({
        webSocketFactory: () => socket,
        debug: function (str) {
            console.log(str);
        },
        reconnectDelay: 5000,
    });

    stompClient.onConnect = onConnected;
    stompClient.activate();
};

export const sendMessage = (message) => {
    if (stompClient && stompClient.connected) {
        stompClient.publish({ destination: '/app/sendMessage', body: JSON.stringify(message) });
    } else {
        console.error('STOMP client is not connected');
    }
};

export const onMessageReceived = (callback) => {
    if (stompClient) {
        stompClient.onConnect = () => {
            stompClient.subscribe('/topic/messages', (msg) => {
                callback(JSON.parse(msg.body));
            });
        };
    } else {
        console.error('STOMP client is not initialized');
    }
};
