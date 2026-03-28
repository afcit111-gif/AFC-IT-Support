import React from 'react';
import { VehicleRecord } from '../types';
import { Clock, Truck, Search, Package, CheckCircle2, Activity } from 'lucide-react';

interface MonitorContentProps {
  vehicles: VehicleRecord[];
  mode: 'tv' | 'mobile';
}

export const MonitorContent: React.FC<MonitorContentProps> = ({ vehicles, mode }) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Waiting': return Clock;
      case 'Check In': return Truck;
      case 'Invoice Receiving': return Search;
      case 'Checking': return Search;
      case 'Handover': return Package;
      case 'Check Out': return CheckCircle2;
      default: return Activity;
    }
  };

  return (
    <div className={`flex flex-col ${mode === 'tv' ? 'p-10' : 'p-2'}`}>
      <h1 className={mode === 'tv' ? 'text-4xl font-bold' : 'text-xl font-bold'}>
        {mode === 'tv' ? 'TV Monitor' : 'Mobile Monitor'}
      </h1>
      <div className="mt-4">
        {vehicles.map(v => {
          const Icon = getStatusIcon(v.status);
          return (
            <div key={v.id} className="p-2 border-b flex items-center gap-2">
              <Icon size={16} />
              <span>{v.vehicleNumber}</span>
              <span className="ml-auto">{v.status}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
