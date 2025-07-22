import ClientActivitesPage from '@/components/activities/ClientActivitesPage';

interface Props {
  params: Promise<{ id: number }>;
}

const ActivityPage = async ({ params }: Props) => {
  const { id } = await params;

  return <ClientActivitesPage id={id} />;
};

export default ActivityPage;
