'use client';
import { useGameStore } from '@/store/gameStore';

export default function FloatingText() {
  const floatingTexts = useGameStore(s => s.floatingTexts);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" style={{ zIndex: 200 }}>
      {floatingTexts.map(ft => (
        <div
          key={ft.id}
          className="float-text absolute"
          style={{ left: ft.x, top: ft.y, color: ft.color }}
        >
          {ft.text}
        </div>
      ))}
    </div>
  );
}
