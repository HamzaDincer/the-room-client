import { io } from 'socket.io-client';
import Peer from 'peerjs';

// "undefined" means the URL will be computed from the `window.location` object
const URL = process.env.NODE_ENV === 'production' ? undefined : "http://localhost:8000";

export const socket = io("https://e096d04e78dc.ngrok.app");

export const peer = new Peer() ;