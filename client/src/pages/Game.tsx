import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useGame } from '../contexts/GameContext';
import type { Team, TeamMember } from '../contexts/GameContext';
import { toast } from 'react-toastify';
import { useSocket } from '../contexts/SocketContext';

const Game: React.FC = () => {
	const { gameCode } = useParams();
	const { users, team, setTeam } = useGame();
	const { socket } = useSocket();
	const [teamName, setTeamName] = useState('');
	const [memberName, setMemberName] = useState('');
	const [members, setMembers] = useState<TeamMember[]>([]);

	return (
		<div className='min-h-screen bg-gray-100 flex flex-col'>
			<div className='p-4'>
				<h1 className='text-2xl font-bold'>Game: {gameCode}</h1>
				<div className='mt-4'>
					<h2 className='text-xl font-semibold'>Players:</h2>
					<div className='mt-2 space-y-2'>
						{users.map((user, index) => (
							<div key={index} className='bg-white p-3 rounded shadow'>
								{user}
							</div>
						))}
					</div>
				</div>
				<div className="mt-8">
					<h2 className="text-xl font-semibold mb-4">Team Information</h2>
					<div className="bg-white p-6 rounded-lg shadow">
						<form onSubmit={(e) => {
							e.preventDefault();
							if (!teamName) {
								toast.error('Please enter team name');
								return;
							}
							
							const newTeam: Team = {
								name: teamName,
								members: [...members]
							};
							
							// Send team data to backend
							if (socket) {
								socket.emit('team.create', { 
									gameCode,
									team: newTeam 
								});
							}
							
							setTeam(newTeam);
							toast.success('Team created successfully!');
						}}
						className="space-y-4">
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">Team Name</label>
								<input
									type="text"
									value={teamName}
									onChange={(e) => setTeamName(e.target.value)}
									className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
									placeholder="Enter team name"
								/>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">Add Team Member</label>
								<div className="grid grid-cols-2 gap-4">
									<div>
										<input
											type="text"
											value={memberName}
											onChange={(e) => setMemberName(e.target.value)}
											className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
											placeholder="Member name"
										/>
									</div>
									<div>
										<input
											type="text"
											value={memberName}
											onChange={(e) => setMemberName(e.target.value)}
											className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
											placeholder="Member name"
										/>
									</div>
								</div>
								<button
									type="button"
									onClick={() => {
										if (!memberName) return;	
										setMembers([...members, { name: memberName }]);
										setMemberName('');
									}}
									className="mt-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
								>
									Add Member
								</button>
							</div>

							{members.length > 0 && (
								<div className="mt-4">
									<h3 className="text-sm font-medium text-gray-700 mb-2">Added Members</h3>
									<div className="space-y-2">
										{members.map((member, index) => (
											<div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
												<span>{member.name}</span>
											</div>
										))}
									</div>
								</div>
							)}

							<button
								type="submit"
								className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
							>
								Create Team
							</button>
						</form>

						{team && (
							<div className="mt-6 p-4 bg-green-50 rounded-lg">
								<h3 className="text-lg font-semibold text-green-800 mb-2">Your Team</h3>
								<p className="text-green-700">Team Name: {team.name}</p>
								<div className="mt-2 space-y-2">
									{team.members.map((member, index) => (
										<div key={index} className="flex justify-between items-center">
											<span>{member.name}</span>
										</div>
									))}
								</div>
							</div>
						)}
					</div>
				</div>
				<div>
					
				</div>
			</div>
		</div>
	);
};

export default Game;
