import React from 'react';
import { VehicleRecord } from './types';
import { User as FirebaseUser } from 'firebase/auth';
import { MonitorContent } from './components/MonitorContent';

interface MonitorProps {
  mode: 'tv' | 'mobile';
  vehicles: VehicleRecord[];
  user: FirebaseUser | null;
}

export const Monitor: React.FC<MonitorProps> = ({ mode, vehicles, user }) => {
  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Please login to view the monitor.</p>
      </div>
    );
  }

  return <MonitorContent vehicles={vehicles} mode={mode} />;
};
