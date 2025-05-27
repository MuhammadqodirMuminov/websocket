import React from 'react';
import { useParams } from 'react-router-dom';

const Game: React.FC = () => {
	const { gameCode } = useParams();

	return (
		<div className='min-h-screen bg-gray-100 flex flex-col'>
			{gameCode}
		</div>
	);
};

export default Game;
