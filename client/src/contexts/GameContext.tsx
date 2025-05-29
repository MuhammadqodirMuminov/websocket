import React, { createContext, useContext, useState } from 'react';

export interface TeamMember {
	name: string;
	_id: string;
}

export interface Team {
	_id?: string;
	name: string;
	gameSession?: string;
	members: TeamMember[];
	isActive?: boolean;
	teamHost?: {
		_id: string;
		first_name: string;
		last_name: string;
	};
	createdAt?: string;
	updatedAt?: string;
}

export interface GameSession {
	sessionId: string;
	gameCode: string;
	qrCode: string;
	createdAt: string;
	updatedAt: string;
}

interface GameContextType {
	users: string[];
	setUsers: (users: string[]) => void;
	team: Team | null;
	setTeam: (team: Team | null) => void;
	allTeams: Team[];
	setAllTeams: (teams: Team[]) => void;
	gameSession: GameSession | null;
	setGameSession: (session: GameSession | null) => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameContextProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [users, setUsers] = useState<string[]>([]);
	const [team, setTeam] = useState<Team | null>(null);
	const [allTeams, setAllTeams] = useState<Team[]>([]);
	const [gameSession, setGameSession] = useState<GameSession | null>(null);

	return (
		<GameContext.Provider value={{ users, setUsers, team, setTeam, allTeams, setAllTeams, gameSession, setGameSession }}>
			{children}
		</GameContext.Provider>
	);
};

export const useGame = () => {
	const context = useContext(GameContext);
	if (context === undefined) {
		throw new Error('useGame must be used within a GameProvider');
	}
	return context;
};
