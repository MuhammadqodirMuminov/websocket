import React, { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

const Onboarding: React.FC = () => {
	const [gameCode, setGameCode] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [socket, setSocket] = useState<Socket | null>(null);

	// Socket.IO configuration
	useEffect(() => {
		const newSocket = io('http://localhost:3000/quiz-game', {
			extraHeaders: {
				authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NjhlYWVhOTRhZjk0MTM1MWIyZWQzMzkiLCJ0eXBlIjoiYWNjZXNzIiwiaWF0IjoxNzQ4MzI0NjE2LCJleHAiOjE3NDg3NTY2MTZ9.Ukkkt2_WATP4yC42-TytvpNYwMbrQi7D8MfVOFBJM9w`,
			},
		});
		setSocket(newSocket);

		// Handle connection events
		newSocket.on('connect', () => {
			console.log('Socket Connected');
		});

		newSocket.on('disconnect', () => {
			console.log('Socket Disconnected');
		});

		// Handle error
		newSocket.on('error', (error: any) => {
			console.error('Socket Error:', error);
		});

		// Handle join response
		newSocket.on('quiz.join.response', (response: any) => {
			if (response.success) {
				window.location.href = `/game/${gameCode}`;
			} else {
				setError(response.message);
			}
			setIsLoading(false);
		});

		return () => {
			newSocket.disconnect();
		};
	}, []);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!gameCode) return;
		console.log(gameCode);

		setIsLoading(true);
		setError(null);

		// Send game code to server
		if (socket) {
			socket.emit('quiz.join', {
				code: gameCode,
			});
		}
	};

	return (
		<div className='min-h-screen bg-gray-100 flex items-center justify-center'>
			<div className='bg-white p-8 rounded-lg shadow-md w-96'>
				<h1 className='text-2xl font-bold mb-6 text-center'>
					Join Game
				</h1>
				<form onSubmit={handleSubmit} className='space-y-4'>
					<div>
						<label
							htmlFor='gameCode'
							className='block text-sm font-medium text-gray-700 mb-1'
						>
							Game Code
						</label>
						<input
							type='text'
							id='gameCode'
							value={gameCode}
							onChange={(e) =>
								setGameCode(e.target.value)
							}
							className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
							placeholder='Enter game code'
							required
						/>
					</div>

					{error && (
						<div className='text-red-500 text-sm'>
							{error}
						</div>
					)}

					<button
						type='submit'
						disabled={isLoading || !gameCode}
						className={`w-full py-2 px-4 rounded-md font-medium ${
							isLoading || !gameCode
								? 'bg-gray-300 cursor-not-allowed'
								: 'bg-blue-500 hover:bg-blue-600 text-white'
						}`}
					>
						{isLoading ? 'Joining...' : 'Join Game'}
					</button>
				</form>
			</div>
		</div>
	);
};

export default Onboarding;
