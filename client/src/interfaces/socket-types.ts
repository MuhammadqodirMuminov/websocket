import type { Team } from "../contexts/GameContext";

export interface IResponse {
	status: boolean;
	activeUsers: string[];
	sessionId: string;
}

export interface ITeamResponse {
	status: boolean;
	team: Team;
	gameCode: string;
	allTeams: Team[];
}
