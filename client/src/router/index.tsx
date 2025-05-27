import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from '../pages/Home';
import Onboarding from '../pages/Onboarding';
import Game from '../pages/Game';

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
		path: '/game/:gameCode',
		element: <Game />,
	},
]);

export default function AppRouter() {
	return <RouterProvider router={router} />;
}
