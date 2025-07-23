//가격 포맷팅 함수
export const formatPrice = (amount: number): string => {
  return '₩ ' + String(amount).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};
