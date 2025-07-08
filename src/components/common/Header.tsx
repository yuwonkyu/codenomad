'use client';

import Image from 'next/image';
import Link from 'next/link';

const Header = () => {
    return (
        <header className="w-full border-b border-gray-200 bg-white">
            <div className="max-w-screen-xl mx-auto flex justify-between items-center px-6 py-4">
                {/* 로고 */}
                <Link href="/" className="flex items-center gap-2">
                    <Image src="/icons/logoVertical.svg" alt="GlobalNomad 로고" width={174} height={28} priority />
                </Link>

                {/* 로그인/회원가입 메뉴 */}
                <nav className="flex gap-4 text-sm text-gray-900 no-underline">
                    <Link href="/login">로그인</Link>
                    <Link href="/signup">회원가입</Link>
                </nav>
            </div>
        </header>
    );
};

export default Header;
