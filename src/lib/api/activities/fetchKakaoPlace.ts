import kakaoMapsClient from '../kakaoMapsClient';

export interface Place {
  lat: number;
  lng: number;
  title: string | null;
  url: string | null;
}

type AddressRequest = {
  url: string;
  type: 'place' | 'address';
};

const DEFAULT_ADDRESS = '서울 중구 세종대로 110';
const DEFAULT_URL = '/search/keyword.json?';
const FALLBACK_URL = '/search/address.json?';

export const fetchKakaoPlace = async (query: string): Promise<Place | null> => {
  const trimmedQuery = query.replace(/\s\d+(-\d+)?$/g, '').trim();
  const addressRequests: AddressRequest[] = [
    { url: DEFAULT_URL + query, type: 'place' },
    { url: DEFAULT_URL + trimmedQuery, type: 'place' },
    { url: FALLBACK_URL + query, type: 'address' },
    { url: FALLBACK_URL + trimmedQuery, type: 'address' },
    { url: FALLBACK_URL + DEFAULT_ADDRESS, type: 'address' },
  ];

  for (const request of addressRequests) {
    try {
      const res = await kakaoMapsClient.get(request.url);
      const docs = res.data.documents;
      if (!Array.isArray(docs) || docs.length === 0) continue; // 유효한 장소 정보가 있는지 확인하고, 없으면 다음 요청 처리
      const found = docs[0];

      if (request.type === 'place') {
        return {
          lat: Number(found.y),
          lng: Number(found.x),
          title: found.place_name,
          url: found.place_url,
        };
      } else {
        const target = found.road_address_name || found.address_name;
        const lat = Number(target.y);
        const lng = Number(target.x);
        const title = target.address_name ?? null;
        return {
          lat,
          lng,
          title,
          url: title
            ? `https://map.kakao.com/link/map/${encodeURIComponent(title)},${lat},${lng}`
            : null,
        };
      }
    } catch (error) {
      console.error('주소 검색 요청 실패:', error);
      continue;
    }
  }

  return null;
};
