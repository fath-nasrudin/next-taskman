'use client';
import Link from 'next/link';
import React from 'react';

export type Props = {
  params: {
    slug: string;
  };
};

const extractIdFromSlug = (slug: string) => {
  return slug.split('-').pop();
};

export default function ProjectPage({ params }: Props) {
  const { slug } = React.use(params);
  return (
    <div>
      <p>Project: {slug}</p>
      <p>Id: {extractIdFromSlug(slug)}</p>
      <Link href="/app">Back home</Link>
    </div>
  );
}
