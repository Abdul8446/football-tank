// socketService.js
import { useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:4000');

const useSocket = () => {
  useEffect(() => {
    // Connect to the server
    socket.connect();

    socket.emit('hello','hi')

    // Clean up the socket connection on unmount
    return () => {
      socket.disconnect();
    };
  }, []);

  // Helper function to emit events
  const emitEvent = (eventName, data) => {
    console.log(eventName,data)
    socket.emit(eventName, data);
  };

  // Helper function to listen for events
  const onEvent = (eventName, callback) => {
    console.log(eventName)
    socket.on(eventName, callback);
  };

  return { emitEvent, onEvent };
};

export default useSocket;
