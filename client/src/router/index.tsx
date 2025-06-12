import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from '../pages/Home';
import Onboarding from '../pages/Onboarding';
import Game from '../pages/Game';
import GameQuiz from '../pages/GameQuiz';
import Host from '../pages/Host';
import Question from '../pages/question';

const router = createBrowserRouter([
	{
		path: '/home',
		element: <Home />,
	},
	{
		path: '/',
		element: <Onboarding />,
	},
	{
		path: '/game/:sessionId',
		element: <Game />,
	},
	{
		path: '/game-quiz/:sessionId',
		element: <GameQuiz />,
	},
	{
		path: '/host/:sessionId',
		element: <Host />,
	},
	{
		path: '/question/:sessionId',
		element: <Question />,
	},
]);

export default function AppRouter() {
	return <RouterProvider router={router} />;
}
