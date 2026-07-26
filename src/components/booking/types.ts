export interface ServiceOption {
  id: number;
  title: string;
  subtitle: string | null;
  price: string;
  icon: string;
  duration: string | null;
  category: string | null;
}

export interface DateAvailability {
  date: string;
  available: boolean;
  remaining: number;
}

export interface TimeSlotOption {
  id: number;
  time: string;
  capacity: number;
  booked: number;
  remaining: number;
  full: boolean;
}

export interface LocationValue {
  address: string;
  lat: number;
  lng: number;
}

export function toISODate(d: Date) {
  return d.toISOString().slice(0, 10);
}
