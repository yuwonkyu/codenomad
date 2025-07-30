const getSatisfactionText = (rating: number) => {
  if (rating >= 4.5) return '매우 만족';
  if (rating >= 3.5) return '만족';
  if (rating >= 2.5) return '보통';
  if (rating >= 1.5) return '불만족';
  return '매우 불만족';
};

export default getSatisfactionText;
