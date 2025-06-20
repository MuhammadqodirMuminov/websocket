import Grid from '@mui/material/Grid';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import QuizInfo from '../../utils/utils';
import styles from './AllQuizzes.module.scss';

interface Quiz {
	_id: string;
	name: string;
}

interface IndexProps {
	quizzes: Quiz[] | null;
}

const AllQuizzes: React.FC = () => {
	const [quizzes, setQuizzes] = useState<Quiz[] | null>(null);

	useEffect(() => {
		QuizInfo.getAllQuizzes()
			.then(({ data }: { data: { data: Quiz[] } }) => {
				setQuizzes(data.data);
				console.log(data);
			})
			.catch((error: Error) => {
				console.error('Error fetching quizzes:', error);
			});
	}, []);

	return (
		<Grid
			justifyContent='center'
			alignItems='center'
			style={{ minHeight: '100vh' }}
		>
			<Grid
				justifyContent='center'
				alignItems='center'
				className={styles.title}
			>
				<h1>QUIZY</h1>
			</Grid>
			<Grid
				justifyContent='center'
				alignItems='flex-start'
				style={{ minHeight: '90vh' }}
				className={styles.main}
			>
				<Grid
					direction='column'
					justifyContent='center'
					alignItems='center'
					style={{ minHeight: '10vh' }}
					className={styles.secondaryHeading}
				>
					<h2>ALL QUIZZES</h2>
					<p>Click on a quiz to preview and host.</p>
				</Grid>
				<Grid
					justifyContent='center'
					alignItems='flex-start'
					style={{ minHeight: '80vh' }}
				>
					<Index quizzes={quizzes} />
				</Grid>
			</Grid>
		</Grid>
	);
};

const Index: React.FC<IndexProps> = ({ quizzes }) => {
	if (quizzes === null) {
		return <div className={styles.index}>Loading</div>;
	}

	const publicQuizzes = quizzes.map((q: Quiz) => (
		<Link to={`/quizzes/${q._id}`} key={q._id}>
			<div className={styles.tile}>
				<div>{q.name}</div>
			</div>
		</Link>
	));

	return <div className={styles.index}>{publicQuizzes}</div>;
};

export default AllQuizzes;
