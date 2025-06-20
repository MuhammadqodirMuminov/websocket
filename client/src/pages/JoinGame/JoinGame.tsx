import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import InputBase from '@mui/material/InputBase';
import { grey } from '@mui/material/colors';
import { ThemeProvider, createTheme, styled } from '@mui/material/styles';
import React, {
	useEffect,
	useState,
	type ChangeEvent,
	type FormEvent,
} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSocket } from '../../contexts/SocketContext';
import styles from './JoinGame.module.scss';

interface PlayerJoinedData {
	nickname: string;
	pin: number;
}

const darkGreyTheme = createTheme({
	palette: {
		primary: {
			main: grey[900],
		},
	},
});

const JoinGameInput = styled(InputBase)(({ theme }) => ({
	'& input:invalid + fieldset': {
		borderColor: 'red',
		borderWidth: 2,
	},
	'& .MuiInputBase-input': {
		margin: '1rem 0',
		borderRadius: 4,
		position: 'relative',
		backgroundColor: theme.palette.common.white,
		border: '2px solid #ced4da',
		textAlign: 'center',
		fontWeight: 'bold',
		fontSize: 16,
		padding: '10px 12px',
		transition: theme.transitions.create([
			'border-color',
			'box-shadow',
		]),
		fontFamily: [
			'-apple-system',
			'BlinkMacSystemFont',
			'"Segoe UI"',
			'Roboto',
			'"Helvetica Neue"',
			'Arial',
			'sans-serif',
			'"Apple Color Emoji"',
			'"Segoe UI Emoji"',
			'"Segoe UI Symbol"',
		].join(','),
		'&:hover': {
			borderColor: theme.palette.common.black,
		},
		'&:focus': {
			borderColor: theme.palette.common.black,
		},
	},
}));

const JoinGame: React.FC = () => {
	const [nickname, setNickname] = useState<string>('');
	const [pin, setPin] = useState<string>('');
	const [message, setMessage] = useState<string | null>(null);
	const [disabled, setDisabled] = useState<boolean>(false);

	const navigate = useNavigate();

	// Call useSocket at the top level of the component
	const { socket } = useSocket();

	const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
		const { name, value } = event.target;
		if (name === 'nickname') {
			setNickname(value);
		} else if (name === 'pin') {
			setPin(value);
		}
	};

	const handleClick = (): void => {
		setDisabled(true);
		setTimeout(() => {
			setDisabled(false);
		}, 500);
	};

	const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
		event.preventDefault();
		handleClick();

		// Use the socket from the top-level hook call
		if (socket) {
			socket.emit('PLAYER_JOINED', {
				nickname: nickname,
				pin: parseInt(pin),
			});
		}
	};

	useEffect(() => {
		// Early return if socket is not available
		if (!socket) return;

		const handleNicknameTaken = (): void => {
			setMessage('Nickname taken');
			setTimeout(() => {
				setMessage(null);
			}, 3000);
		};

		const handleGameNotFound = (): void => {
			setMessage('Not found');
			setTimeout(() => {
				setMessage(null);
			}, 3000);
		};

		const handlePlayerJoinedSuccessfully = (
			data: PlayerJoinedData,
		): void => {
			navigate(`/instructions?nickname=${nickname}&pin=${pin}`);
		};

		// Set up event listeners
		socket.on('NICKNAME_TAKEN', handleNicknameTaken);
		socket.on('GAME_NOT_FOUND', handleGameNotFound);
		socket.on(
			'PLAYER_JOINED_SUCCESSFULLY',
			handlePlayerJoinedSuccessfully,
		);

		// Cleanup function to remove event listeners
		return () => {
			socket.off('NICKNAME_TAKEN', handleNicknameTaken);
			socket.off('GAME_NOT_FOUND', handleGameNotFound);
			socket.off(
				'PLAYER_JOINED_SUCCESSFULLY',
				handlePlayerJoinedSuccessfully,
			);
		};
	}, [socket, nickname, pin, navigate]);

	let error: React.ReactNode | null;
	if (message === null) {
		error = null;
	} else if (message === 'Not found') {
		error = (
			<div className={styles.error}>
				<div>We didn't recognise the game pin.</div>Please check
				and try again.
			</div>
		);
	} else if (message === 'Nickname taken') {
		error = (
			<div className={styles.error}>
				Sorry, that nickname is taken.
			</div>
		);
	}

	return (
		<div className={styles.home}>
			<Grid
				container
				direction='column'
				alignItems='center'
				justifyContent='center'
				style={{ minHeight: '100vh' }}
			>
				<div>
					<h1 className={styles.mainTitle}>QUIZY</h1>
				</div>
				<div className={styles.verticalMainForm}>
					<form onSubmit={handleSubmit}>
						<JoinGameInput
							placeholder='NICKNAME'
							name='nickname'
							value={nickname}
							onChange={handleChange}
							margin='dense'
							required
							fullWidth
						/>
						<JoinGameInput
							placeholder='GAME PIN'
							name='pin'
							value={pin}
							onChange={handleChange}
							margin='dense'
							required
							fullWidth
						/>
						<ThemeProvider theme={darkGreyTheme}>
							<Button
								style={{
									fontSize: '1.6rem',
									textAlign: 'center',
									fontWeight: 'bold',
									margin: '1rem 0',
								}}
								variant='contained'
								color='primary'
								type='submit'
								disabled={disabled}
								fullWidth
								className={styles.enterBtn}
							>
								Enter
							</Button>
						</ThemeProvider>
					</form>
				</div>
				<div
					style={{
						minHeight: '6rem',
						margin: '1rem 0',
					}}
				>
					{error}
				</div>
				<div style={{ textAlign: 'center' }}>
					<p className={styles.hostQuiz}>
						<Link
							to='/quizzes'
							style={{
								color: 'white',
								textDecoration: 'none',
								fontWeight: 'bold',
							}}
						>
							HOST
						</Link>{' '}
						a quiz.
					</p>
				</div>
			</Grid>
		</div>
	);
};

export default JoinGame;
