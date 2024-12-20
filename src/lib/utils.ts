import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { env } from './env';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const createSlug = ({ name, id }: { name: string; id: string }) => {
  return `${name.toLowerCase().split(' ').join('-')}-${id}`;
};

export function formatDate(input: string | number): string {
  const date = new Date(input);
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

export const absoluteUrl = (path: string) => {
  return `${env.NEXT_PUBLIC_BASE_URL}${path}`;
};
