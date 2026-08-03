export type ClientStatus = 'active' | 'trial' | 'pause';

export type Client = {
  id: string;
  name: string;
  phone: string;
  channel: string;
  note: string;
  status: ClientStatus;
  hue: number;
  plan: string;
  balance: number;
  since: string;
  service: string;
};
