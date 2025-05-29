import React from 'react';
import AppRouter from './router';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { SocketProvider } from './contexts/SocketContext';
import { GameContextProvider } from './contexts/GameContext';

const App: React.FC = () => {
  return (
    <SocketProvider>
      <GameContextProvider>
        <AppRouter />
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </GameContextProvider>
    </SocketProvider>
  );
};

export default App;
