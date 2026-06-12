'use client';
import dynamic from 'next/dynamic';
import ErrorBoundary from '@/components/ErrorBoundary';

const Game = dynamic(() => import('@/components/Game'), { ssr: false });

export default function Page() {
  return (
    <ErrorBoundary>
      <Game />
    </ErrorBoundary>
  );
}
