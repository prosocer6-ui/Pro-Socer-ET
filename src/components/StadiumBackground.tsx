import React, { useMemo } from 'react';

/**
 * Premium Cinematic Football Stadium Animated Background
 * 
 * Visual features:
 * - Realistic football stadium atmosphere with subtle moving floodlights
 * - Slow drifting horizontal mist layers across the field
 * - Floating atmospheric stadium light dust particles
 * - Gentle stadium-light movement & breathing arena glow
 * - Subtle 3D football pitch pattern with slow parallax depth
 * - Responsive on mobile, tablet, and desktop
 * - Respects prefers-reduced-motion accessibility preferences
 * - Preserves existing dark/gold/pitch color palette
 */
export const StadiumBackground: React.FC = () => {
  // Deterministic floating stadium particles
  const particles = useMemo(() => {
    return [
      { id: 1, left: '12%', top: '70%', size: 3, delay: '0s', dur: '12s', tx: '25px' },
      { id: 2, left: '22%', top: '80%', size: 2.5, delay: '2.5s', dur: '15s', tx: '-20px' },
      { id: 3, left: '34%', top: '65%', size: 3.5, delay: '1s', dur: '13s', tx: '18px' },
      { id: 4, left: '46%', top: '85%', size: 2, delay: '5s', dur: '16s', tx: '-25px' },
      { id: 5, left: '58%', top: '68%', size: 3, delay: '2s', dur: '11s', tx: '22px' },
      { id: 6, left: '70%', top: '78%', size: 3.5, delay: '6.5s', dur: '14s', tx: '-15px' },
      { id: 7, left: '82%', top: '62%', size: 2, delay: '3.8s', dur: '17s', tx: '20px' },
      { id: 8, left: '18%', top: '55%', size: 2.5, delay: '8s', dur: '13s', tx: '-22px' },
      { id: 9, left: '52%', top: '58%', size: 2, delay: '4.5s', dur: '15s', tx: '12px' },
      { id: 10, left: '78%', top: '52%', size: 3, delay: '9.2s', dur: '12s', tx: '-18px' },
      { id: 11, left: '30%', top: '48%', size: 2, delay: '7s', dur: '18s', tx: '15px' },
      { id: 12, left: '64%', top: '45%', size: 2.5, delay: '10.5s', dur: '15s', tx: '-10px' },
    ];
  }, []);

  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none bg-[#05070a]"
      aria-hidden="true"
    >
      {/* 1. Stadium Night Sky Ambient Lighting & Central Arena Spotlight */}
      <div className="absolute inset-0 stadium-lighting opacity-90" />
      <div className="absolute -top-36 left-1/2 -translate-x-1/2 w-[900px] max-w-[130vw] h-[480px] bg-amber-400/[0.12] blur-[130px] rounded-full anim-stadium-breath" />

      {/* 2. Realistic Volumetric Stadium Floodlights */}
      {/* Outer Left Main Tower Beam */}
      <div
        className="anim-floodlight-left absolute -top-10 left-[2%] sm:left-[8%] w-[260px] sm:w-[380px] h-[95vh] blur-md pointer-events-none"
        style={{
          background: 'linear-gradient(175deg, rgba(255, 225, 120, 0.28) 0%, rgba(245, 158, 11, 0.12) 35%, rgba(245, 158, 11, 0.02) 70%, transparent 100%)',
          clipPath: 'polygon(48% 0%, 52% 0%, 100% 100%, 0% 100%)',
        }}
      />

      {/* Inner Left Auxiliary Tower Beam */}
      <div
        className="anim-floodlight-center-left absolute -top-10 left-[20%] sm:left-[24%] w-[180px] sm:w-[260px] h-[85vh] blur-md pointer-events-none"
        style={{
          background: 'linear-gradient(170deg, rgba(255, 235, 160, 0.20) 0%, rgba(245, 158, 11, 0.07) 40%, transparent 100%)',
          clipPath: 'polygon(48% 0%, 52% 0%, 100% 100%, 0% 100%)',
        }}
      />

      {/* Inner Right Auxiliary Tower Beam */}
      <div
        className="anim-floodlight-center-right absolute -top-10 right-[20%] sm:right-[24%] w-[180px] sm:w-[260px] h-[85vh] blur-md pointer-events-none"
        style={{
          background: 'linear-gradient(190deg, rgba(255, 235, 160, 0.20) 0%, rgba(245, 158, 11, 0.07) 40%, transparent 100%)',
          clipPath: 'polygon(48% 0%, 52% 0%, 100% 100%, 0% 100%)',
        }}
      />

      {/* Outer Right Main Tower Beam */}
      <div
        className="anim-floodlight-right absolute -top-10 right-[2%] sm:right-[8%] w-[260px] sm:w-[380px] h-[95vh] blur-md pointer-events-none"
        style={{
          background: 'linear-gradient(185deg, rgba(255, 225, 120, 0.28) 0%, rgba(245, 158, 11, 0.12) 35%, rgba(245, 158, 11, 0.02) 70%, transparent 100%)',
          clipPath: 'polygon(48% 0%, 52% 0%, 100% 100%, 0% 100%)',
        }}
      />

      {/* 3. Stadium Overhead Gantry Light Points */}
      <div className="absolute top-1 inset-x-0 flex justify-between px-6 sm:px-20 opacity-75">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-amber-200 shadow-[0_0_10px_#ffd700]" />
          <span className="w-1.5 h-1.5 rounded-full bg-yellow-100 shadow-[0_0_8px_#ffd700]" />
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-[0_0_12px_#ffd700]" />
          <span className="w-1.5 h-1.5 rounded-full bg-yellow-200 shadow-[0_0_8px_#ffd700]" />
        </div>
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-yellow-200 shadow-[0_0_8px_#ffd700]" />
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-[0_0_12px_#ffd700]" />
          <span className="w-1.5 h-1.5 rounded-full bg-yellow-100 shadow-[0_0_8px_#ffd700]" />
          <span className="w-2 h-2 rounded-full bg-amber-200 shadow-[0_0_10px_#ffd700]" />
        </div>
      </div>

      {/* 4. Subtle 3D Football Pitch with Slow Parallax Depth */}
      <div
        className="absolute bottom-0 inset-x-0 h-[40vh] sm:h-[46vh] flex items-end justify-center pointer-events-none"
        style={{
          perspective: '750px',
          perspectiveOrigin: '50% 10%',
        }}
      >
        {/* The 3D Pitch Plane with slow breathing parallax */}
        <div
          className="anim-pitch-3d relative w-[130vw] max-w-[1500px] h-[380px] -bottom-10 sm:-bottom-12"
          style={{
            transformOrigin: '50% 100%',
          }}
        >
          {/* Lawn with mowing bands and pitch glow */}
          <div
            className="absolute inset-0 rounded-t-[32px]"
            style={{
              background: `
                radial-gradient(ellipse at 50% 100%, rgba(16, 185, 129, 0.28) 0%, rgba(6, 78, 59, 0.16) 50%, transparent 85%),
                repeating-linear-gradient(90deg, rgba(16, 185, 129, 0.10) 0px, rgba(16, 185, 129, 0.10) 50px, rgba(5, 150, 105, 0.04) 50px, rgba(5, 150, 105, 0.04) 100px)
              `,
              maskImage: 'linear-gradient(to top, rgba(0,0,0,1) 30%, rgba(0,0,0,0.4) 75%, transparent 100%)',
              WebkitMaskImage: 'linear-gradient(to top, rgba(0,0,0,1) 30%, rgba(0,0,0,0.4) 75%, transparent 100%)',
            }}
          />

          {/* Tactical Pitch Lines (Perimeter, Halfway, Center Circle, Boxes) */}
          <svg
            className="absolute inset-0 w-full h-full opacity-65"
            viewBox="0 0 1000 360"
            preserveAspectRatio="none"
          >
            {/* Outer Pitch Touchline */}
            <rect
              x="60"
              y="30"
              width="880"
              height="300"
              fill="none"
              stroke="#10b981"
              strokeWidth="2"
              strokeOpacity="0.65"
            />
            <rect
              x="60"
              y="30"
              width="880"
              height="300"
              fill="none"
              stroke="#ffd700"
              strokeWidth="1"
              strokeOpacity="0.4"
            />

            {/* Halfway Line */}
            <line
              x1="500"
              y1="30"
              x2="500"
              y2="330"
              stroke="#10b981"
              strokeWidth="2"
              strokeOpacity="0.7"
            />
            <line
              x1="500"
              y1="30"
              x2="500"
              y2="330"
              stroke="#ffd700"
              strokeWidth="1"
              strokeOpacity="0.45"
            />

            {/* Center Circle */}
            <circle
              cx="500"
              cy="180"
              r="65"
              fill="none"
              stroke="#10b981"
              strokeWidth="2"
              strokeOpacity="0.7"
            />
            <circle
              cx="500"
              cy="180"
              r="65"
              fill="none"
              stroke="#ffd700"
              strokeWidth="1"
              strokeOpacity="0.45"
            />
            {/* Center Spot */}
            <circle cx="500" cy="180" r="3.5" fill="#ffd700" fillOpacity="0.85" />

            {/* Left Penalty Area */}
            <rect
              x="60"
              y="95"
              width="140"
              height="170"
              fill="none"
              stroke="#10b981"
              strokeWidth="1.6"
              strokeOpacity="0.55"
            />
            {/* Left Goal Area */}
            <rect
              x="60"
              y="135"
              width="50"
              height="90"
              fill="none"
              stroke="#10b981"
              strokeWidth="1.2"
              strokeOpacity="0.45"
            />
            {/* Left Penalty Spot & Arc */}
            <circle cx="150" cy="180" r="3" fill="#ffd700" fillOpacity="0.75" />
            <path
              d="M 200 145 A 45 45 0 0 1 200 215"
              fill="none"
              stroke="#10b981"
              strokeWidth="1.5"
              strokeOpacity="0.55"
            />

            {/* Right Penalty Area */}
            <rect
              x="800"
              y="95"
              width="140"
              height="170"
              fill="none"
              stroke="#10b981"
              strokeWidth="1.6"
              strokeOpacity="0.55"
            />
            {/* Right Goal Area */}
            <rect
              x="890"
              y="135"
              width="50"
              height="90"
              fill="none"
              stroke="#10b981"
              strokeWidth="1.2"
              strokeOpacity="0.45"
            />
            {/* Right Penalty Spot & Arc */}
            <circle cx="850" cy="180" r="3" fill="#ffd700" fillOpacity="0.75" />
            <path
              d="M 800 145 A 45 45 0 0 0 800 215"
              fill="none"
              stroke="#10b981"
              strokeWidth="1.5"
              strokeOpacity="0.55"
            />
          </svg>
        </div>
      </div>

      {/* 5. Slow Drifting Mist Layers Across the Pitch */}
      {/* Drifting Mist A */}
      <div
        className="anim-mist-a absolute bottom-4 sm:bottom-8 -inset-x-24 h-48 sm:h-56 pointer-events-none opacity-55"
        style={{
          background: 'radial-gradient(ellipse at 35% 75%, rgba(255, 215, 0, 0.12) 0%, rgba(16, 185, 129, 0.08) 35%, transparent 70%)',
          filter: 'blur(30px)',
        }}
      />
      {/* Drifting Mist B */}
      <div
        className="anim-mist-b absolute bottom-0 -inset-x-24 h-40 sm:h-48 pointer-events-none opacity-50"
        style={{
          background: 'radial-gradient(ellipse at 65% 80%, rgba(245, 158, 11, 0.10) 0%, rgba(15, 23, 42, 0.45) 45%, transparent 75%)',
          filter: 'blur(35px)',
        }}
      />

      {/* 6. Floating Atmospheric Stadium Light Dust Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map((p) => (
          <div
            key={p.id}
            className="anim-particle absolute rounded-full bg-amber-300"
            style={
              {
                left: p.left,
                top: p.top,
                width: `${p.size}px`,
                height: `${p.size}px`,
                boxShadow: `0 0 ${p.size * 3}px rgba(255, 215, 0, 0.85)`,
                '--del': p.delay,
                '--dur': p.dur,
                '--tx': p.tx,
              } as React.CSSProperties
            }
          />
        ))}
      </div>

      {/* 7. Subtle Ambient Vignette & Contrast Preserver */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 50% 50%, transparent 45%, rgba(5, 7, 10, 0.7) 100%)',
        }}
      />
    </div>
  );
};
