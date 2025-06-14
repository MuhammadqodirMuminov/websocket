import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useGame } from '../contexts/GameContext';
import { useSocket } from '../contexts/SocketContext';
import type { Question } from '../interfaces/quiz-type';

const HostQuestion: React.FC = () => {
	const { sessionId } = useParams();
	const { socket } = useSocket();
	const { currentQuestion, setCurrentQuestion } = useGame();
	const [showNextButton, setShowNextButton] = useState(false);

	useEffect(() => {
		if (socket) {
			socket.on('start-quiz.question', (question: Question) => {
				setCurrentQuestion(question);
				setShowNextButton(true);
			});

			return () => {
				socket.off('start-quiz.question');
			};
		}
	}, [socket, setCurrentQuestion]);

	const handleSkip = () => {
		if (socket && currentQuestion) {
			socket.emit('skip-question', {
				sessionId,
				questionId: currentQuestion._id,
			});
			setShowNextButton(false);
		}
	};

	const handleNext = () => {
		if (socket && currentQuestion) {
			socket.emit('next-question', {
				sessionId,
				questionId: currentQuestion._id,
			});
			setShowNextButton(false);
		}
	};

	return (
		<div className='max-w-4xl mx-auto p-4'>
			<h1 className='text-3xl font-bold mb-6 text-blue-600'>
				Host Question Page
			</h1>
			{currentQuestion && (
				<div className='bg-white rounded-lg shadow p-6'>
					<h2 className='text-2xl font-semibold mb-4'>
						{currentQuestion.question}
					</h2>
					{currentQuestion.type === 'TRUE_FALSE' ? (
						<div className='flex space-x-4'>
							<button
								className='bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded'
								onClick={handleSkip}
							>
								Skip
							</button>
							<button
								className='bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded'
								onClick={handleNext}
								disabled={!showNextButton}
							>
								Next
							</button>
						</div>
					) : (
						<div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
							{currentQuestion.options!.map(
								(option) => (
									<button
										key={option}
										className='bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded'
										onClick={handleSkip}
									>
										{option}
									</button>
								),
							)}
							<button
								className='bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded'
								onClick={handleNext}
								disabled={!showNextButton}
							>
								Next
							</button>
						</div>
					)}
				</div>
			)}
		</div>
	);
};

export default HostQuestion;
