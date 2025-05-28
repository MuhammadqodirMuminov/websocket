import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';
import { useSocket } from '../contexts/SocketContext';
import { useGame } from '../contexts/GameContext';
import type { IResponse } from '../interfaces/socket-types';

const Onboarding: React.FC = () => {
	const [gameCode, setGameCode] = useState('');
	const { socket } = useSocket();
	const navigate = useNavigate();
	const { setUsers } = useGame();

	// Handle join response
	useEffect(() => {
		if (socket) {
			socket.on('quiz.join.response', (response: IResponse) => {
				console.log(response);
				
				if(response.status) {
					// Save users to state and navigate to game page
					setUsers(response.activeUsers);
					navigate(`/game/${gameCode}`);
				}
			});
		}

		return () => {
			if (socket) {
				socket.off('quiz.join.response');
			}
		};
	}, [socket, gameCode]);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!gameCode) return;
		toast.info('Joining game: ' + gameCode);


		// Send game code to server
		if (socket) {
			socket.emit('quiz.join', {
				code: gameCode,
			});
		}
	};

	return (
		<div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex flex-col">
			<nav className="nav-tabs bg-white shadow-sm">
				<Link to="/" className="nav-tab">Home</Link>
				<Link to="/onboarding" className="nav-tab active">Onboarding</Link>
			</nav>
			
			<div className="flex-1 flex items-center justify-center p-8">
				<div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
					<div className="text-center mb-8">
						<h1 className="text-3xl font-bold text-gray-800 mb-2">Join Quiz Game</h1>
						<p className="text-gray-500">Enter your game code to start playing</p>
					</div>

					<form onSubmit={handleSubmit} className="space-y-6">
						<div>
							<label htmlFor="gameCode" className="block text-sm font-medium text-gray-700 mb-2">
								Game Code
							</label>
							<div className="relative">
								<input
									type="text"
									id="gameCode"
									value={gameCode}
									onChange={(e) => setGameCode(e.target.value)}
									placeholder="Enter game code"
									required
									className={`w-full px-4 py-3 rounded-lg border ${
										true ? 'bg-gray-100' : 'bg-white'
									} border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200`}
								/>
								
							</div>
						</div>

						<button
							type="submit"
							className={`w-full flex items-center justify-center px-6 py-3 rounded-lg font-medium text-lg transition-all duration-200 ${
								false
									? 'bg-gray-300 cursor-not-allowed'
									: 'bg-blue-600 hover:bg-blue-700 text-white cursor-pointer'
							}`}
						>
						<span>Join Game</span>
					</button>
					</form>
				</div>
			</div>
		</div>
	);
};

export default Onboarding;
