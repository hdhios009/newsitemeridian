export type IntegrationStatus = 'available' | 'coming' | 'planned' | 'connected';

export type IntegrationProvider = {
  id: string;
  name: string;
  cat: string;
  pri: string;
  status: IntegrationStatus;
  desc: string;
  color: string;
  letter: string;
};
