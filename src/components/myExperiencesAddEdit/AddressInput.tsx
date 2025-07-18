'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Input from '@/components/common/Input';

interface AddressInputProps {
  value: string;
  onChange: (value: string) => void;
}

// 다음 우편번호 서비스 타입 정의
interface DaumPostcode {
  open: () => void;
  embed: (element: HTMLElement) => void;
}

interface PostcodeData {
  roadAddress: string;
  jibunAddress: string;
  zonecode: string;
  sido: string;
  sigungu: string;
  roadname: string;
  buildingName: string;
}

declare global {
  interface Window {
    daum: {
      Postcode: new (options: {
        oncomplete: (data: PostcodeData) => void;
        onclose?: () => void;
      }) => DaumPostcode;
    };
  }
}

const AddressInput = ({ value, onChange }: AddressInputProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);

  // 다음 우편번호 서비스 스크립트 로드
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
    script.async = true;
    script.onload = () => {
      setIsScriptLoaded(true);
    };
    document.head.appendChild(script);

    return () => {
      // 컴포넌트 언마운트 시 스크립트 제거
      const existingScript = document.querySelector('script[src="https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js"]');
      if (existingScript) {
        document.head.removeChild(existingScript);
      }
    };
  }, []);

  // 주소 검색 모달 열기
  const handleAddressSearch = () => {
    if (!isScriptLoaded) {
      alert('주소 검색 서비스를 로딩 중입니다. 잠시 후 다시 시도해주세요.');
      return;
    }
    setIsModalOpen(true);
  };

  // 주소 검색 완료 처리
  const handleAddressComplete = (data: PostcodeData) => {
    let fullAddress = data.roadAddress || data.jibunAddress;
    
    // 건물명이 있으면 추가
    if (data.buildingName) {
      fullAddress += ` (${data.buildingName})`;
    }

    onChange(fullAddress);
    setIsModalOpen(false);
  };

  // 다음 우편번호 서비스 실행
  useEffect(() => {
    if (isModalOpen && isScriptLoaded && window.daum) {
      const postcode = new window.daum.Postcode({
        oncomplete: handleAddressComplete,
        onclose: () => setIsModalOpen(false),
      });

      // 모달 내부에 우편번호 서비스 임베드
      const element = document.getElementById('postcode-container');
      if (element) {
        postcode.embed(element);
      }
    }
  }, [isModalOpen, isScriptLoaded]);

  return (
    <div className='mb-30'>
      <Input
        label='주소'
        labelClassName='text-16-b'
        placeholder='주소를 입력해 주세요'
        value={value}
        readOnly
        onClick={handleAddressSearch}
        className='cursor-pointer'
      />
      
      {/* 주소 검색 모달 */}
      {isModalOpen && (
        <div className="fixed inset-0 z-9999 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-18 shadow-custom-5 w-full max-w-343 md:max-w-500 h-500 md:h-600 relative">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="px-5 text-16-b md:text-18-b">주소 검색</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-gray-700 flex-shrink-0"
              >
                <Image
                  src="/icons/icon_X.svg"
                  alt="닫기"
                  width={20}
                  height={20}
                  className="md:size-24 cursor-pointer"
                />
              </button>
            </div>
            <div 
              id="postcode-container" 
              className="w-full h-[calc(100%-60px)]"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AddressInput;
