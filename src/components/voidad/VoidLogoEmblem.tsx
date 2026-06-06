"use client";

/** Cyber-tech shield emblem — metallic shield, parachute, V keyhole, orbital rings */
export function VoidLogoEmblem() {
  return (
    <g className="void-logo-emblem">
      <defs>
        <linearGradient id="voidMetalLight" x1="36" y1="8" x2="36" y2="64" gradientUnits="userSpaceOnUse">
          <stop stopColor="#eef3f6" />
          <stop offset="0.45" stopColor="#a8b4bc" />
          <stop offset="1" stopColor="#5c6770" />
        </linearGradient>
        <linearGradient id="voidMetalDark" x1="36" y1="10" x2="36" y2="62" gradientUnits="userSpaceOnUse">
          <stop stopColor="#7a8790" />
          <stop offset="0.5" stopColor="#4a5560" />
          <stop offset="1" stopColor="#2a3238" />
        </linearGradient>
        <linearGradient id="voidMetalV" x1="36" y1="22" x2="36" y2="56" gradientUnits="userSpaceOnUse">
          <stop stopColor="#f2f6f8" />
          <stop offset="0.4" stopColor="#b0bcc4" />
          <stop offset="1" stopColor="#6d7880" />
        </linearGradient>
        <linearGradient id="voidNodeMetal" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#c8d2da" />
          <stop offset="1" stopColor="#687480" />
        </linearGradient>
        <radialGradient id="voidEmblemBg" cx="36" cy="36" r="36" gradientUnits="userSpaceOnUse">
          <stop stopColor="#0f2218" />
          <stop offset="1" stopColor="#050a0a" />
        </radialGradient>
        <filter id="voidNeonBloom" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="1.8" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="voidMetalShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="1" stdDeviation="1.2" floodColor="#000" floodOpacity="0.45" />
        </filter>
      </defs>

      {/* Dark panel + circuit wireframe */}
      <circle cx="36" cy="36" r="35" fill="url(#voidEmblemBg)" />
      <g stroke="#00ff99" strokeOpacity="0.12" strokeWidth="0.65" fill="none">
        <path d="M4 14 H18 V20 H10 V32 M62 58 H48 V52 H56 V40" />
        <path d="M8 48 H22 M54 16 H68 M14 8 H20 V22 M52 62 H58 V48" />
        <path d="M20 36 H52 M36 10 V62" strokeOpacity="0.08" />
        <path d="M12 24 L28 36 L12 48 M60 24 L44 36 L60 48" strokeOpacity="0.07" />
      </g>

      {/* Orbital rings */}
      <g filter="url(#voidNeonBloom)" className="void-logo-orbit">
        <ellipse cx="36" cy="36" rx="33" ry="10" stroke="#00ff99" strokeOpacity="0.42" strokeWidth="0.9" transform="rotate(-22 36 36)" />
        <ellipse cx="36" cy="36" rx="31" ry="13" stroke="#00ff99" strokeOpacity="0.28" strokeWidth="0.75" transform="rotate(18 36 36)" />
        <ellipse cx="36" cy="36" rx="34" ry="8" stroke="#00ff99" strokeOpacity="0.22" strokeWidth="0.65" transform="rotate(52 36 36)" />
      </g>

      {/* Tech nodes on orbit */}
      <g filter="url(#voidNeonBloom)">
        <circle cx="8" cy="30" r="2.8" fill="url(#voidNodeMetal)" stroke="#00ff99" strokeWidth="0.6" strokeOpacity="0.7" />
        <circle cx="64" cy="26" r="2.5" fill="url(#voidNodeMetal)" stroke="#00ff99" strokeWidth="0.55" strokeOpacity="0.65" />
        <circle cx="62" cy="50" r="2.2" fill="url(#voidNodeMetal)" stroke="#00ff99" strokeWidth="0.5" strokeOpacity="0.6" />
        <circle cx="10" cy="52" r="1.9" fill="url(#voidNodeMetal)" stroke="#00ff99" strokeWidth="0.45" strokeOpacity="0.55" />
        <circle cx="8" cy="30" r="0.9" fill="#00ff99" fillOpacity="0.85" />
        <circle cx="64" cy="26" r="0.8" fill="#00ff99" fillOpacity="0.8" />
      </g>

      {/* Shield — outer metallic frame */}
      <g filter="url(#voidMetalShadow)">
        <path
          d="M36 7 L58.5 17.2 V38.2 C58.5 52.8 48.8 61.2 36 65.5 C23.2 61.2 13.5 52.8 13.5 38.2 V17.2 L36 7 Z"
          fill="url(#voidMetalDark)"
          stroke="#00ff99"
          strokeWidth="1.1"
          strokeOpacity="0.55"
          filter="url(#voidNeonBloom)"
        />
        <path
          d="M36 11 L54 19.5 V37.8 C54 50.2 45.5 57.2 36 60.8 C26.5 57.2 18 50.2 18 37.8 V19.5 L36 11 Z"
          fill="url(#voidMetalLight)"
          stroke="#8fa0aa"
          strokeWidth="0.6"
          strokeOpacity="0.5"
        />
        <path
          d="M36 14 L50.5 20.8 V36.5 C50.5 46.8 43.8 52.8 36 55.8 C28.2 52.8 21.5 46.8 21.5 36.5 V20.8 L36 14 Z"
          fill="#1a2428"
          fillOpacity="0.35"
        />
      </g>

      {/* Parachute canopy */}
      <g filter="url(#voidMetalShadow)">
        <path
          d="M24 26 C24 16 36 11 36 11 C36 11 48 16 48 26 C48 28 36 29 24 26 Z"
          fill="url(#voidMetalLight)"
          stroke="#9aacb6"
          strokeWidth="0.5"
        />
        <path d="M36 12 V27 M30 14 L36 27 M42 14 L36 27 M26 20 L36 27 M46 20 L36 27" stroke="#6d7880" strokeWidth="0.45" strokeOpacity="0.7" />
        <path d="M24 26 Q36 30 48 26" stroke="#00ff99" strokeWidth="0.55" strokeOpacity="0.45" fill="none" />
      </g>

      {/* V + keyhole — central emblem */}
      <g filter="url(#voidMetalShadow)">
        <path
          d="M25 28.5 L34.5 54.5 Q36 56.5 37.5 54.5 L47 28.5 L42 28.5 L36 47.5 L30 28.5 Z"
          fill="url(#voidMetalV)"
          stroke="#b8c4cc"
          strokeWidth="0.45"
        />
        <path
          d="M29.5 29 L36 44 L42.5 29 L39.8 29 L36 39.2 L32.2 29 Z"
          fill="#253038"
          fillOpacity="0.55"
        />
        <circle cx="36" cy="33.5" r="2.35" fill="#0a0e10" stroke="#3d4850" strokeWidth="0.35" />
        <rect x="35" y="34.2" width="2" height="4.8" rx="0.45" fill="#0a0e10" />
      </g>

      {/* Inner green accent ring */}
      <path
        d="M36 14 L50.5 20.8 V36.5 C50.5 46.8 43.8 52.8 36 55.8 C28.2 52.8 21.5 46.8 21.5 36.5 V20.8 L36 14 Z"
        fill="none"
        stroke="#00ff99"
        strokeWidth="0.65"
        strokeOpacity="0.35"
        filter="url(#voidNeonBloom)"
      />
    </g>
  );
}
