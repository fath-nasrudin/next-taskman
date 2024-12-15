import Link from 'next/link';
import React from 'react';
export function HeaderBrand() {
  return (
    <Link href="/app">
      <h2 className="text-red-500 text-2xl text-semibold">Taskman</h2>
    </Link>
  );
}
