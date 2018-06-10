// import * as socketIo from 'socket.io-client';
import { IMessage } from '../zorigami_types';

/* this is a mock socket.io?? */
const socketIO = (host: string, configuration: {path: string, reconnection: boolean}) => {
    return {
        on: (event: string, callback: (data: IMessage) => void) => {
            console.log(event);
            callback({from: 'mock implementation'});
        },
        emit: (type: string, message: any): void => {
            console.log(type, message);
        }
    };
};

const PORT = '3000';
const socket = socketIO(`http://localhost:${PORT}`, {
    path: '/socket-server',
    reconnection: false,
    // reconnectionDelay: 500,
    // reconnectionAttempts: 50,
});

socket.on('message', (data: IMessage) => {
    // console.warn('data', data);
});

socket.on('connect_error', () => {
    // console.log(`connect_error ${PORT || 3000}`)
});
socket.on('connect_timeout', () => {
    // console.log(`connect_timeout ${PORT || 3000}`)
});
socket.on('reconnect', () => {
    // console.log(`reconnect ${PORT || 3000}`)
});
socket.on('reconnect_attempt', () => {
    // console.log(`reconnect_attempt ${PORT || 3000}`)
});
socket.on('reconnecting', () => {
    // console.log(`reconnecting ${PORT || 3000}`)
});
socket.on('reconnect_error', () => {
    // console.log(`reconnect_error ${PORT || 3000}`)
});
socket.on('reconnect_failed', () => {
    // console.log(`reconnect_failed ${PORT || 3000}`)
});
socket.on('ping', () => {
    // console.log(`ping ${PORT || 3000}`)
});
socket.on('pong', () => {
    // console.log(`pong ${PORT || 3000}`)
});
socket.on('connect', () => {
    // console.log(`connect ${PORT || 3000}`)
    socket.emit('message', 'this is my message hello world');
});
socket.on('disconnect', () => {
    // console.log(`disconnect ${PORT || 3000}`)
});

export default socket;