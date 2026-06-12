'use client';
import { useEffect, useRef } from 'react';
import { useGameStore } from '@/store/gameStore';
import HUD from './HUD';
import OfficeScene from './OfficeScene';
import WorkPanel from './WorkPanel';
import Shop from './Shop';
import SkillTree from './SkillTree';
import AutomationPanel from './AutomationPanel';
import CharacterPanel from './CharacterPanel';
import CharacterCreation from './CharacterCreation';
import BusinessSelect from './BusinessSelect';
import LevelUpModal from './LevelUpModal';
import EndScreen from './EndScreen';
import FloatingText from './FloatingText';

export default function Game() {
  const screen = useGameStore(s => s.screen);
  const activePanel = useGameStore(s => s.activePanel);
  const pendingLevelUp = useGameStore(s => s.pendingLevelUp);
  const tickAutomations = useGameStore(s => s.tickAutomations);
  const calculateOfflineEarnings = useGameStore(s => s.calculateOfflineEarnings);
  const addFloatingText = useGameStore(s => s.addFloatingText);
  const setMeta = () => useGameStore.setState(s => ({
    meta: { ...s.meta, lastSeenAt: Date.now() },
  }));

  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Automation tick every 5 seconds
  useEffect(() => {
    if (screen !== 'game') return;

    tickRef.current = setInterval(() => {
      const earned = tickAutomations();
      if (earned > 0) {
        addFloatingText(`⚡ +$${earned}`, 20, 80, '#10B981');
      }
    }, 5000);

    return () => {
      if (tickRef.current) clearInterval(tickRef.current);
    };
  }, [screen, tickAutomations, addFloatingText]);

  // Calculate offline earnings on game load
  useEffect(() => {
    if (screen === 'game') {
      const earned = calculateOfflineEarnings();
      if (earned > 0) {
        setTimeout(() => {
          addFloatingText(`💤 +$${earned} offline!`, 60, 100, '#A78BFA');
        }, 500);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [screen]);

  // Update lastSeenAt on unload
  useEffect(() => {
    const handler = () => setMeta();
    window.addEventListener('beforeunload', handler);
    window.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') handler();
    });
    return () => {
      window.removeEventListener('beforeunload', handler);
    };
  }, []);

  // Onboarding screens
  if (screen === 'character-creation') {
    return (
      <div className="h-full w-full" style={{ background: '#0F0A1E' }}>
        <CharacterCreation />
      </div>
    );
  }

  if (screen === 'business-select') {
    return (
      <div className="h-full w-full" style={{ background: '#0F0A1E' }}>
        <BusinessSelect />
      </div>
    );
  }

  if (screen === 'end') {
    return (
      <div className="h-full w-full" style={{ background: '#0F0A1E' }}>
        <EndScreen />
      </div>
    );
  }

  // Main game screen
  return (
    <div
      className="relative flex flex-col h-full w-full overflow-hidden"
      style={{ background: '#0F172A' }}
    >
      {/* HUD — always visible */}
      <HUD />

      {/* Office scene — always visible beneath panels */}
      <div className="relative flex-shrink-0">
        <OfficeScene />
        <FloatingText />
      </div>

      {/* Panel area — slides up from below office */}
      <div
        className="relative flex-1 overflow-hidden"
        style={{ minHeight: 0 }}
      >
        {activePanel === 'none' && (
          <div
            className="flex flex-col items-center justify-center h-full gap-3 px-4"
            style={{ background: 'rgba(15,23,42,0.8)' }}
          >
            <div className="text-4xl">💼</div>
            <p className="text-slate-400 text-sm text-center font-medium">
              Tap <strong className="text-violet-300">Work</strong> to start earning,<br />
              <strong className="text-violet-300">Shop</strong> to upgrade your empire.
            </p>
          </div>
        )}

        {activePanel === 'work'       && <div className="h-full overflow-hidden"><WorkPanel /></div>}
        {activePanel === 'shop'       && <div className="h-full overflow-hidden"><Shop /></div>}
        {activePanel === 'skills'     && <div className="h-full overflow-hidden"><SkillTree /></div>}
        {activePanel === 'automation' && <div className="h-full overflow-hidden"><AutomationPanel /></div>}
        {activePanel === 'character'  && <div className="h-full overflow-hidden"><CharacterPanel /></div>}
      </div>

      {/* Level up overlay */}
      {pendingLevelUp && (
        <div className="absolute inset-0" style={{ zIndex: 100 }}>
          <LevelUpModal />
        </div>
      )}
    </div>
  );
}
