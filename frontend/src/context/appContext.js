import {io} from 'socket.io-client';
import React from 'react';
const SOCKET_URL = 'http://localhost:5001';

// create socket
export const socket = io(SOCKET_URL);

// app context. So other components have access to the values / state from the app.js
export const AppContext = React.createContext();

