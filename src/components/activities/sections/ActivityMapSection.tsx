import MapView from '@/components/activities/MapView';

interface ActivityMapSectionProps {
  address: string;
  category: string;
}

const ActivityMapSection = ({ address, category }: ActivityMapSectionProps) => (
  <section className='flex flex-col gap-8 border-b-1 border-gray-100'>
    <h2 className='text-18-b text-gray-950'>오시는 길</h2>
    <p className='text-[0.875rem] font-semibold text-gray-950'>{address}</p>
    <MapView address={address} category={category} />
  </section>
);

export default ActivityMapSection;
