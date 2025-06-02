import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { toast } from 'react-toastify';

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  connect: () => void;
  disconnect: () => void;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  const connect = () => {
    const newSocket = io('http://192.168.1.3:3000/quiz-game', {
      extraHeaders: {
        authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });

    setSocket(newSocket);

    newSocket.on('connect', () => {
      setIsConnected(true);
      toast.success('Socket Connected');
    });

    newSocket.on('disconnect', () => {
      setIsConnected(false);
      toast.error('Socket Disconnected');
    });

    newSocket.on('error', (error: any) => {
      toast.error(`Connection error: ${error.message}`);
      if (error.message.includes('Unauthorized')) {
        // Handle unauthorized error if needed
      }
    });

    newSocket.on('reconnect_attempt', (attemptNumber: number) => {
      toast.info(`Reconnecting... Attempt ${attemptNumber}`);
    });

    newSocket.on('reconnect', () => {
      toast.success('Successfully reconnected');
    });

    return newSocket;
  };

  const disconnect = () => {
    if (socket) {
      socket.disconnect();
      setSocket(null);
      setIsConnected(false);
    }
  };

  useEffect(() => {
    // Initialize socket connection when component mounts
    connect();

    // Clean up on unmount
    return () => {
      disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket, isConnected, connect, disconnect }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};
