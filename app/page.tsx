'use client';
import { useEffect } from 'react';
import dynamic from 'next/dynamic';
import ErrorBoundary from '@/components/ErrorBoundary';

const Game = dynamic(() => import('@/components/Game'), { ssr: false });

// Force reload when browser restores page from back/forward cache
// so users never get stuck on a stale cached version.
function BFCacheGuard() {
  useEffect(() => {
    const handler = (e: PageTransitionEvent) => {
      if (e.persisted) window.location.reload();
    };
    window.addEventListener('pageshow', handler);
    return () => window.removeEventListener('pageshow', handler);
  }, []);
  return null;
}

export default function Page() {
  return (
    <ErrorBoundary>
      <BFCacheGuard />
      <Game />
    </ErrorBoundary>
  );
}
