import ClientActivitesPage from '@/components/activities/ClientActivitesPage';

interface Props {
  params: Promise<{ id: string }>;
}

const ActivityPage = async ({ params }: Props) => {
  const { id: idStr } = await params;
  const id = Number(idStr);

  return <ClientActivitesPage id={id} />;
};

export default ActivityPage;
