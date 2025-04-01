'use client';

import Link from 'next/link'; // Use Next.js Link
import Image from 'next/image';
import React from 'react';

const Header = () => {
  return (
    <header className="w-full border-b">
      <div className="wrapper flex items-center justify-between">
        <Link href="/" className="w-36">
          <Image 
            src="/assets/images/new-logo.png" // new logo image
            alt="New Logo" 
            width={38} 
            height={8} 
            priority
          />
        </Link>

        <div className="flex w-32 justify-end gap-3">
          {/* Add nav or buttons here */}
        </div>       
      </div>
    </header>
  );
};

export default Header;
