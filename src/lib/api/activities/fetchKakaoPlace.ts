import kakaoMapsClient from '../kakaoMapsClient';

export interface Place {
  lat: number;
  lng: number;
  title: string | null;
  url: string;
}

const DEFAULT_URL = '/search/address.json?query=';

export const DEFAULT_PLACE: Place = {
  lat: 37.566826, // 서울시청
  lng: 126.9786567,
  title: '주소를 불러오지 못했습니다.',
  url: 'https://map.kakao.com/link/map/서울 중구 세종대로 110,37.566826,126.9786567',
};

export const fetchKakaoPlace = async (query: string): Promise<Place | null> => {
  const encodedQuery = encodeURIComponent(query.trim());

  try {
    const res = await kakaoMapsClient.get(DEFAULT_URL + encodedQuery);
    const docs = res.data.documents;

    if (!Array.isArray(docs) || docs.length === 0) {
      console.warn('⚠️ 주소 검색 결과 없음');
      return DEFAULT_PLACE;
    }

    const found = docs[0];
    const target = found.road_address ?? found.address;
    console.log(found);

    if (!target) {
      console.warn('⚠️ 유효한 주소 정보 없음');
      return DEFAULT_PLACE;
    }

    const lat = Number(target.y);
    const lng = Number(target.x);
    const title = target.address_name ?? null;

    return {
      lat,
      lng,
      title,
      url: `https://map.kakao.com/link/map/${encodeURIComponent(title)},${lat},${lng}`,
    };
  } catch (error) {
    console.error('❌ 주소 검색 요청 실패:', error);
    return DEFAULT_PLACE;
  }
};
