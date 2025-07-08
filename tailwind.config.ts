// tailwind.config.ts

import type { Config } from 'tailwindcss';

const config: Config = {
    content: [
        './src/**/*.{js,ts,jsx,tsx}', // src 폴더 기준
    ],
    theme: {
        extend: {
            colors: {
                white: '#FFFFFF',
                black: '#000000',
                gray: {
                    50: '#F9F9F9',
                    100: '#F2F2F2',
                    200: '#E5E5E5',
                    300: '#D9D9D9',
                    400: '#BDBDBD',
                    500: '#9E9E9E',
                    600: '#828282',
                    700: '#4F4F4F',
                    800: '#333333',
                    900: '#1A1A1A',
                },
                brand: {
                    blue: '#3399FF',
                },
                red: {
                    DEFAULT: '#EB5757',
                },
            },
            fontFamily: {
                pretendard: ['Pretendard', 'sans-serif'],
            },

            fontSize: {
                '11-sm': ['11px', { lineHeight: '14px' }],
                '12-m': ['12px', { lineHeight: '16px' }],
                '13-b': ['13px', { lineHeight: '18px' }],
                '14-m': ['14px', { lineHeight: '20px' }],
                '16-b': ['16px', { lineHeight: '24px' }],
                '20-b': ['20px', { lineHeight: '30px' }],
                '24-b': ['24px', { lineHeight: '36px' }],
                '32-b': ['32px', { lineHeight: '48px' }],
            },
            fontWeight: {
                m: '500',
                b: '700',
            },
        },
    },
    plugins: [],
};

export default config;
