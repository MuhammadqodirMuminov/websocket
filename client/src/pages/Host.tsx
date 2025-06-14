import React from 'react';
import { useParams } from 'react-router-dom';
import { useGame } from '../contexts/GameContext';
import { useSocket } from '../contexts/SocketContext';
import type { ITeamResponse } from '../interfaces/socket-types';
import type { StartQuizResponse } from '../interfaces/quiz-type';
import { useNavigate } from 'react-router-dom';

const Host: React.FC = () => {
	const { sessionId } = useParams();
	const { gameSession, allTeams, setAllTeams, setCurrentQuestion } = useGame();
	const { socket } = useSocket();
	const navigate = useNavigate();

	React.useEffect(() => {
		if (socket) {
			socket.on('team.create.update', (data: ITeamResponse) => {
				if (data.status) {
					setAllTeams(data.allTeams);
				}
			});

			socket.on(
				'start-quiz.response',
				(data: StartQuizResponse) => {
					setCurrentQuestion(data.question);
					navigate(`/host-question/${sessionId}`);
				},
			);
		}

		return () => {
			if (socket) {
				socket.off('team.create.update');
				socket.off('start-quiz.response');
			}
		};
	}, [socket, gameSession, setAllTeams, allTeams, setCurrentQuestion]);

	const startGame = () => {
		if (socket) {
			socket.emit('start-quiz', {
				sessionId,
				lang: 'EN',
			});
		}
	};

	return (
		<div className='min-h-screen bg-gray-100 p-4'>
			<div className='max-w-4xl mx-auto bg-white rounded-lg shadow p-6'>
				<h1 className='text-3xl font-bold mb-6'>
					Host Dashboard
				</h1>

				<button
					className='bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded'
					onClick={startGame}
				>
					Start Game
				</button>

				<div className='space-y-8'>
					<div className='p-6 bg-white rounded-lg shadow'>
						<h2 className='text-2xl font-semibold mb-4'>
							Session Information
						</h2>
						<div className='space-y-4'>
							<div className='flex items-center gap-4'>
								<span className='font-medium'>
									Session ID:
								</span>
								<span className='font-medium'>
									{sessionId}
								</span>
							</div>
							<div className='flex items-center gap-4'>
								<span className='font-medium'>
									Game Code:
								</span>
								<span className='font-medium'>
									{gameSession?.gameCode}
								</span>
							</div>
						</div>
					</div>

					<div className='p-6 bg-white rounded-lg shadow'>
						<h2 className='text-2xl font-semibold mb-4'>
							QR Code
						</h2>
						<div className='flex items-center gap-4'>
							<img
								src={gameSession?.qrCode}
								alt='QR Code'
								style={{
									width: 200,
									height: 200,
								}}
							/>
						</div>
					</div>
				</div>

				{allTeams.map((team) => (
					<div
						key={team._id}
						className='p-6 bg-white rounded-lg shadow'
					>
						<h2 className='text-2xl font-semibold mb-4'>
							{team.name}
						</h2>
						<div className='space-y-4'>
							<div className='flex items-center gap-4'>
								<span className='font-medium'>
									Team ID:
								</span>
								<span className='font-medium'>
									{team._id}
								</span>
							</div>
							<div className='flex items-center gap-4'>
								<span className='font-medium'>
									Team Host:
								</span>
								<span className='font-medium'>
									{
										team.teamHost
											?.first_name
									}{' '}
									{team.teamHost?.last_name}
								</span>
							</div>

							<div className='flex items-center gap-4'>
								<span className='font-medium'>
									Team Members:
								</span>
								<span className='font-medium'>
									{team.members.length}
								</span>
							</div>
						</div>
					</div>
				))}
			</div>
		</div>
	);
};

export default Host;
