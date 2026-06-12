'use client';
import { Component, type ReactNode } from 'react';

interface Props { children: ReactNode; }
interface State { crashed: boolean; message: string; }

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { crashed: false, message: '' };

  static getDerivedStateFromError(err: Error): State {
    return { crashed: true, message: err?.message ?? 'Unknown error' };
  }

  reset() {
    try {
      localStorage.removeItem('ai-empire-tycoon-save');
    } catch { /* ignore */ }
    window.location.reload();
  }

  render() {
    if (!this.state.crashed) return this.props.children;
    return (
      <div
        className="flex flex-col items-center justify-center h-full w-full gap-6 px-6"
        style={{ background: 'linear-gradient(180deg,#1E0A3C,#0F0A1E)' }}
      >
        <div className="text-center">
          <div className="text-5xl mb-3" style={{ filter: 'drop-shadow(0 0 12px rgba(239,68,68,0.7))' }}>!</div>
          <h1 className="text-white font-black text-xl">Something crashed</h1>
          <p className="text-slate-400 text-sm mt-1 max-w-xs">
            Your save may be corrupted. Resetting will clear it and start fresh.
          </p>
          <p className="text-slate-600 text-xs mt-2 font-mono break-all">{this.state.message}</p>
        </div>
        <button
          onClick={() => this.reset()}
          className="px-8 py-4 rounded-2xl font-black text-white text-base"
          style={{
            background: 'linear-gradient(135deg,#7C3AED,#6D28D9)',
            border: '3px solid rgba(167,139,250,0.5)',
            boxShadow: '0 4px 20px rgba(124,58,237,0.4)',
          }}
        >
          Reset &amp; Reload
        </button>
      </div>
    );
  }
}
