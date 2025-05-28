import React, { createContext, useContext, useState } from 'react';

export interface TeamMember {
  name: string;
}

export interface Team {
  name: string;
  members: TeamMember[];
}

interface GameContextType {
  users: string[];
  setUsers: (users: string[]) => void;
  team: Team | null;
  setTeam: (team: Team | null) => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<string[]>([]);
  const [team, setTeam] = useState<Team | null>(null);

  return (
    <GameContext.Provider value={{ users, setUsers, team, setTeam }}>
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
