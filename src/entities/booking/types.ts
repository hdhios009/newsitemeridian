export type BookingPaidStatus = 'paid' | 'pending' | 'planned' | 'overdue' | 'done' | 'refunded';

export type Booking = {
  time: number;
  dur: number;
  price: number;
  paid: BookingPaidStatus;
  clientId: string;
  service: string;
  mode: string;
};
