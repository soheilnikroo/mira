import Image from 'next/image';
import React from 'react';

const Loading = () => {
  return (
    <div className="h-full w-full flex flex-col justify-center items-center gap-y-4">
      <Image
        src="/logo.svg"
        width={40}
        height={40}
        alt="Mira Logo"
        loading="eager"
        className="animate-pulse duration-700"
      />
    </div>
  );
};

export default Loading;
