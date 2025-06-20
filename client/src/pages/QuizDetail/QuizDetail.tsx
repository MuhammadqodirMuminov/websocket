import Button from '@mui/material/Button';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import QuizInfo from '../../utils/utils';
import styles from './QuizDetail.module.scss';

const ShowQuiz = () => {
	const [quizData, setQuizData] = useState({
		name: '',
		_id: '',
	});

	const { quizId } = useParams();

	useEffect(() => {
		QuizInfo.getQuiz(quizId as string).then(({ data }) => {
			const { _id, name } = data;
			setQuizData({
				_id: _id,
				name: name['en'],
			});
		});
	}, [quizId]);

	return (
		<div className={styles.container}>
			<div className={styles.header}>
				<div className={styles.logo}>
					<h1>QUIZY</h1>
				</div>
				<div className={styles.title}>
					<h2>QUIZ PREVIEW</h2>
				</div>
			</div>

			<div className={styles.quizInfo}>
				<div className={styles.info}>
					<p>Name: {quizData.name}</p>
				</div>
				<div className={styles.info}>
					<p>ID: {quizData._id}</p>
				</div>
			</div>

			<div className={styles.buttonContainer}>
				<Link to={`/lobby?quizId=${quizData._id}`}>
					<Button variant='contained' color='primary'>
						Host Game
					</Button>
				</Link>
			</div>
		</div>
	);
};

export default ShowQuiz;
