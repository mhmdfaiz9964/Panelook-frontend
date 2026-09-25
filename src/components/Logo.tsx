'use client';

import React from 'react';
import Image from 'next/image';

interface LogoProps {
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
  markClassName?: string;
  nameClassName?: string;
  taglineClassName?: string;
  tagline?: boolean;
}

export function Logo({
  className = 'h-9 sm:h-11 w-auto',
  width = 240,
  height = 68,
  priority = false,
}: LogoProps) {
  return (
    <div className="flex items-center">
      <Image
        src="/images/logo.jpeg"
        alt="Panelook.lk - Sri Lanka's Trusted Laptop Display Partner"
        width={width}
        height={height}
        className={`${className} object-contain`}
        priority={priority}
      />
    </div>
  );
}

export function LogoMark({ className = 'w-10 h-10' }: { className?: string }) {
  return (
    <div className={`relative overflow-hidden rounded-xl ${className}`}>
      <Image
        src="/images/logo.jpeg"
        alt="Panelook.lk Mark"
        width={80}
        height={80}
        className="object-contain w-full h-full"
      />
    </div>
  );
}
