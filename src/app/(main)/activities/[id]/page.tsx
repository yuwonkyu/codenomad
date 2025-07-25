import ClientActivitiesPage from '@/components/activities/ClientActivitiesPage';

interface Props {
  params: Promise<{ id: string }>;
}

const ActivityPage = async ({ params }: Props) => {
  const { id: idStr } = await params;
  const id = Number(idStr);

  return <ClientActivitiesPage id={id} />;
};

export default ActivityPage;
