function SpiderHero() {
  return (
    <svg width="70" height="70" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <line x1="85" y1="5" x2="55" y2="35" stroke="#e2e8f0" strokeWidth="1.5" strokeDasharray="2 2" />
      <ellipse cx="50" cy="55" rx="22" ry="28" fill="url(#suitGradient)" />
      <circle cx="50" cy="32" r="18" fill="url(#maskGradient)" />
      <path d="M40 28 Q44 22 50 26 Q46 30 40 28Z" fill="white" />
      <path d="M60 28 Q56 22 50 26 Q54 30 60 28Z" fill="white" />
      <path d="M50 14 L50 50 M32 32 L68 32 M38 18 L62 46 M62 18 L38 46" stroke="#1e293b" strokeWidth="0.7" opacity="0.5" />
      <path d="M30 50 Q15 40 8 20" stroke="url(#suitGradient)" strokeWidth="8" strokeLinecap="round" fill="none" />
      <path d="M70 50 Q80 65 75 85" stroke="url(#suitGradient)" strokeWidth="8" strokeLinecap="round" fill="none" />
      <defs>
        <linearGradient id="suitGradient" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#dc2626" />
          <stop offset="100%" stopColor="#1e3a8a" />
        </linearGradient>
        <radialGradient id="maskGradient">
          <stop offset="0%" stopColor="#ef4444" />
          <stop offset="100%" stopColor="#991b1b" />
        </radialGradient>
      </defs>
    </svg>
  );
}

export default SpiderHero;