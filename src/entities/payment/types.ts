export type PaymentStatus = 'paid' | 'pending' | 'overdue' | 'refunded';

export type Payment = {
  id: string;
  client: string;
  amount: number;
  at: string;
  purpose: string;
  status: PaymentStatus;
  method: string;
};
