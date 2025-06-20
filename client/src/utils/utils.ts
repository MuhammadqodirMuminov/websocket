import axios from 'axios';

const QuizInfo = {
	getQuiz(id: string) {
		return axios.get(`http://localhost:3000/v1/game-quiz/${id}`);
	},

	getAllQuizzes() {
		return axios.get(
			'http://localhost:3000/v1/game-quiz?quizId=68189f6804c6b6dc7fd46e6c',
			{
				headers: {
					accept: '*/*',
					'Accept-Language': 'EN',
					Authorization: `Bearer ${localStorage.getItem(
						'token',
					)}`,
				},
			},
		);
	},
};

export default QuizInfo;
