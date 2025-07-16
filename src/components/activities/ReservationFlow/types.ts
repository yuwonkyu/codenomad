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

// ModalTrigger용 Props (자체적으로 예약 처리)
export interface ModalTriggerProps {
  activity: Activity;
  scheduleId: number | null;
  setScheduleId: (id: number | null) => void;
  headCount: number;
  setHeadCount: (count: number) => void;
  onReservationComplete?: () => void;
}

export interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void; // 확인 버튼으로 모달 닫기 (상태 유지)
  schedules: Schedule[];
  scheduleId: number | null;
  setScheduleId: (id: number | null) => void;
  headCount: number;
  setHeadCount: (count: number) => void;
} 