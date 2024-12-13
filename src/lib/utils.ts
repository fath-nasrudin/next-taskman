import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const createSlug = ({ name, id }: { name: string; id: string }) => {
  return `${name.toLowerCase().split(' ').join('-')}-${id}`;
};
