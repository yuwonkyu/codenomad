// app/activities/[id]/page.tsx
import PhotoSection from '@/components/activities/PhotoSection';
const ActivityPage = async ({ params }: { params: { id: string } }) => {
  return (
    <>
      <div>Activity ID: {params.id}</div>
      <PhotoSection />
    </>
  );
};

export default ActivityPage;
