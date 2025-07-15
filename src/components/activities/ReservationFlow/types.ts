export interface Schedule {
  id: number;
  date: string; // 'YYYY-MM-DD'
  startTime: string; // 'HH:mm'
  endTime: string; // 'HH:mm'
}

export interface Activity {
  id: number;
  title: string;
  price: number;
  schedules: Schedule[];
  rating: number;
  reviewCount: number;
}

export interface ReservationData {
  scheduleId: number;
  headCount: number;
}

// 공통 예약 컴포넌트 Props (ReservationTrigger, ReservationCard에서 공통 사용)
export interface ReservationComponentProps {
  activity: Activity;
  scheduleId: number | null;
  setScheduleId: (id: number | null) => void;
  headCount: number;
  setHeadCount: (count: number) => void;
  onReservationConfirm: (data: ReservationData) => void;
}

export interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  schedules: Schedule[];
  scheduleId: number | null;
  setScheduleId: (id: number | null) => void;
  headCount: number;
  setHeadCount: (count: number) => void;
  onReservationConfirm?: (data: ReservationData) => void;
} 