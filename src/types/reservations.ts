export type TimeSlot = 'mañana' | 'tarde' | 'todo el día';
export type VisitType = 'casual' | 'evento';
export type Status = 'aprobado' | 'rechazado' | 'pendiente' | 'cancelado';

export type ReservationRow = {
  reservation_id: string;

  name: string | null;
  last_name: string | null;
  identification: string | null;
  phone_number: string | null;
  email: string | null;

  visit_date: string | null; // DATE -> "YYYY-MM-DD"
  created_at: string; // timestamptz
  updated_at: string | null; // timestamp (sin tz)

  time_slot: TimeSlot; // enum en DB
  visit_type: VisitType; // enum en DB

  people: number | null; // int8
  unitary_price: number | null; // float8
  total_price: number | null; // float8

  status: Status; // enum en DB
  rejection_reason: string | null;
  code: string | null;
};

export type ReservationInsert = Omit<
  ReservationRow,
  'reservation_id' | 'created_at' | 'updated_at'
>;
