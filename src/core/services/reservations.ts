import { supabase } from '@/core/utils/supabaseClient';
import type { ReservationInsert, ReservationRow } from '@/types/reservations';

export async function createReservation(input: ReservationInsert) {
  // Validaciones mínimas del lado cliente (las de verdad deben vivir también en DB/Edge)
  if (!input.visit_date) throw new Error('visit_date es requerido');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(input.visit_date)) {
    throw new Error("visit_date debe ser 'YYYY-MM-DD'");
  }
  if (input.people != null && input.people <= 0) throw new Error('people debe ser > 0');

  const { data, error } = await supabase.from('reservations').insert([input]).select('*').single();

  if (error) throw new Error(error.message);
  return data as ReservationRow;
}

export async function listReservations(limit = 20) {
  const { data, error } = await supabase
    .from('reservations')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw new Error(error.message);
  return (data ?? []) as ReservationRow[];
}

export async function getReservationByCode(code: string) {
  const { data, error } = await supabase
    .from('reservations')
    .select('*')
    .eq('code', code)
    .limit(1)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return (data ?? null) as ReservationRow | null;
}
