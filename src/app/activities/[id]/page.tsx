// app/activities/[id]/page.tsx

const ActivityPage = async ({ params }: { params: { id: string } }) => {
  return <div>Activity ID: {params.id}</div>;
};

export default ActivityPage;
