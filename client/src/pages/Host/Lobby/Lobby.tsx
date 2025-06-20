import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useSocket } from '../../../contexts/SocketContext';
import styles from './Lobby.module.scss';

interface Player {
	_id: string;
	username: string;
	score: number;
	user: {
		_id: string;
		first_name: string;
		last_name: string;
	};
}

interface LobbyState {
	quizId: string;
	pin: string | null;
	players: Player[] | null;
	playersCount: number | null;
	disabled: boolean;
	muted: boolean;
}

const Lobby: React.FC = () => {
	const [searchParams] = useSearchParams();
	const quizId = searchParams.get('quizId') || '';
	console.log(quizId);

	const [state, setState] = useState<LobbyState>({
		quizId: quizId,
		pin: null,
		players: null,
		playersCount: null,
		disabled: true,
		muted: false,
	});

	const { socket } = useSocket();

	useEffect(() => {
		setState((prev) => ({ ...prev, quizId }));

		if (socket) {
			socket.emit('HOST_JOINED', { quizId });
		}

		const showPinHandler = (data: { pin: string }) => {
			setState((prev) => ({ ...prev, pin: data.pin }));
		};

		const updatePlayersHandler = (playersData: {
			players: Player[];
			playersCount: number;
		}) => {
			console.log('event: UPDATE_PLAYERS_IN_LOBBY', playersData);
			if (playersData.playersCount === 0) {
				setState((prev) => ({
					...prev,
					players: null,
					playersCount: null,
				}));
			} else {
				setState((prev) => ({
					...prev,
					players: playersData.players,
					playersCount: playersData.playersCount,
					disabled: false,
				}));
			}
		};

		if (socket) {
			socket.on('SHOW_PIN', showPinHandler);
			socket.on('UPDATE_PLAYERS_IN_LOBBY', updatePlayersHandler);
		}

		return () => {
			if (socket) {
				socket.off('SHOW_PIN', showPinHandler);
				socket.off(
					'UPDATE_PLAYERS_IN_LOBBY',
					updatePlayersHandler,
				);
			}
		};
	}, [quizId]);

	const handleMusic = (event: React.MouseEvent) => {
		event.preventDefault();
		setState((prev) => ({ ...prev, muted: !prev.muted }));
	};

	const startGame = () => {
		if (state.pin && socket) {
			socket.emit('HOST_STARTED_GAME', state.pin);
		}
	};

	const name =
		state.playersCount === 1 ? (
			<span>Player</span>
		) : (
			<span>Players</span>
		);

	const button = !state.muted ? (
		<button onClick={handleMusic}>
			<VolumeUpIcon />
		</button>
	) : (
		<button onClick={handleMusic}>
			<VolumeOffIcon />
		</button>
	);

	return (
		<div className={styles.main}>
			<div className={styles.music}>{button}</div>
			<Grid container direction='column'>
				<Grid
					justifyContent='center'
					alignItems='center'
					style={{ minHeight: '20vh' }}
					className={styles.statusBar}
				>
					<div className={styles.title}>
						<div className={styles.join}>
							<span>
								Join at{' '}
								<strong>
									jeffreyquan.github.io/quizy-client
								</strong>
							</span>
						</div>
						<div className={styles.gamePin}>
							with Game PIN:
						</div>
						<div className={styles.pin}>
							{state.pin}
						</div>
					</div>
				</Grid>
				<Grid
					direction='row'
					justifyContent='space-between'
					alignItems='center'
					style={{ minHeight: '10vh', marginTop: '30px' }}
				>
					<Grid style={{ paddingLeft: '5rem' }}>
						<div className={styles.left}>
							<div
								className={
									styles.playersCounter
								}
							>
								<div className={styles.count}>
									{state.playersCount || 0}
								</div>
								<div className={styles.player}>
									{name}
								</div>
							</div>
						</div>
					</Grid>
					<Grid style={{ textAlign: 'center' }}>
						<h1 className={styles.logo}>QUIZY</h1>
					</Grid>
					<Grid
						style={{
							textAlign: 'right',
							paddingRight: '50px',
						}}
					>
						<Link
							to={`/start?quizId=${state.quizId}&pin=${state.pin}`}
						>
							<Button
								variant='contained'
								color='primary'
								className={styles.startBtn}
								onClick={startGame}
								disabled={state.disabled}
								style={{ fontSize: '1.6rem' }}
							>
								Start
							</Button>
						</Link>
					</Grid>
				</Grid>
				<Grid>
					<Players
						players={state.players}
						playersCount={state.playersCount}
					/>
				</Grid>
				<Grid></Grid>
			</Grid>
		</div>
	);
};

interface PlayersProps {
	players: Player[] | null;
	playersCount: number | null;
}

const Players: React.FC<PlayersProps> = ({ players, playersCount }) => {
	if (players === null || playersCount === null) {
		return null;
	}

	const playerNames = players.map((p) => (
		<div key={p._id}>{p.user.first_name + ' ' + p.user.last_name}</div>
	));

	return <div className={styles.names}>{playerNames}</div>;
};

export default Lobby;
