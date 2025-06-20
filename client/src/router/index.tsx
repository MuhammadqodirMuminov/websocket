import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Lobby from '../pages/Host/Lobby/Lobby';
import JoinGame from '../pages/JoinGame/JoinGame';
import ShowQuiz from '../pages/QuizDetail/QuizDetail';
import AllQuizzes from '../pages/Quizzess/AllQuizzes';
import Instructions from '../pages/Player/Instructions/Instructions';

const router = createBrowserRouter([
	{
		path: '/',
		element: <JoinGame />,
	},
	{
		path: '/quizzes',
		element: <AllQuizzes />,
	},
	{
		path: '/quizzes/:quizId',
		element: <ShowQuiz />,
	},
	{
		path: '/lobby',
		element: <Lobby />,
	},
	{
		path: '/instructions',
		element: <Instructions />,
	},
]);

export default function AppRouter() {
	return <RouterProvider router={router} />;
}
