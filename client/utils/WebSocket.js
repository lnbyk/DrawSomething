import React, {Children, createContext} from 'react';
import io from 'socket.io-client';
import {WS_BASE} from '../config';
import {useDispatch} from 'react-redux';


const WebSocketContect = createContext(null);

export {WebSocketContect};

const WebSocket = (props) => {
    let socket;
    let ws;

    const dispatch = useDispatch();

    if (!socket) {
        socket = io.connect(WS_BASE)
        
        ws = {
            socket: socket,
        }
    }

    return <WebSocketContect.Provider value={ws}>
        {Children}
    </WebSocketContect.Provider>
}

export default WebSocket