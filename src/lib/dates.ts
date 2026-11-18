import { addDays, format, isSameDay, parseISO, startOfWeek } from "date-fns";
import { ptBR } from "date-fns/locale";

/** Datas de encomenda são "YYYY-MM-DD" (sem fuso) para evitar deslocamentos de timezone. */
export const toDateKey = (d: Date) => format(d, "yyyy-MM-dd");
export const fromDateKey = (key: string) => parseISO(key);

export const formatDateLong = (key: string) =>
  format(fromDateKey(key), "EEEE, d 'de' MMMM", { locale: ptBR });

export const formatDateShort = (key: string) => format(fromDateKey(key), "dd/MM", { locale: ptBR });

export const formatDateTime = (iso: string) =>
  format(new Date(iso), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });

export const formatWeekday = (d: Date, pattern = "EEE") => format(d, pattern, { locale: ptBR });

export const weekStart = (d: Date) => startOfWeek(d, { weekStartsOn: 0 });

export const weekDays = (start: Date) => Array.from({ length: 7 }, (_, i) => addDays(start, i));

export { addDays, isSameDay, format, ptBR };

export const WEEKDAY_NAMES = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];

/**
 * Lista as próximas datas disponíveis para encomenda respeitando a
 * antecedência mínima e os dias sem atendimento.
 */
export function availableDates(opts: { minLeadDays: number; closedWeekdays: number[]; count?: number; from?: Date }) {
  const { minLeadDays, closedWeekdays, count = 21, from = new Date() } = opts;
  const out: Date[] = [];
  let cursor = addDays(from, minLeadDays);
  let guard = 0;
  while (out.length < count && guard < 120) {
    if (!closedWeekdays.includes(cursor.getDay())) out.push(cursor);
    cursor = addDays(cursor, 1);
    guard++;
  }
  return out;
}
