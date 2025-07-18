'use client';
import { Map, MapMarker, CustomOverlayMap } from 'react-kakao-maps-sdk';
import useKakaoLoader from '@/hooks/useKakaoLoder';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';

interface MapViewProps {
  address: string;
}

interface Place {
  lat: number;
  lng: number;
  title: string;
  url: string;
}

const DEFAULT_ADDRESS = '서울 중구 세종대로 110'; // 서울시청

const MapView = ({ address = DEFAULT_ADDRESS }: MapViewProps) => {
  useKakaoLoader();
  const [place, setPlace] = useState<Place>({
    lat: 0,
    lng: 0,
    title: '',
    url: '',
  });

  useEffect(() => {
    const fetchData = async (query: string) => {
      const KEY = process.env.NEXT_PUBLIC_KAKAO_REST_API_KEY;
      const URL = `https://dapi.kakao.com/v2/local/search/keyword.json?page=1&size=1&query=${query}`;
      try {
        const response = await axios.get(URL, {
          headers: {
            Authorization: `KakaoAK ${KEY}`,
          },
        });

        // 주소는 넘어오지만 인식 하지 못한 경우
        if (Array.isArray(response.data.documents) && response.data.documents.length === 0) {
          // Kakao API가 번지 포함 도로명 주소를 인식하지 못하는 경우가 있어 번지 제거 후 재시도
          const partialAddress = address.replace(/\s\d+(-\d+)?$/g, '').trim();
          console.log(partialAddress);
          if (partialAddress !== query) {
            fetchData(partialAddress); // 재귀로 partialAddress 검색
          } else {
            console.log('주소를 가져오는데 실패하였습니다.');
            fetchData(DEFAULT_ADDRESS); // 여기서 DEFAULT_ADDRESS 직접 사용
          }
          return;
        }

        const found = response.data.documents[0];
        setPlace({
          lat: Number(found.y),
          lng: Number(found.x),
          title: found.place_name,
          url: found.place_url,
        });
      } catch (error) {
        console.error(error);
      }
    };

    fetchData(address);
  }, [address]);

  return (
    <div className='mb-20 h-180 w-auto overflow-hidden rounded-2xl md:h-400'>
      <Map
        center={{ lat: place.lat, lng: place.lng }}
        style={{ width: '100%', height: '100%' }}
        level={2}
      >
        <MapMarker position={{ lat: place.lat, lng: place.lng }} />
        <CustomOverlayMap position={{ lat: place.lat, lng: place.lng }} yAnchor={1}>
          <div className='relative bottom-50 flex h-40 w-auto items-center rounded-2xl bg-white p-10 shadow-md'>
            <Link className='flex' href={place.url} target='_blank'>
              <span className='text-14-m text-gray-950'>{place.title}</span>
            </Link>
          </div>
        </CustomOverlayMap>
      </Map>
    </div>
  );
};

export default MapView;
