'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import NotiItem from './NotiItem';
import clsx from 'clsx';
import axios from '@/lib/api/axios';
import NotiNull from './NotiNull';

interface NotificationType {
  id: number;
  content: string;
  createdAt: string;
}
interface NotiListProps {
  setHasNewNotification?: (val: boolean) => void;
}

const fetchNotifications = async () => {
  const token = localStorage.getItem('accessToken');
  if (!token) {
    return { notifications: [], totalCount: 0 };
  }
  const res = await axios.get('/my-notifications');
  return res.data;
};

const deleteNotification = async (notificationId: number) => {
  await axios.delete(`/my-notifications/${notificationId}`);
};

const NotiList = ({ setHasNewNotification }: NotiListProps) => {
  const [notifications, setNotifications] = useState<NotificationType[]>([]);
  const [totalCount, setTotalCount] = useState(0);

  const router = useRouter();

  const loadNotifications = async () => {
    const data = await fetchNotifications();
    setNotifications(data.notifications);
    setTotalCount(data.totalCount);
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteNotification(id);
      setNotifications((prev) => {
        const newList = prev.filter((item) => item.id !== id);
        if (newList.length === 0 && setHasNewNotification) {
          setHasNewNotification(false);
        }
        return newList;
      });
      setTotalCount((prev) => prev - 1);
    } catch (err: any) {
      const message = err?.response?.data?.message || '알림 삭제에 실패했습니다.';
      alert(message);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  return (
    <div
      className={clsx(
        'w-[92vw] max-w-[320px] rounded-[12px] bg-white shadow-lg transition-all',
        'max-h-[360px] overflow-y-auto',
      )}
    >
      <h3 className='text-16-b border-b border-gray-100 px-16 pt-16 pb-8 text-gray-950 sm:px-16'>
        알림 {totalCount}개
      </h3>

      <ul className='flex flex-col'>
        {notifications.length === 0 ? (
          <NotiNull />
        ) : (
          notifications.map((noti) => (
            <li
              key={noti.id}
              className='hover:bg-primary-100 rounded-[6px] transition-colors duration-150'
            >
              <NotiItem
                id={noti.id}
                content={noti.content}
                createdAt={noti.createdAt}
                onDelete={() => handleDelete(noti.id)}
                onClick={() => router.push('/profile/reservations')}
              />
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default NotiList;
