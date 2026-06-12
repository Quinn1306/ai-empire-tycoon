import type { ReactElement } from 'react';

// ─── Individual sprite components ───────────────────────────────────────────
// All sprites: viewBox 0 0 32 32, width/height fills container, no emojis.

function Pc1() {
  return (
    <svg viewBox="0 0 32 32" width="100%" height="100%" style={{ imageRendering: 'pixelated' }}>
      {/* CRT body */}
      <rect x="3" y="2" width="26" height="19" rx="3" fill="#C8B9A0" stroke="#1A1A1A" strokeWidth="1.5"/>
      {/* Screen */}
      <rect x="6" y="4" width="20" height="14" rx="1" fill="#0A1A2A"/>
      {/* Screen glow */}
      <rect x="7" y="5" width="8" height="3" rx="1" fill="#1A3A6A" opacity="0.6"/>
      {/* Screen highlight */}
      <rect x="7" y="5" width="3" height="2" rx="0.5" fill="rgba(255,255,255,0.25)"/>
      {/* Screen line details */}
      <rect x="7" y="10" width="18" height="1" fill="rgba(0,200,100,0.25)"/>
      <rect x="7" y="12" width="12" height="1" fill="rgba(0,200,100,0.25)"/>
      <rect x="7" y="14" width="16" height="1" fill="rgba(0,200,100,0.25)"/>
      {/* Floppy slot */}
      <rect x="10" y="20" width="6" height="1.5" rx="0.5" fill="#A09080" stroke="#1A1A1A" strokeWidth="0.5"/>
      {/* Power button */}
      <circle cx="23" cy="20.5" r="1.2" fill="#888878" stroke="#1A1A1A" strokeWidth="0.5"/>
      {/* Stand neck */}
      <rect x="13" y="21" width="6" height="4" fill="#A09080" stroke="#1A1A1A" strokeWidth="1"/>
      {/* Stand base */}
      <rect x="9" y="25" width="14" height="3" rx="1.5" fill="#A09080" stroke="#1A1A1A" strokeWidth="1"/>
    </svg>
  );
}

function Pc2() {
  return (
    <svg viewBox="0 0 32 32" width="100%" height="100%">
      {/* Screen lid */}
      <rect x="3" y="3" width="26" height="17" rx="2" fill="#3A3A3A" stroke="#1A1A1A" strokeWidth="1.5"/>
      {/* Screen */}
      <rect x="5" y="5" width="22" height="13" rx="1" fill="#0A1A2A"/>
      {/* Screen glow */}
      <rect x="6" y="6" width="8" height="3" rx="1" fill="#1A3A6A" opacity="0.5"/>
      <rect x="6" y="6" width="3" height="2" rx="0.5" fill="rgba(255,255,255,0.2)"/>
      {/* Desktop UI representation */}
      <rect x="6" y="11" width="4" height="3" rx="0.5" fill="#4A7FBF" opacity="0.7"/>
      <rect x="11" y="11" width="4" height="3" rx="0.5" fill="#4AB87F" opacity="0.7"/>
      <rect x="16" y="11" width="4" height="3" rx="0.5" fill="#BF4A4A" opacity="0.7"/>
      {/* Hinge */}
      <rect x="3" y="20" width="26" height="2" rx="1" fill="#2A2A2A" stroke="#1A1A1A" strokeWidth="1"/>
      {/* Keyboard body */}
      <rect x="2" y="22" width="28" height="8" rx="2" fill="#3A3A3A" stroke="#1A1A1A" strokeWidth="1.5"/>
      {/* Key rows */}
      <rect x="4" y="23.5" width="24" height="1.5" rx="0.5" fill="#2A2A2A"/>
      <rect x="4" y="25.5" width="24" height="1.5" rx="0.5" fill="#2A2A2A"/>
      {/* Trackpad */}
      <rect x="11" y="23.5" width="10" height="5" rx="1" fill="#4A4A4A" stroke="#1A1A1A" strokeWidth="0.5"/>
      {/* Camera dot */}
      <circle cx="16" cy="4" r="0.8" fill="#2A4A7A"/>
    </svg>
  );
}

function Pc3() {
  return (
    <svg viewBox="0 0 32 32" width="100%" height="100%">
      {/* Thin bezel */}
      <rect x="2" y="1" width="28" height="22" rx="2" fill="#E8E8E8" stroke="#1A1A1A" strokeWidth="1.5"/>
      {/* Screen (nearly bezeless) */}
      <rect x="3.5" y="2.5" width="25" height="19" rx="1" fill="#0A1A3A"/>
      {/* Wallpaper gradient hint */}
      <rect x="3.5" y="2.5" width="25" height="9" fill="#1A2A6A" opacity="0.6"/>
      {/* Screen glare diagonal */}
      <polygon points="3.5,2.5 9,2.5 3.5,8" fill="rgba(255,255,255,0.12)"/>
      {/* Desktop icons */}
      <rect x="5" y="13" width="3" height="3" rx="0.5" fill="#4A9FFF" opacity="0.8"/>
      <rect x="9" y="13" width="3" height="3" rx="0.5" fill="#FF6A4A" opacity="0.8"/>
      <rect x="13" y="13" width="3" height="3" rx="0.5" fill="#4AFF9F" opacity="0.8"/>
      {/* Taskbar */}
      <rect x="3.5" y="19.5" width="25" height="2" fill="rgba(255,255,255,0.12)"/>
      {/* Thin neck */}
      <rect x="14" y="23" width="4" height="3" fill="#C8C8C8" stroke="#1A1A1A" strokeWidth="1"/>
      {/* Wide base */}
      <rect x="8" y="26" width="16" height="3" rx="1.5" fill="#C8C8C8" stroke="#1A1A1A" strokeWidth="1"/>
    </svg>
  );
}

function Pc4() {
  return (
    <svg viewBox="0 0 32 32" width="100%" height="100%">
      {/* Left monitor */}
      <rect x="0" y="2" width="14" height="20" rx="1.5" fill="#2A2A2A" stroke="#1A1A1A" strokeWidth="1.5"/>
      <rect x="1.5" y="3.5" width="11" height="16" rx="0.5" fill="#0A1A3A"/>
      <rect x="2" y="4" width="4" height="2" fill="#1A2A6A" opacity="0.6"/>
      {/* Right monitor */}
      <rect x="18" y="2" width="14" height="20" rx="1.5" fill="#2A2A2A" stroke="#1A1A1A" strokeWidth="1.5"/>
      <rect x="19.5" y="3.5" width="11" height="16" rx="0.5" fill="#0A1A3A"/>
      <rect x="20" y="4" width="4" height="2" fill="#1A2A6A" opacity="0.6"/>
      {/* Code on left */}
      <rect x="2" y="8" width="7" height="1" fill="rgba(100,200,100,0.5)"/>
      <rect x="2" y="10" width="5" height="1" fill="rgba(100,160,255,0.5)"/>
      <rect x="2" y="12" width="8" height="1" fill="rgba(100,200,100,0.5)"/>
      <rect x="2" y="14" width="4" height="1" fill="rgba(255,150,100,0.5)"/>
      {/* Dashboard on right */}
      <rect x="20" y="8" width="9" height="5" rx="0.5" fill="rgba(74,127,255,0.3)"/>
      <rect x="20" y="14" width="4" height="4" rx="0.5" fill="rgba(74,255,127,0.3)"/>
      <rect x="25" y="14" width="4" height="4" rx="0.5" fill="rgba(255,100,100,0.3)"/>
      {/* Shared stand bar */}
      <rect x="6" y="22" width="20" height="2" rx="1" fill="#3A3A3A" stroke="#1A1A1A" strokeWidth="1"/>
      <rect x="13" y="24" width="6" height="3" fill="#3A3A3A" stroke="#1A1A1A" strokeWidth="1"/>
      <rect x="9" y="27" width="14" height="3" rx="1.5" fill="#3A3A3A" stroke="#1A1A1A" strokeWidth="1"/>
    </svg>
  );
}

function Pc5() {
  return (
    <svg viewBox="0 0 32 32" width="100%" height="100%">
      {/* Rack chassis */}
      <rect x="4" y="0" width="24" height="32" rx="2" fill="#1A1A1A" stroke="#333" strokeWidth="1.5"/>
      {/* Rack units */}
      {[0,1,2,3,4,5,6].map(i => (
        <g key={i}>
          <rect x="6" y={2 + i*4} width="20" height="3.5" rx="0.5" fill="#2A2A2A" stroke="#3A3A3A" strokeWidth="0.5"/>
          <rect x="6.5" y={2.5 + i*4} width="1" height="2.5" rx="0.3" fill="#1A1A1A"/>
          {/* Status LEDs */}
          <circle cx="24" cy={3.5 + i*4} r="0.8" fill={i % 3 === 0 ? '#00FF44' : '#FF4444'}/>
          <circle cx="22" cy={3.5 + i*4} r="0.8" fill={i % 2 === 0 ? '#00AAFF' : '#444'}/>
          {/* Drive activity */}
          <rect x="9" y={2.8 + i*4} width="10" height="1.5" rx="0.3" fill="#333"/>
          <rect x="9" y={2.8 + i*4} width={3 + (i*2) % 8} height="1.5" rx="0.3" fill="#2A8A2A" opacity="0.8"/>
        </g>
      ))}
      {/* Side handles */}
      <rect x="4" y="5" width="3" height="22" rx="1" fill="#222" stroke="#444" strokeWidth="0.5"/>
      <rect x="25" y="5" width="3" height="22" rx="1" fill="#222" stroke="#444" strokeWidth="0.5"/>
    </svg>
  );
}

function Pc6() {
  return (
    <svg viewBox="0 0 32 32" width="100%" height="100%">
      {/* Room floor */}
      <rect x="0" y="26" width="32" height="6" fill="#1A1A2A"/>
      {/* Three server cabinets */}
      {[0,1,2].map(i => (
        <g key={i} transform={`translate(${i*10}, 0)`}>
          <rect x="1" y="4" width="9" height="22" rx="1" fill="#1A1A1A" stroke="#333" strokeWidth="1"/>
          {[0,1,2,3,4].map(j => (
            <g key={j}>
              <rect x="2" y={5.5 + j*3.5} width="7" height="2.5" rx="0.3" fill="#2A2A2A"/>
              <circle cx="7.5" cy={6.5 + j*3.5} r="0.7" fill={j % 2 === 0 ? '#00FF44' : '#FF4444'}/>
            </g>
          ))}
          {/* Rack lights strip */}
          <rect x="2" y="23" width="7" height="1.5" fill="#0A0A3A"/>
          {[0,1,2,3,4,5].map(k => (
            <rect key={k} x={2.5 + k*1.1} y={23.2} width="0.7" height="1" rx="0.2" fill={['#00FF44','#00AAFF','#FF4444','#FFAA00','#AA00FF','#00FFAA'][k]}/>
          ))}
        </g>
      ))}
      {/* Overhead cooling units */}
      <rect x="1" y="1" width="30" height="3" rx="1" fill="#222" stroke="#444" strokeWidth="0.5"/>
      {[0,1,2,3,4].map(i => (
        <circle key={i} cx={4 + i*6} cy="2.5" r="1.2" fill="#333" stroke="#555" strokeWidth="0.5"/>
      ))}
    </svg>
  );
}

function ErgoChair() {
  return (
    <svg viewBox="0 0 32 32" width="100%" height="100%">
      {/* Backrest */}
      <rect x="9" y="2" width="14" height="16" rx="3" fill="#4A4A4A" stroke="#1A1A1A" strokeWidth="1.5"/>
      {/* Lumbar support curve */}
      <rect x="11" y="12" width="10" height="4" rx="2" fill="#3A3A3A"/>
      {/* Headrest */}
      <rect x="11" y="1" width="10" height="6" rx="3" fill="#5A5A5A" stroke="#1A1A1A" strokeWidth="1"/>
      {/* Seat */}
      <rect x="7" y="18" width="18" height="6" rx="3" fill="#4A4A4A" stroke="#1A1A1A" strokeWidth="1.5"/>
      {/* Armrests */}
      <rect x="4" y="16" width="5" height="9" rx="2" fill="#3A3A3A" stroke="#1A1A1A" strokeWidth="1"/>
      <rect x="23" y="16" width="5" height="9" rx="2" fill="#3A3A3A" stroke="#1A1A1A" strokeWidth="1"/>
      {/* Center column */}
      <rect x="14" y="24" width="4" height="5" fill="#888" stroke="#1A1A1A" strokeWidth="1"/>
      {/* Base star */}
      <rect x="8" y="29" width="16" height="2" rx="1" fill="#888" stroke="#1A1A1A" strokeWidth="1"/>
      <rect x="14" y="27" width="4" height="5" rx="0.5" fill="#888"/>
      {/* Wheels */}
      {[-6,0,6].map(x => (
        <circle key={x} cx={16+x} cy="31" r="1.2" fill="#333" stroke="#1A1A1A" strokeWidth="0.5"/>
      ))}
    </svg>
  );
}

function MechKeyboard() {
  return (
    <svg viewBox="0 0 32 32" width="100%" height="100%">
      {/* Main body */}
      <rect x="1" y="8" width="30" height="18" rx="2" fill="#1A1A2A" stroke="#1A1A1A" strokeWidth="1.5"/>
      {/* RGB underglow */}
      <rect x="1" y="22" width="30" height="4" rx="2" fill="#1A1A2A"/>
      <rect x="2" y="23" width="28" height="2" rx="1" fill="rgba(150,80,255,0.6)"/>
      {/* Key rows */}
      {[0,1,2,3].map(row => (
        <g key={row}>
          {Array.from({ length: row === 3 ? 5 : 9 }).map((_, col) => {
            const colors = ['#FF6B6B','#FFE66B','#6BFF9F','#6BD4FF','#C06BFF'];
            const kw = row === 3 ? 4 : 2.8;
            const kx = row === 3 ? 2 + col*5.5 : 2 + col*3.1;
            return (
              <rect
                key={col}
                x={kx}
                y={9.5 + row*3.5}
                width={kw}
                height="2.5"
                rx="0.5"
                fill={colors[(col+row)%5]}
                stroke="#1A1A1A"
                strokeWidth="0.4"
                opacity="0.9"
              />
            );
          })}
        </g>
      ))}
    </svg>
  );
}

function CoffeeMachine() {
  return (
    <svg viewBox="0 0 32 32" width="100%" height="100%">
      {/* Body */}
      <rect x="6" y="4" width="18" height="22" rx="3" fill="#2A2A2A" stroke="#1A1A1A" strokeWidth="1.5"/>
      {/* Water reservoir top */}
      <rect x="8" y="2" width="14" height="6" rx="2" fill="#1A1A3A" stroke="#1A1A1A" strokeWidth="1"/>
      <rect x="9" y="3" width="12" height="4" rx="1" fill="#0A1A4A" opacity="0.8"/>
      {/* Display panel */}
      <rect x="8" y="8" width="14" height="7" rx="1.5" fill="#0A2A1A" stroke="#1A1A1A" strokeWidth="1"/>
      <rect x="9" y="9" width="12" height="5" rx="1" fill="#0A3A2A"/>
      {/* Red power LED */}
      <circle cx="20" cy="11" r="1.2" fill="#FF4444"/>
      <circle cx="20" cy="11" r="0.6" fill="#FFAAAA"/>
      {/* Coffee buttons */}
      {[0,1,2].map(i => (
        <circle key={i} cx={11 + i*2.5} cy="12" r="0.9" fill="#3A8A3A" stroke="#1A1A1A" strokeWidth="0.5"/>
      ))}
      {/* Portafilter */}
      <rect x="10" y="16" width="12" height="3" rx="2" fill="#4A3A2A" stroke="#1A1A1A" strokeWidth="1"/>
      <rect x="9" y="17" width="5" height="5" rx="1.5" fill="#5A4A3A" stroke="#1A1A1A" strokeWidth="1"/>
      {/* Cup area */}
      <rect x="8" y="22" width="16" height="4" rx="1" fill="#1A1A1A"/>
      {/* Carafe */}
      <rect x="17" y="20" width="7" height="9" rx="1" fill="#3A5A3A" stroke="#1A1A1A" strokeWidth="0.8"/>
      <rect x="18" y="21" width="5" height="7" rx="0.5" fill="#2A6A2A" opacity="0.7"/>
      {/* Steam */}
      <path d="M14 4 Q13 2 14 0 Q15 -1 14 -2" stroke="#CCCCCC" strokeWidth="0.8" fill="none" opacity="0.6"/>
      <path d="M17 4 Q16 2 17 0 Q18 -1 17 -2" stroke="#CCCCCC" strokeWidth="0.8" fill="none" opacity="0.6"/>
    </svg>
  );
}

function StandingDesk() {
  return (
    <svg viewBox="0 0 32 32" width="100%" height="100%">
      {/* Desktop surface */}
      <rect x="2" y="6" width="28" height="4" rx="1.5" fill="#C8A87A" stroke="#1A1A1A" strokeWidth="1.5"/>
      {/* Surface top highlight */}
      <rect x="3" y="6.5" width="26" height="1.5" rx="0.5" fill="rgba(255,255,255,0.25)"/>
      {/* Monitor on desk */}
      <rect x="10" y="1" width="12" height="7" rx="1" fill="#2A2A2A" stroke="#1A1A1A" strokeWidth="1"/>
      <rect x="11" y="2" width="10" height="5" rx="0.5" fill="#0A1A3A"/>
      <rect x="15" y="7" width="2" height="2" fill="#2A2A2A"/>
      {/* Items on desk */}
      <rect x="4" y="5" width="4" height="3" rx="0.5" fill="#3A8A3A" stroke="#1A1A1A" strokeWidth="0.5"/>
      <rect x="24" y="5" width="3" height="4" rx="0.5" fill="#8A3A3A" stroke="#1A1A1A" strokeWidth="0.5"/>
      {/* Left adjustable leg */}
      <rect x="5" y="10" width="4" height="18" rx="1" fill="#888" stroke="#1A1A1A" strokeWidth="1"/>
      {/* Right adjustable leg */}
      <rect x="23" y="10" width="4" height="18" rx="1" fill="#888" stroke="#1A1A1A" strokeWidth="1"/>
      {/* Height indicator marks on legs */}
      {[0,1,2,3,4].map(i => (
        <rect key={i} x="6" y={13 + i*3} width="2" height="0.8" rx="0.3" fill="#666"/>
      ))}
      {/* Crossbar */}
      <rect x="6" y="22" width="20" height="2" rx="1" fill="#777" stroke="#1A1A1A" strokeWidth="1"/>
      {/* Feet */}
      <rect x="3" y="28" width="8" height="3" rx="1.5" fill="#666" stroke="#1A1A1A" strokeWidth="1"/>
      <rect x="21" y="28" width="8" height="3" rx="1.5" fill="#666" stroke="#1A1A1A" strokeWidth="1"/>
    </svg>
  );
}

function SecondMonitor() {
  return (
    <svg viewBox="0 0 32 32" width="100%" height="100%">
      {/* Slim bezel */}
      <rect x="2" y="2" width="28" height="22" rx="2" fill="#1A1A1A" stroke="#333" strokeWidth="1.5"/>
      {/* Screen */}
      <rect x="3.5" y="3.5" width="25" height="19" rx="1" fill="#0A1A3A"/>
      {/* Wallpaper */}
      <rect x="3.5" y="3.5" width="25" height="9" fill="#1A2A6A" opacity="0.5"/>
      <rect x="3.5" y="3.5" width="25" height="4" fill="#0A1A4A" opacity="0.5"/>
      {/* App windows */}
      <rect x="5" y="9" width="10" height="8" rx="0.5" fill="#1A3A6A" stroke="rgba(100,150,255,0.4)" strokeWidth="0.5"/>
      <rect x="16" y="9" width="10" height="8" rx="0.5" fill="#1A4A2A" stroke="rgba(100,255,150,0.4)" strokeWidth="0.5"/>
      {/* Taskbar */}
      <rect x="3.5" y="20.5" width="25" height="2" fill="rgba(255,255,255,0.08)"/>
      {/* Slim stand */}
      <rect x="14.5" y="24" width="3" height="4" fill="#333" stroke="#1A1A1A" strokeWidth="1"/>
      {/* Base */}
      <rect x="10" y="28" width="12" height="3" rx="1.5" fill="#333" stroke="#1A1A1A" strokeWidth="1"/>
    </svg>
  );
}

function Whiteboard() {
  return (
    <svg viewBox="0 0 32 32" width="100%" height="100%">
      {/* Frame */}
      <rect x="2" y="2" width="28" height="22" rx="2" fill="#888" stroke="#1A1A1A" strokeWidth="1.5"/>
      {/* Board surface */}
      <rect x="3" y="3" width="26" height="20" rx="1" fill="#F0F0F0"/>
      {/* Drawing content - mind map style */}
      <circle cx="16" cy="13" r="3" fill="none" stroke="#3A3A3A" strokeWidth="1.2"/>
      <text x="16" y="14" textAnchor="middle" fontSize="2.5" fill="#3A3A3A" fontFamily="monospace">AI</text>
      <line x1="16" y1="10" x2="16" y2="6" stroke="#4A7FBF" strokeWidth="0.8"/>
      <line x1="19" y1="13" x2="24" y2="10" stroke="#7FBF4A" strokeWidth="0.8"/>
      <line x1="13" y1="13" x2="8" y2="10" stroke="#BF4A4A" strokeWidth="0.8"/>
      <line x1="16" y1="16" x2="12" y2="20" stroke="#BF7F4A" strokeWidth="0.8"/>
      <line x1="16" y1="16" x2="20" y2="20" stroke="#7F4ABF" strokeWidth="0.8"/>
      <circle cx="16" cy="5" r="1.5" fill="#4A7FBF" opacity="0.7"/>
      <circle cx="25" cy="9" r="1.5" fill="#7FBF4A" opacity="0.7"/>
      <circle cx="7" cy="9" r="1.5" fill="#BF4A4A" opacity="0.7"/>
      <circle cx="11" cy="21" r="1.5" fill="#BF7F4A" opacity="0.7"/>
      <circle cx="21" cy="21" r="1.5" fill="#7F4ABF" opacity="0.7"/>
      {/* Marker tray */}
      <rect x="3" y="23" width="26" height="2" rx="0.5" fill="#777" stroke="#1A1A1A" strokeWidth="0.5"/>
      {/* Markers */}
      <rect x="5" y="23.3" width="2.5" height="1.4" rx="0.5" fill="#FF4444"/>
      <rect x="8.5" y="23.3" width="2.5" height="1.4" rx="0.5" fill="#4444FF"/>
      <rect x="12" y="23.3" width="2.5" height="1.4" rx="0.5" fill="#44AA44"/>
      {/* Stand legs */}
      <rect x="5" y="25" width="3" height="6" rx="1" fill="#666" stroke="#1A1A1A" strokeWidth="1"/>
      <rect x="24" y="25" width="3" height="6" rx="1" fill="#666" stroke="#1A1A1A" strokeWidth="1"/>
      {/* Feet */}
      <rect x="4" y="29" width="5" height="2" rx="1" fill="#555"/>
      <rect x="23" y="29" width="5" height="2" rx="1" fill="#555"/>
    </svg>
  );
}

function ProPhone() {
  return (
    <svg viewBox="0 0 32 32" width="100%" height="100%">
      {/* Phone body */}
      <rect x="8" y="1" width="16" height="30" rx="4" fill="#1A1A1A" stroke="#333" strokeWidth="1.5"/>
      {/* Screen */}
      <rect x="9.5" y="3" width="13" height="24" rx="3" fill="#0A1A3A"/>
      {/* Notch */}
      <rect x="13" y="3" width="6" height="2" rx="1" fill="#1A1A1A"/>
      <circle cx="15.5" cy="4" r="0.7" fill="#2A2A4A"/>
      {/* App grid */}
      {[0,1,2,3].map(row => (
        [0,1,2].map(col => {
          const colors = ['#FF6B6B','#FFE66B','#6BFFA0','#6BC4FF','#C06BFF','#FF9F6B','#6BFFE0','#A06BFF','#FFD06B','#6BFF6B','#FF6BD0','#6B9FFF'];
          return (
            <rect
              key={`${row}-${col}`}
              x={11 + col*3.8}
              y={7 + row*4.5}
              width="3"
              height="3"
              rx="0.8"
              fill={colors[(row*3+col)%12]}
            />
          );
        })
      ))}
      {/* Home bar */}
      <rect x="13" y="25.5" width="6" height="1" rx="0.5" fill="rgba(255,255,255,0.3)"/>
      {/* Side button */}
      <rect x="24" y="10" width="1.5" height="5" rx="0.7" fill="#333"/>
    </svg>
  );
}

function GamingChair() {
  return (
    <svg viewBox="0 0 32 32" width="100%" height="100%">
      {/* Backrest - red with black wings */}
      <rect x="8" y="2" width="16" height="18" rx="3" fill="#CC2222" stroke="#1A1A1A" strokeWidth="1.5"/>
      {/* Side wings */}
      <rect x="5" y="4" width="6" height="12" rx="2" fill="#1A1A1A" stroke="#1A1A1A" strokeWidth="1"/>
      <rect x="21" y="4" width="6" height="12" rx="2" fill="#1A1A1A" stroke="#1A1A1A" strokeWidth="1"/>
      {/* Racing stripe */}
      <rect x="14" y="3" width="4" height="16" rx="1" fill="#1A1A1A" opacity="0.6"/>
      {/* Headrest */}
      <rect x="10" y="1" width="12" height="6" rx="3" fill="#CC2222" stroke="#1A1A1A" strokeWidth="1.5"/>
      {/* RGB line on headrest */}
      <rect x="12" y="6" width="8" height="1" rx="0.5" fill="rgba(150,80,255,0.8)"/>
      {/* Seat */}
      <rect x="7" y="20" width="18" height="6" rx="3" fill="#CC2222" stroke="#1A1A1A" strokeWidth="1.5"/>
      {/* Seat stripe */}
      <rect x="14" y="20" width="4" height="6" rx="1" fill="#1A1A1A" opacity="0.5"/>
      {/* Armrests */}
      <rect x="4" y="18" width="5" height="9" rx="2" fill="#2A2A2A" stroke="#1A1A1A" strokeWidth="1"/>
      <rect x="23" y="18" width="5" height="9" rx="2" fill="#2A2A2A" stroke="#1A1A1A" strokeWidth="1"/>
      {/* Column */}
      <rect x="14" y="26" width="4" height="4" fill="#888" stroke="#1A1A1A" strokeWidth="1"/>
      {/* Base + wheels */}
      <rect x="8" y="29" width="16" height="2" rx="1" fill="#888" stroke="#1A1A1A" strokeWidth="1"/>
      {[-5,0,5].map(x => <circle key={x} cx={16+x} cy="31.5" r="1.2" fill="#333"/>)}
    </svg>
  );
}

function Plant() {
  return (
    <svg viewBox="0 0 32 32" width="100%" height="100%">
      {/* Pot */}
      <rect x="10" y="22" width="12" height="9" rx="2" fill="#C85A2A" stroke="#1A1A1A" strokeWidth="1.5"/>
      <rect x="8" y="21" width="16" height="3" rx="1.5" fill="#A84A22" stroke="#1A1A1A" strokeWidth="1.5"/>
      {/* Soil */}
      <rect x="10" y="22" width="12" height="3" rx="1" fill="#5A3A1A"/>
      {/* Main stem */}
      <rect x="15" y="12" width="2" height="10" rx="1" fill="#2A6A1A"/>
      {/* Leaves */}
      <ellipse cx="12" cy="14" rx="6" ry="4" fill="#2A8A1A" stroke="#1A1A1A" strokeWidth="0.8" transform="rotate(-20 12 14)"/>
      <ellipse cx="20" cy="12" rx="6" ry="4" fill="#3A9A2A" stroke="#1A1A1A" strokeWidth="0.8" transform="rotate(20 20 12)"/>
      <ellipse cx="11" cy="8" rx="5" ry="3.5" fill="#2A8A1A" stroke="#1A1A1A" strokeWidth="0.8" transform="rotate(-30 11 8)"/>
      <ellipse cx="21" cy="7" rx="5" ry="3.5" fill="#3A9A2A" stroke="#1A1A1A" strokeWidth="0.8" transform="rotate(35 21 7)"/>
      <ellipse cx="16" cy="4" rx="4" ry="3" fill="#4AAA3A" stroke="#1A1A1A" strokeWidth="0.8"/>
      {/* Leaf veins */}
      <line x1="10" y1="14" x2="14" y2="14" stroke="#1A5A1A" strokeWidth="0.5"/>
      <line x1="18" y1="12" x2="22" y2="12" stroke="#1A5A1A" strokeWidth="0.5"/>
    </svg>
  );
}

function MotivationalPoster() {
  return (
    <svg viewBox="0 0 32 32" width="100%" height="100%">
      {/* Frame */}
      <rect x="2" y="2" width="28" height="28" rx="2" fill="#4A3A2A" stroke="#1A1A1A" strokeWidth="1.5"/>
      {/* Mat */}
      <rect x="4" y="4" width="24" height="24" rx="1" fill="#F5E8D0"/>
      {/* Orange background block */}
      <rect x="5" y="5" width="22" height="22" rx="0.5" fill="#F97316"/>
      {/* White text bars */}
      <rect x="6" y="9" width="20" height="3.5" rx="0.5" fill="white"/>
      <rect x="6" y="14" width="20" height="3.5" rx="0.5" fill="white"/>
      <rect x="6" y="19" width="14" height="3.5" rx="0.5" fill="white"/>
      {/* Accent stripe */}
      <rect x="6" y="6" width="20" height="2" rx="0.5" fill="#C75300"/>
      <rect x="6" y="24" width="20" height="2" rx="0.5" fill="#C75300"/>
      {/* Star detail */}
      <circle cx="23" cy="22" r="2.5" fill="#FFCC00" stroke="#1A1A1A" strokeWidth="0.5"/>
      <polygon points="23,19.5 23.7,21.5 25.8,21.5 24.1,22.8 24.7,24.8 23,23.5 21.3,24.8 21.9,22.8 20.2,21.5 22.3,21.5" fill="white" opacity="0.8"/>
    </svg>
  );
}

function Bookshelf() {
  return (
    <svg viewBox="0 0 32 32" width="100%" height="100%">
      {/* Main frame */}
      <rect x="2" y="2" width="28" height="30" rx="2" fill="#8B5E3C" stroke="#1A1A1A" strokeWidth="1.5"/>
      {/* Back panel */}
      <rect x="3.5" y="3.5" width="25" height="27" rx="1" fill="#C8905A"/>
      {/* Top shelf */}
      <rect x="2" y="12" width="28" height="2" fill="#6B4423" stroke="#1A1A1A" strokeWidth="1"/>
      {/* Mid shelf */}
      <rect x="2" y="22" width="28" height="2" fill="#6B4423" stroke="#1A1A1A" strokeWidth="1"/>
      {/* Row 1 books */}
      {[
        {x:4,w:3,h:9,c:'#CC4444'},{x:8,w:2.5,h:8,c:'#4444CC'},{x:11.5,w:3,h:9,c:'#44AA44'},
        {x:15.5,w:2.5,h:8,c:'#AAAA44'},{x:19,w:3,h:9,c:'#AA44AA'},{x:23,w:2.5,h:7,c:'#44AAAA'},
        {x:26.5,w:2,h:8,c:'#FF8844'},
      ].map((b,i) => (
        <g key={i}>
          <rect x={b.x} y={12-b.h} width={b.w} height={b.h} rx="0.3" fill={b.c} stroke="#1A1A1A" strokeWidth="0.4"/>
          <rect x={b.x+0.3} y={12-b.h+0.5} width={b.w-0.6} height="1.5" rx="0.2" fill="rgba(255,255,255,0.2)"/>
        </g>
      ))}
      {/* Row 2 books */}
      {[
        {x:4,w:2.5,h:8,c:'#FF6644'},{x:7.5,w:3,h:9,c:'#4488FF'},{x:11.5,w:2,h:7,c:'#44CC88'},
        {x:14.5,w:3,h:8,c:'#FFCC44'},{x:18.5,w:2.5,h:9,c:'#CC44FF'},{x:22,w:3,h:8,c:'#44CCCC'},
        {x:26,w:2.5,h:7,c:'#FF4488'},
      ].map((b,i) => (
        <g key={i}>
          <rect x={b.x} y={22-b.h} width={b.w} height={b.h} rx="0.3" fill={b.c} stroke="#1A1A1A" strokeWidth="0.4"/>
          <rect x={b.x+0.3} y={22-b.h+0.5} width={b.w-0.6} height="1.5" rx="0.2" fill="rgba(255,255,255,0.2)"/>
        </g>
      ))}
      {/* Row 3 items (mix of books and objects) */}
      {[
        {x:4,w:3,h:7,c:'#AA4444'},{x:8,w:2.5,h:8,c:'#4455BB'},{x:11.5,w:4,h:6,c:'#558855'},
        {x:16.5,w:2.5,h:7,c:'#AA8844'},{x:20,w:3,h:8,c:'#884488'},{x:24,w:4,h:6,c:'#448888'},
      ].map((b,i) => (
        <rect key={i} x={b.x} y={32-b.h} width={b.w} height={b.h} rx="0.3" fill={b.c} stroke="#1A1A1A" strokeWidth="0.4"/>
      ))}
      {/* Small plant on top */}
      <ellipse cx="28" cy="8" rx="2.5" ry="2" fill="#3A9A2A"/>
      <rect x="27.5" y="9.5" width="1" height="2" fill="#5A3A1A"/>
    </svg>
  );
}

function MiniFridge() {
  return (
    <svg viewBox="0 0 32 32" width="100%" height="100%">
      {/* Body */}
      <rect x="5" y="2" width="22" height="30" rx="3" fill="#C8D8E8" stroke="#1A1A1A" strokeWidth="1.5"/>
      {/* Freezer compartment */}
      <rect x="5" y="2" width="22" height="10" rx="3" fill="#A8C0D0" stroke="#1A1A1A" strokeWidth="1.5"/>
      {/* Divider */}
      <rect x="5" y="12" width="22" height="2" fill="#888" stroke="#1A1A1A" strokeWidth="1"/>
      {/* Door handle - freezer */}
      <rect x="22" y="5" width="2.5" height="5" rx="1.2" fill="#888" stroke="#1A1A1A" strokeWidth="1"/>
      {/* Door handle - fridge */}
      <rect x="22" y="17" width="2.5" height="10" rx="1.2" fill="#888" stroke="#1A1A1A" strokeWidth="1"/>
      {/* Ice tray frost */}
      <rect x="7" y="4" width="8" height="2.5" rx="0.5" fill="white" opacity="0.4"/>
      {/* Contents visible */}
      <rect x="7" y="16" width="5" height="4" rx="0.5" fill="#AADDAA" opacity="0.8"/>
      <rect x="13" y="17" width="3" height="3" rx="0.5" fill="#FFCC88" opacity="0.8"/>
      <rect x="7" y="21" width="4" height="5" rx="0.5" fill="#FFAAAA" opacity="0.8"/>
      <rect x="12" y="22" width="4" height="4" rx="0.5" fill="#AACCFF" opacity="0.8"/>
      {/* Magnetic front panel detail */}
      <rect x="7" y="14" width="10" height="1" rx="0.3" fill="#AAB8C8"/>
    </svg>
  );
}

function LedLights() {
  return (
    <svg viewBox="0 0 32 32" width="100%" height="100%">
      {/* Housing strip */}
      <rect x="1" y="13" width="30" height="6" rx="2" fill="#1A1A1A" stroke="#333" strokeWidth="1"/>
      {/* Individual LEDs */}
      {['#FF0044','#FF6600','#FFEE00','#00FF44','#0088FF','#AA00FF','#FF00AA','#FF0044','#00FFEE','#FFCC00'].map((color, i) => (
        <g key={i}>
          <rect x={2.5 + i*2.8} y="14" width="2" height="4" rx="0.5" fill={color} opacity="0.9"/>
          {/* Glow */}
          <rect x={2 + i*2.8} y="13.5" width="3" height="5" rx="1" fill={color} opacity="0.2"/>
        </g>
      ))}
      {/* Mounting clips */}
      <rect x="1" y="11" width="4" height="4" rx="1" fill="#444" stroke="#333" strokeWidth="0.5"/>
      <rect x="27" y="11" width="4" height="4" rx="1" fill="#444" stroke="#333" strokeWidth="0.5"/>
      {/* Wire */}
      <path d="M2 16 Q2 8 6 8" stroke="#222" strokeWidth="1" fill="none"/>
      {/* Glow ambient on wall */}
      <rect x="0" y="8" width="32" height="6" rx="1" fill="url(#rgbGrad)" opacity="0.15"/>
      <defs>
        <linearGradient id="rgbGrad" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0%" stopColor="#FF0044"/>
          <stop offset="25%" stopColor="#FFEE00"/>
          <stop offset="50%" stopColor="#00FF44"/>
          <stop offset="75%" stopColor="#0088FF"/>
          <stop offset="100%" stopColor="#AA00FF"/>
        </linearGradient>
      </defs>
    </svg>
  );
}

function FloorLamp() {
  return (
    <svg viewBox="0 0 32 32" width="100%" height="100%">
      {/* Lampshade */}
      <path d="M7 8 L10 2 L22 2 L25 8 Z" fill="#F5E8B0" stroke="#1A1A1A" strokeWidth="1.5"/>
      {/* Shade inner (rim) */}
      <rect x="7" y="7.5" width="18" height="1.5" rx="0.5" fill="#D4C080" stroke="#1A1A1A" strokeWidth="0.5"/>
      {/* Bulb glow */}
      <circle cx="16" cy="5" r="3" fill="rgba(255,240,180,0.6)"/>
      <circle cx="16" cy="5" r="1.5" fill="#FFF8D0"/>
      {/* Shade outer glow */}
      <path d="M5 9 L8 3 L10 2 L22 2 L24 3 L27 9 Z" fill="rgba(255,240,100,0.1)"/>
      {/* Neck */}
      <rect x="15" y="8" width="2" height="6" fill="#888" stroke="#1A1A1A" strokeWidth="0.8"/>
      {/* Elbow joint */}
      <circle cx="16" cy="14" r="2" fill="#777" stroke="#1A1A1A" strokeWidth="0.8"/>
      {/* Pole */}
      <rect x="15" y="14" width="2" height="14" rx="1" fill="#888" stroke="#1A1A1A" strokeWidth="0.8"/>
      {/* Base */}
      <ellipse cx="16" cy="29" rx="8" ry="2.5" fill="#666" stroke="#1A1A1A" strokeWidth="1"/>
      {/* Base detail */}
      <rect x="13" y="28" width="6" height="3" rx="1.5" fill="#777" stroke="#1A1A1A" strokeWidth="0.8"/>
      {/* Ambient glow on floor */}
      <ellipse cx="16" cy="31" rx="6" ry="1" fill="rgba(255,240,180,0.25)"/>
    </svg>
  );
}

function TrophyShelf() {
  return (
    <svg viewBox="0 0 32 32" width="100%" height="100%">
      {/* Wall-mount shelf */}
      <rect x="2" y="18" width="28" height="3" rx="1.5" fill="#8B5E3C" stroke="#1A1A1A" strokeWidth="1.5"/>
      {/* Shelf bracket left */}
      <polygon points="4,18 4,22 8,22" fill="#6B4423" stroke="#1A1A1A" strokeWidth="1"/>
      {/* Shelf bracket right */}
      <polygon points="28,18 28,22 24,22" fill="#6B4423" stroke="#1A1A1A" strokeWidth="1"/>
      {/* Trophy */}
      <rect x="11" y="10" width="10" height="8" rx="2" fill="#FFD700" stroke="#B8860B" strokeWidth="1"/>
      <rect x="9" y="8" width="14" height="3" rx="1" fill="#FFF0A0" stroke="#B8860B" strokeWidth="1"/>
      <rect x="13" y="17.5" width="6" height="3" rx="0.5" fill="#FFD700" stroke="#B8860B" strokeWidth="1"/>
      <rect x="11" y="20" width="10" height="2" rx="1" fill="#CC9900" stroke="#B8860B" strokeWidth="1"/>
      {/* Trophy star */}
      <polygon points="16,10 16.7,12.1 19,12.1 17.1,13.4 17.8,15.5 16,14.2 14.2,15.5 14.9,13.4 13,12.1 15.3,12.1" fill="rgba(255,255,255,0.6)"/>
      {/* Handles */}
      <path d="M11 11 Q8 11 8 13 Q8 15 11 15" fill="none" stroke="#FFD700" strokeWidth="1.5"/>
      <path d="M21 11 Q24 11 24 13 Q24 15 21 15" fill="none" stroke="#FFD700" strokeWidth="1.5"/>
      {/* Medals */}
      <circle cx="5" cy="14" r="3" fill="#C0C0C0" stroke="#808080" strokeWidth="1"/>
      <rect x="4" y="10" width="2" height="5" rx="0.5" fill="#808080"/>
      <circle cx="27" cy="14" r="3" fill="#CD7F32" stroke="#8B4513" strokeWidth="1"/>
      <rect x="26" y="10" width="2" height="5" rx="0.5" fill="#8B4513"/>
      <circle cx="27" cy="14" r="1.5" fill="#E8943A"/>
    </svg>
  );
}

function Couch() {
  return (
    <svg viewBox="0 0 32 32" width="100%" height="100%">
      {/* Back cushion */}
      <rect x="2" y="10" width="28" height="12" rx="3" fill="#6357B8" stroke="#1A1A1A" strokeWidth="1.5"/>
      {/* Back top trim */}
      <rect x="2" y="10" width="28" height="3" rx="3" fill="#7A6DD4"/>
      {/* Cushions divider */}
      <rect x="15.5" y="14" width="1" height="8" rx="0.5" fill="#4A45A0"/>
      {/* Seat base */}
      <rect x="2" y="21" width="28" height="7" rx="2" fill="#5349A8" stroke="#1A1A1A" strokeWidth="1.5"/>
      {/* Armrests */}
      <rect x="1" y="12" width="5" height="15" rx="2.5" fill="#6357B8" stroke="#1A1A1A" strokeWidth="1.5"/>
      <rect x="26" y="12" width="5" height="15" rx="2.5" fill="#6357B8" stroke="#1A1A1A" strokeWidth="1.5"/>
      {/* Armrest tops */}
      <rect x="1" y="11" width="5" height="3" rx="1.5" fill="#7A6DD4"/>
      <rect x="26" y="11" width="5" height="3" rx="1.5" fill="#7A6DD4"/>
      {/* Feet */}
      <rect x="4" y="27" width="4" height="4" rx="1" fill="#3A3030" stroke="#1A1A1A" strokeWidth="0.8"/>
      <rect x="24" y="27" width="4" height="4" rx="1" fill="#3A3030" stroke="#1A1A1A" strokeWidth="0.8"/>
      {/* Pillow on one side */}
      <rect x="4" y="13" width="8" height="8" rx="2" fill="#9887E0" stroke="#1A1A1A" strokeWidth="0.8"/>
      <rect x="5" y="14" width="6" height="6" rx="1" fill="#A898E8" opacity="0.6"/>
    </svg>
  );
}

function WindowView() {
  return (
    <svg viewBox="0 0 32 32" width="100%" height="100%">
      {/* Window frame */}
      <rect x="1" y="1" width="30" height="30" rx="2" fill="#8B7A6A" stroke="#1A1A1A" strokeWidth="2"/>
      {/* Sky */}
      <rect x="3" y="3" width="26" height="20" rx="1" fill="#0A1A3A"/>
      {/* Night sky gradient */}
      <rect x="3" y="3" width="26" height="10" rx="1" fill="#0A0A2A"/>
      {/* Stars */}
      {[[6,6],[10,4],[15,5],[20,7],[24,4],[28,6],[8,10],[18,9],[26,8]].map(([x,y],i) => (
        <circle key={i} cx={x} cy={y} r="0.5" fill="white"/>
      ))}
      {/* City buildings */}
      <rect x="3" y="17" width="4" height="6" fill="#1A2A4A"/>
      <rect x="8" y="14" width="5" height="9" fill="#2A3A5A"/>
      <rect x="14" y="16" width="4" height="7" fill="#1A2A4A"/>
      <rect x="19" y="13" width="6" height="10" fill="#2A3A5A"/>
      <rect x="26" y="16" width="4" height="7" fill="#1A2A4A"/>
      {/* Building windows */}
      {[[4,19],[5,21],[9,16],[10,18],[11,20],[15,18],[20,15],[21,17],[22,19],[27,18]].map(([x,y],i) => (
        <rect key={i} x={x} y={y} width="1.5" height="1.5" fill="#FFDD88" opacity="0.8"/>
      ))}
      {/* Ground / street */}
      <rect x="3" y="23" width="26" height="3" rx="0.5" fill="#0A0A1A"/>
      {/* Street lights glow */}
      <circle cx="10" cy="24" r="1" fill="#FFCC44" opacity="0.6"/>
      <circle cx="22" cy="24" r="1" fill="#FFCC44" opacity="0.6"/>
      {/* Window muntins */}
      <rect x="15" y="3" width="2" height="26" rx="0.5" fill="#8B7A6A" opacity="0.8"/>
      <rect x="3" y="15" width="26" height="2" rx="0.5" fill="#8B7A6A" opacity="0.8"/>
      {/* Bottom sill */}
      <rect x="1" y="27" width="30" height="4" rx="1" fill="#8B7A6A" stroke="#1A1A1A" strokeWidth="1"/>
    </svg>
  );
}

// ─── Missing sprite fallback ─────────────────────────────────────────────────

function MissingSprite({ id }: { id: string }) {
  return (
    <svg viewBox="0 0 32 32" width="100%" height="100%">
      <rect x="0" y="0" width="32" height="32" fill="#FF00FF"/>
      <rect x="2" y="2" width="28" height="28" fill="none" stroke="white" strokeWidth="1.5" strokeDasharray="3,2"/>
      <text x="16" y="14" textAnchor="middle" fontSize="5" fill="white" fontWeight="bold">?</text>
      <text x="16" y="21" textAnchor="middle" fontSize="3" fill="white">{id.slice(0,8)}</text>
    </svg>
  );
}

// ─── Registry ────────────────────────────────────────────────────────────────

type SpriteComponent = () => ReactElement;

export const SPRITE_REGISTRY: Record<string, SpriteComponent> = {
  // PC tiers
  'pc-1': Pc1,
  'pc-2': Pc2,
  'pc-3': Pc3,
  'pc-4': Pc4,
  'pc-5': Pc5,
  'pc-6': Pc6,
  // Equipment
  'ergo-chair':     ErgoChair,
  'mech-keyboard':  MechKeyboard,
  'coffee-machine': CoffeeMachine,
  'standing-desk':  StandingDesk,
  'second-monitor': SecondMonitor,
  'whiteboard':     Whiteboard,
  'pro-phone':      ProPhone,
  'gaming-chair':   GamingChair,
  // Furniture & Decor
  'plant':                Plant,
  'motivational-poster':  MotivationalPoster,
  'bookshelf':            Bookshelf,
  'mini-fridge':          MiniFridge,
  'led-lights':           LedLights,
  'floor-lamp':           FloorLamp,
  'trophy-shelf':         TrophyShelf,
  'couch':                Couch,
  'window-view':          WindowView,
};

// ─── Main component ───────────────────────────────────────────────────────────

interface ItemSpriteProps {
  id: string;
  height: number;
  className?: string;
}

export default function ItemSprite({ id, height, className }: ItemSpriteProps) {
  const Sprite = SPRITE_REGISTRY[id];
  return (
    <div
      style={{ height, width: height, imageRendering: 'pixelated', flexShrink: 0 }}
      className={className}
    >
      {Sprite ? <Sprite /> : <MissingSprite id={id} />}
    </div>
  );
}
