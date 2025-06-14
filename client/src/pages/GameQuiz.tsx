import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useGame } from '../contexts/GameContext';
import { useSocket } from '../contexts/SocketContext';
import type { StartQuizResponse } from '../interfaces/quiz-type';

const GameQuiz: React.FC = () => {
	const { sessionId } = useParams();
	const navigate = useNavigate();
	const { team, allTeams, setAllTeams, setCurrentQuestion } = useGame();
	const { socket } = useSocket();

	useEffect(() => {
		if (socket) {
			socket.on('team.create.update', (response: any) => {
				if (response.status) {
					setAllTeams(response.allTeams);
				}
			});

			socket.on(
				'start-quiz.response',
				(data: StartQuizResponse) => {
					setCurrentQuestion(data.question);
					navigate(`/question/${data.sessionId}`);
				},
			);
		}

		return () => {
			if (socket) {
				socket.off('team.create.update');
				socket.off('start-quiz.response');
			}
		};
	}, [socket, setAllTeams, setCurrentQuestion]);

	return (
		<div className='min-h-screen bg-gray-100 p-4'>
			<div className='max-w-4xl mx-auto bg-white rounded-lg shadow p-6'>
				<h1 className='text-2xl font-bold mb-6'>Team Quiz</h1>

				{team && (
					<div>
						<div className='mb-6'>
							<h2 className='text-xl font-semibold mb-2'>
								Your Team
							</h2>
							<div className='space-y-4'>
								<div className='p-4 bg-gray-50 rounded-lg'>
									<h3 className='text-lg font-semibold mb-2'>
										Team Information
									</h3>
									<div className='space-y-2'>
										<p className='flex items-center gap-2'>
											<span className='font-medium'>
												Team
												Name:
											</span>
											<span>
												{
													team.name
												}
											</span>
										</p>
										<p className='flex items-center gap-2'>
											<span className='font-medium'>
												Session
												ID:
											</span>
											<span>
												{
													sessionId
												}
											</span>
										</p>
										<p className='flex items-center gap-2'>
											<span className='font-medium'>
												Host:
											</span>
											<span>
												{
													team
														.teamHost
														?.first_name
												}{' '}
												{
													team
														.teamHost
														?.last_name
												}
											</span>
										</p>
									</div>
								</div>

								<div className='p-4 bg-gray-50 rounded-lg'>
									<h3 className='text-lg font-semibold mb-2'>
										Team Members
									</h3>
									<div className='space-y-2'>
										{team.members.map(
											(
												member,
												index,
											) => (
												<div
													key={
														index
													}
													className='flex justify-between items-center p-2 bg-blue-50 rounded'
												>
													<span className='font-medium'>
														{
															member.name
														}
													</span>
													<span className='text-sm text-gray-500'>
														Member
														#
														{index +
															1}
													</span>
												</div>
											),
										)}
									</div>
								</div>

								<div className='p-4 bg-gray-50 rounded-lg'>
									<h3 className='text-lg font-semibold mb-2'>
										Session Details
									</h3>
									<div className='space-y-2'>
										<p className='flex items-center gap-2'>
											<span className='font-medium'>
												Created
												At:
											</span>
											<span>
												{team.createdAt
													? new Date(
															team.createdAt,
													  ).toLocaleString()
													: 'N/A'}
											</span>
										</p>
										<p className='flex items-center gap-2'>
											<span className='font-medium'>
												Updated
												At:
											</span>
											<span>
												{team.updatedAt
													? new Date(
															team.updatedAt,
													  ).toLocaleString()
													: 'N/A'}
											</span>
										</p>
									</div>
								</div>
							</div>
						</div>
					</div>
				)}
				<div className='mt-6'>
					<h2 className='text-xl font-semibold mb-2'>
						Other Teams
					</h2>
					<div className='space-y-4'>
						{allTeams.map((team, index) => (
							<div
								key={index}
								className='p-4 bg-gray-50 rounded-lg'
							>
								<h3 className='text-lg font-semibold mb-2'>
									Team {index + 1}
								</h3>
								<p className='text-sm text-gray-600'>
									Name: {team.name}
								</p>
								<p className='text-sm text-gray-600'>
									Host:{' '}
									{
										team.teamHost
											?.first_name
									}{' '}
									{team.teamHost?.last_name}
								</p>
								<div className='mt-2 space-y-2'>
									<p className='font-medium'>
										Members:
									</p>
									<div className='flex flex-wrap gap-2'>
										{team.members.map(
											(
												member,
												mIndex,
											) => (
												<span
													key={
														mIndex
													}
													className='inline-block bg-blue-100 text-blue-800 text-sm px-2.5 py-0.5 rounded-full'
												>
													{
														member.name
													}
												</span>
											),
										)}
									</div>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
};

export default GameQuiz;
