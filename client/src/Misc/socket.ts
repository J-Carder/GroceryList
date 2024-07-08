import { io } from 'socket.io-client';

// "undefined" means the URL will be computed from the `window.location` object
// const URL = process.env.NODE_ENV === 'production' ? undefined : 'http://localhost:3001';
const URL = import.meta.env.VITE_REACT_APP_WS_API 

export const socket = io(URL);