import Grid from '@mui/material/Grid';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import StatusBar from '../../../components/StatusBar/StatusBar';
import { useSocket } from '../../../contexts/SocketContext';
import styles from './Instructions.module.scss';

interface InstructionsState {
	username: string | null;
	pin: number | null;
	redirect: boolean;
	hostDisconnected: boolean;
}

const Instructions: React.FC = () => {
	const [state, setState] = useState<InstructionsState>({
		username: null,
		pin: null,
		redirect: false,
		hostDisconnected: false,
	});

	const navigate = useNavigate();
	const location = useLocation();
	const { socket } = useSocket();
	useEffect(() => {
		const urlParams = new URLSearchParams(location.search);
		const username = urlParams.get('username');
		const pin = parseInt(urlParams.get('pin') || '0');

		setState((prev) => ({
			...prev,
			username,
			pin,
		}));

		const gameStartedHandler = () => {
			setState((prev) => ({
				...prev,
				redirect: true,
			}));
		};

		const hostDisconnectedHandler = () => {
			setState((prev) => ({
				...prev,
				hostDisconnected: true,
			}));
		};

		if (socket) {
			socket.on('GAME_HAS_STARTED', gameStartedHandler);
			socket.on('HOST_DISCONNECTED', hostDisconnectedHandler);
		}

		return () => {
			socket?.off('GAME_HAS_STARTED', gameStartedHandler);
			socket?.off('HOST_DISCONNECTED', hostDisconnectedHandler);
		};
	}, [location.search, socket]);

	const { pin, username, redirect, hostDisconnected } = state;

	if (redirect) {
		navigate(`/getready?nickname=${username}&pin=${pin}`);
	}

	if (hostDisconnected) {
		navigate('/');
	}

	return (
		<Grid
			justifyContent='center'
			alignItems='center'
			style={{ minHeight: '100vh' }}
		>
			<StatusBar
				pin={pin as number}
				username={username as string}
			/>
			<Grid
				spacing={4}
				direction='column'
				justifyContent='center'
				alignItems='center'
				style={{ minHeight: '90vh' }}
				className={styles.mainInfo}
			>
				<Grid className={styles.in}>You're in</Grid>
				<Grid className={styles.name}>
					See your nickname on screen?
				</Grid>
			</Grid>
		</Grid>
	);
};

export default Instructions;
