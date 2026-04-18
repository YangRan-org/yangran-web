const { useState, useEffect } = React;

const COLORS = {
  bg: "#0a0a12",
  mainLoop: "#e8963e",
  mainLoopGlow: "rgba(232, 150, 62, 0.3)",
  satellite: "#6ba3c7",
  satelliteGlow: "rgba(107, 163, 199, 0.25)",
  bridge1: "#c75a6d",
  bridge2: "#9b6dc7",
  bridge3: "#c7a86d",
  flowIn: "rgba(232, 150, 62, 0.6)",
  text: "#e8e0d4",
  textDim: "#8a8278",
  accent: "#f0d48a",
};

const PLANETS = {
  Venus: { symbol: "\u2640", label: "\u91d1\u661f", houses: "4\u5bab+11\u5bab\u4e3b", color: "#e8963e", strength: "35%" },
  Mars: { symbol: "\u2642", label: "\u706b\u661f", houses: "5\u5bab+10\u5bab\u4e3b", color: "#d4513a", strength: "75%", tag: "Yogakaraka" },
  Sun: { symbol: "\u2609", label: "\u592a\u9633", houses: "2\u5bab\u4e3b", color: "#f0d48a", strength: "60%", tag: "Neechabhanga" },
  Moon: { symbol: "\u263d", label: "\u6708\u4eae", houses: "1\u5bab\u4e3b", color: "#c7d4e8", strength: "35%" },
  Jupiter: { symbol: "\u2643", label: "\u6728\u661f", houses: "6\u5bab+9\u5bab\u4e3b", color: "#e8c86d", strength: "50%" },
  Rahu: { symbol: "\u260a", label: "\u7f57\u7740", houses: "\u57281\u5bab", color: "#7a8a9a", strength: "35%" },
  Mercury: { symbol: "\u263f", label: "\u6c34\u661f", houses: "3\u5bab+12\u5bab\u4e3b", color: "#6ba3c7", strength: "55%", tag: "\u9ad8\u53477\u5206" },
  Saturn: { symbol: "\u2644", label: "\u571f\u661f", houses: "7\u5bab+8\u5bab\u4e3b", color: "#8a9aaa", strength: "55%", tag: "\u6865\u6881" },
  Ketu: { symbol: "\u260b", label: "\u8ba1\u90fd", houses: "\u57287\u5bab", color: "#9a8a7a", strength: "45%" },
};

function PlanetNode({ x, y, planet, info, isActive, onClick, size = 44 }) {
  const [hover, setHover] = useState(false);
  const glowColor = info.color + "60";

  return (
    <g
      onClick={() => onClick(planet)}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{ cursor: "pointer" }}
    >
      <circle cx={x} cy={y} r={size + 12} fill={glowColor} opacity={isActive || hover ? 0.5 : 0.15}>
        {isActive && <animate attributeName="r" values={`${size+10};${size+18};${size+10}`} dur="2s" repeatCount="indefinite" />}
      </circle>
      <circle cx={x} cy={y} r={size} fill={COLORS.bg} stroke={info.color} strokeWidth={isActive ? 2.5 : 1.5} opacity={isActive ? 1 : 0.85} />
      <text x={x} y={y - 6} textAnchor="middle" fill={info.color} fontSize="22" fontFamily="serif">{info.symbol}</text>
      <text x={x} y={y + 14} textAnchor="middle" fill={COLORS.text} fontSize="10" fontFamily="'Noto Sans SC', sans-serif">{info.label}</text>
      {info.tag && (
        <g>
          <rect x={x - 28} y={y + size + 2} width="56" height="16" rx="8" fill={info.color} opacity="0.2" />
          <text x={x} y={y + size + 13} textAnchor="middle" fill={info.color} fontSize="7.5" fontFamily="'Noto Sans SC', sans-serif">{info.tag}</text>
        </g>
      )}
    </g>
  );
}

function AnimatedArrow({ x1, y1, x2, y2, color, dashArray = "none", opacity = 0.6, delay = 0 }) {
  return (
    <g>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth="1.5" opacity={opacity} strokeDasharray={dashArray} />
      <circle r="3" fill={color} opacity="0.9">
        <animateMotion dur="3s" repeatCount="indefinite" begin={`${delay}s`}>
          <mpath href={`#path-${x1}-${y1}-${x2}-${y2}`} />
        </animateMotion>
      </circle>
      <path id={`path-${x1}-${y1}-${x2}-${y2}`} d={`M${x1},${y1} L${x2},${y2}`} fill="none" stroke="none" />
    </g>
  );
}

function CurvedArrow({ sx, sy, ex, ey, cx, cy, color, id, dashArray = "none", opacity = 0.6, dur = "3s", delay = 0 }) {
  const pathD = `M${sx},${sy} Q${cx},${cy} ${ex},${ey}`;
  return (
    <g>
      <path d={pathD} fill="none" stroke={color} strokeWidth="1.5" opacity={opacity} strokeDasharray={dashArray} />
      <circle r="3" fill={color} opacity="0.9">
        <animateMotion dur={dur} repeatCount="indefinite" begin={`${delay}s`}>
          <mpath href={`#curve-${id}`} />
        </animateMotion>
      </circle>
      <path id={`curve-${id}`} d={pathD} fill="none" stroke="none" />
    </g>
  );
}

function PlanetarySystem() {
  const [activePlanet, setActivePlanet] = useState(null);
  const [activeView, setActiveView] = useState("full");
  const [animStep, setAnimStep] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setAnimStep(s => (s + 1) % 120), 100);
    return () => clearInterval(timer);
  }, []);

  const venusPos = { x: 400, y: 140 };
  const marsPos = { x: 540, y: 310 };
  const sunPos = { x: 260, y: 310 };
  const moonPos = { x: 620, y: 160 };
  const jupiterPos = { x: 160, y: 160 };
  const rahuPos = { x: 680, y: 310 };
  const mercuryPos = { x: 260, y: 520 };
  const saturnPos = { x: 400, y: 520 };
  const ketuPos = { x: 540, y: 520 };

  const handlePlanetClick = (p) => {
    setActivePlanet(activePlanet === p ? null : p);
  };

  const getChainInfo = (planet) => {
    const chains = {
      Venus: "Venus \u2192 \u706b\u661f\u7684\u661f\u5ea7(\u5929\u880e) \u2192 Mars \u2192 \u592a\u9633\u7684\u661f\u5ea7(\u72ee\u5b50) \u2192 Sun \u2192 \u91d1\u661f\u7684\u661f\u5ea7(\u5929\u79e4) \u2192 Venus \u221e",
      Mars: "Mars \u2192 \u592a\u9633\u7684\u661f\u5ea7(\u72ee\u5b50) \u2192 Sun \u2192 \u91d1\u661f\u7684\u661f\u5ea7(\u5929\u79e4) \u2192 Venus \u2192 \u706b\u661f\u7684\u661f\u5ea7(\u5929\u880e) \u2192 Mars \u221e",
      Sun: "Sun \u2192 \u91d1\u661f\u7684\u661f\u5ea7(\u5929\u79e4) \u2192 Venus \u2192 \u706b\u661f\u7684\u661f\u5ea7(\u5929\u880e) \u2192 Mars \u2192 \u592a\u9633\u7684\u661f\u5ea7(\u72ee\u5b50) \u2192 Sun \u221e",
      Moon: "Moon \u2192 \u706b\u661f(\u5929\u880e\u5ea7\u4e3b) \u2192 \u8fdb\u5165\u4e3b\u5faa\u73af \u221e",
      Jupiter: "Jupiter \u2192 \u91d1\u661f(\u5929\u79e4\u5ea7\u4e3b) \u2192 \u8fdb\u5165\u4e3b\u5faa\u73af \u221e",
      Rahu: "Rahu \u2192 \u6708\u4eae(\u5de8\u87f9\u5ea7\u4e3b) \u2192 \u706b\u661f(\u5929\u880e\u5ea7\u4e3b) \u2192 \u8fdb\u5165\u4e3b\u5faa\u73af \u221e",
      Mercury: "Mercury \u2192 \u81ea\u5df1(\u5904\u5973\u5ea7=\u81ea\u5bab) \u2299 \u72ec\u7acb\u7aef\u70b9",
      Saturn: "Saturn \u2192 \u6c34\u661f(\u5904\u5973\u5ea7\u4e3b) \u2192 \u6c34\u661f\u7aef\u70b9 \u2299",
      Ketu: "Ketu \u2192 \u571f\u661f(\u6469\u7faf\u5ea7\u4e3b) \u2192 \u6c34\u661f \u2192 \u6c34\u661f\u7aef\u70b9 \u2299",
    };
    return chains[planet] || "";
  };

  const getBridgeInfo = (planet) => {
    const bridges = {
      Saturn: "\u7b2c\u4e00\u5ea7\u6865\uff1a\u4e0eMercury\u7269\u7406\u5408\u76f8\u4e8e\u7b2c3\u5bab\u5904\u5973\u5ea7\n= \u5979\u7684\u4e08\u592b = \u4e24\u4e2a\u7cfb\u7edf\u4e4b\u95f4\u7684\u8fde\u63a5\u8005",
      Mercury: "\u7b2c\u4e8c\u5ea7\u6865\uff1aNakshatra Lord\u662fMars(Chitra\u2192Mars)\n\u6c34\u661f\u7684\u5168\u90e8\u80fd\u529b\u6301\u7eed\u5411\u4e3b\u5faa\u73af\u8f93\u9001",
    };
    return bridges[planet] || "";
  };

  return (
    <div style={{
      background: COLORS.bg,
      minHeight: "100vh",
      fontFamily: "'Noto Sans SC', 'Georgia', serif",
      color: COLORS.text,
      padding: "20px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    }}>
      <div style={{ textAlign: "center", marginBottom: "8px" }}>
        <h1 style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: "28px",
          fontWeight: 300,
          color: COLORS.accent,
          letterSpacing: "4px",
          margin: "0 0 4px 0",
        }}>
          {"\u0950 \u661f\u76d8\u7cfb\u7edf\u67b6\u6784"}
        </h1>
        <p style={{ color: COLORS.textDim, fontSize: "12px", margin: 0, letterSpacing: "2px" }}>
          {"\u4e5d\u9897\u884c\u661f \u00b7 \u4e24\u4e2a\u7cfb\u7edf \u00b7 \u4e09\u5ea7\u6865 \u00b7 \u96f6\u5b64\u7acb"}
        </p>
      </div>

      <div style={{ display: "flex", gap: "8px", marginBottom: "12px", flexWrap: "wrap", justifyContent: "center" }}>
        {[
          { key: "full", label: "\u5168\u8c8c" },
          { key: "loop", label: "\u4e3b\u5faa\u73af" },
          { key: "bridges", label: "\u4e09\u5ea7\u6865" },
          { key: "dashas", label: "\u5927\u8fd0\u65f6\u95f4\u7ebf" },
        ].map(v => (
          <button
            key={v.key}
            onClick={() => { setActiveView(v.key); setActivePlanet(null); }}
            style={{
              background: activeView === v.key ? COLORS.mainLoop + "30" : "transparent",
              border: `1px solid ${activeView === v.key ? COLORS.mainLoop : COLORS.textDim + "40"}`,
              color: activeView === v.key ? COLORS.accent : COLORS.textDim,
              padding: "6px 16px",
              borderRadius: "20px",
              fontSize: "12px",
              cursor: "pointer",
              transition: "all 0.3s",
              fontFamily: "'Noto Sans SC', sans-serif",
            }}
          >
            {v.label}
          </button>
        ))}
      </div>

      <svg viewBox="0 0 840 640" style={{ width: "100%", maxWidth: "840px" }}>
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="softGlow">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <linearGradient id="bridgeGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={COLORS.bridge1} />
            <stop offset="100%" stopColor={COLORS.mainLoop} />
          </linearGradient>
          <linearGradient id="bridgeGrad2" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={COLORS.bridge2} />
            <stop offset="100%" stopColor={COLORS.satellite} />
          </linearGradient>
        </defs>

        <text x="400" y="74" textAnchor="middle" fill={COLORS.mainLoop} opacity="0.3" fontSize="13" fontFamily="'Cormorant Garamond', serif" letterSpacing="6">
          {"\u25c8 \u4e3b\u5faa\u73af\u7cfb\u7edf \u00b7 MAIN LOOP \u25c8"}
        </text>
        <text x="400" y="480" textAnchor="middle" fill={COLORS.satellite} opacity="0.3" fontSize="13" fontFamily="'Cormorant Garamond', serif" letterSpacing="6">
          {"\u25c8 \u536b\u661f\u7cfb\u7edf \u00b7 SATELLITE \u25c8"}
        </text>

        <polygon
          points={`${venusPos.x},${venusPos.y} ${marsPos.x},${marsPos.y} ${sunPos.x},${sunPos.y}`}
          fill={COLORS.mainLoopGlow}
          opacity="0.08"
          filter="url(#softGlow)"
        />

        <text x="400" y="240" textAnchor="middle" fill={COLORS.accent} opacity="0.5" fontSize="11" fontFamily="'Noto Sans SC', sans-serif">
          {"\u7b2c2\u00b74\u00b75\u00b710\u00b711\u5bab"}
        </text>
        <text x="400" y="256" textAnchor="middle" fill={COLORS.textDim} opacity="0.4" fontSize="9" fontFamily="'Noto Sans SC', sans-serif">
          {"\u8d22\u5bcc\u00b7\u5e78\u798f\u00b7\u667a\u6167\u00b7\u4e8b\u4e1a\u00b7\u6536\u76ca"}
        </text>

        {/* Main loop arrows */}
        <CurvedArrow sx={venusPos.x + 30} sy={venusPos.y + 20} ex={marsPos.x - 15} ey={marsPos.y - 30}
          cx={520} cy={190} color={COLORS.mainLoop} id="v2m" dur="2.5s" opacity={0.7} />
        <CurvedArrow sx={marsPos.x - 20} sy={marsPos.y + 15} ex={sunPos.x + 20} ey={sunPos.y + 15}
          cx={400} cy={380} color={COLORS.mainLoop} id="m2s" dur="2.5s" delay={0.8} opacity={0.7} />
        <CurvedArrow sx={sunPos.x + 15} sy={sunPos.y - 30} ex={venusPos.x - 30} ey={venusPos.y + 20}
          cx={280} cy={190} color={COLORS.mainLoop} id="s2v" dur="2.5s" delay={1.6} opacity={0.7} />

        <text x={490} y={200} fill={COLORS.mainLoop} opacity="0.5" fontSize="8" fontFamily="'Noto Sans SC', sans-serif" transform="rotate(32, 490, 200)">{"\u5728\u706b\u661f\u661f\u5ea7"}</text>
        <text x={390} y={360} fill={COLORS.mainLoop} opacity="0.5" fontSize="8" fontFamily="'Noto Sans SC', sans-serif">{"\u5728\u91d1\u661f\u661f\u5ea7"}</text>
        <text x={280} y={200} fill={COLORS.mainLoop} opacity="0.5" fontSize="8" fontFamily="'Noto Sans SC', sans-serif" transform="rotate(-32, 280, 200)">{"\u5728\u592a\u9633\u661f\u5ea7"}</text>

        {/* Inflow arrows */}
        <AnimatedArrow x1={moonPos.x - 25} y1={moonPos.y + 20} x2={marsPos.x + 20} y2={marsPos.y - 25} color={COLORS.flowIn} delay={0.5} />
        <text x={600} y={225} fill={COLORS.textDim} opacity="0.4" fontSize="7.5" transform="rotate(60, 600, 225)">{"\u6708\u2192\u706b"}</text>

        <AnimatedArrow x1={jupiterPos.x + 25} y1={jupiterPos.y + 15} x2={venusPos.x - 30} y2={venusPos.y + 5} color={COLORS.flowIn} delay={1} />
        <text x={260} y={140} fill={COLORS.textDim} opacity="0.4" fontSize="7.5">{"\u6728\u2192\u91d1"}</text>

        <AnimatedArrow x1={rahuPos.x - 20} y1={rahuPos.y - 20} x2={moonPos.x + 15} y2={moonPos.y + 20} color={COLORS.flowIn} dashArray="4 3" delay={1.5} opacity={0.4} />
        <text x={670} y={250} fill={COLORS.textDim} opacity="0.35" fontSize="7.5">{"\u7f57\u2192\u6708"}</text>

        {/* Satellite system */}
        <AnimatedArrow x1={ketuPos.x - 30} y1={ketuPos.y} x2={saturnPos.x + 30} y2={saturnPos.y} color={COLORS.satellite} delay={0.3} opacity={0.5} />
        <AnimatedArrow x1={saturnPos.x - 30} y1={saturnPos.y} x2={mercuryPos.x + 30} y2={mercuryPos.y} color={COLORS.satellite} delay={0.8} opacity={0.5} />
        <path d={`M${mercuryPos.x - 20},${mercuryPos.y + 30} A 25 25 0 1 0 ${mercuryPos.x + 20},${mercuryPos.y + 30}`}
          fill="none" stroke={COLORS.satellite} strokeWidth="1.5" opacity="0.4" />
        <text x={mercuryPos.x} y={mercuryPos.y + 68} textAnchor="middle" fill={COLORS.satellite} opacity="0.4" fontSize="7.5" fontFamily="'Noto Sans SC', sans-serif">{"\u81ea\u5bab\u00b7\u72ec\u7acb\u7aef\u70b9"}</text>

        {/* Three bridges */}
        {(activeView === "full" || activeView === "bridges") && (
          <g>
            <rect x={298} y={495} width="80" height="16" rx="8" fill={COLORS.bridge1} opacity="0.15" />
            <text x={338} y={506} textAnchor="middle" fill={COLORS.bridge1} opacity="0.7" fontSize="7.5" fontFamily="'Noto Sans SC', sans-serif">
              {"\u7b2c\u4e00\u6865\u00b7\u5408\u76f8"}
            </text>

            <CurvedArrow sx={mercuryPos.x} sy={mercuryPos.y - 40} ex={marsPos.x + 10} ey={marsPos.y + 35}
              cx={320} cy={400} color={COLORS.bridge2} id="bridge2" dashArray="6 4" dur="4s" opacity={0.45} />
            <text x={305} y={430} fill={COLORS.bridge2} opacity="0.5" fontSize="7.5" fontFamily="'Noto Sans SC', sans-serif" transform="rotate(-50, 305, 430)">
              {"\u7b2c\u4e8c\u6865\u00b7Chitra\u2192Mars"}
            </text>

            <CurvedArrow sx={saturnPos.x + 10} sy={saturnPos.y - 40} ex={moonPos.x - 10} ey={moonPos.y + 35}
              cx={580} cy={370} color={COLORS.bridge3} id="bridge3" dashArray="6 4" dur="4s" delay={1} opacity={0.45} />
            <text x={560} y={410} fill={COLORS.bridge3} opacity="0.5" fontSize="7.5" fontFamily="'Noto Sans SC', sans-serif" transform="rotate(40, 560, 410)">
              {"\u7b2c\u4e09\u6865\u00b7Hasta\u2192Moon"}
            </text>
          </g>
        )}

        {/* Planet nodes */}
        <PlanetNode x={venusPos.x} y={venusPos.y} planet="Venus" info={PLANETS.Venus}
          isActive={activePlanet === "Venus"} onClick={handlePlanetClick} size={46} />
        <PlanetNode x={marsPos.x} y={marsPos.y} planet="Mars" info={PLANETS.Mars}
          isActive={activePlanet === "Mars"} onClick={handlePlanetClick} size={46} />
        <PlanetNode x={sunPos.x} y={sunPos.y} planet="Sun" info={PLANETS.Sun}
          isActive={activePlanet === "Sun"} onClick={handlePlanetClick} size={46} />

        <PlanetNode x={moonPos.x} y={moonPos.y} planet="Moon" info={PLANETS.Moon}
          isActive={activePlanet === "Moon"} onClick={handlePlanetClick} size={36} />
        <PlanetNode x={jupiterPos.x} y={jupiterPos.y} planet="Jupiter" info={PLANETS.Jupiter}
          isActive={activePlanet === "Jupiter"} onClick={handlePlanetClick} size={36} />
        <PlanetNode x={rahuPos.x} y={rahuPos.y} planet="Rahu" info={PLANETS.Rahu}
          isActive={activePlanet === "Rahu"} onClick={handlePlanetClick} size={36} />

        <PlanetNode x={mercuryPos.x} y={mercuryPos.y} planet="Mercury" info={PLANETS.Mercury}
          isActive={activePlanet === "Mercury"} onClick={handlePlanetClick} size={40} />
        <PlanetNode x={saturnPos.x} y={saturnPos.y} planet="Saturn" info={PLANETS.Saturn}
          isActive={activePlanet === "Saturn"} onClick={handlePlanetClick} size={40} />
        <PlanetNode x={ketuPos.x} y={ketuPos.y} planet="Ketu" info={PLANETS.Ketu}
          isActive={activePlanet === "Ketu"} onClick={handlePlanetClick} size={36} />

        {activeView === "bridges" && (
          <g>
            <text x={saturnPos.x} y={saturnPos.y + 70} textAnchor="middle" fill={COLORS.bridge1} fontSize="9" fontFamily="'Noto Sans SC', sans-serif" opacity="0.8">
              {"\u2644 = \u7b2c7\u5bab\u4e3b = \u4e08\u592b"}
            </text>
            <text x={saturnPos.x} y={saturnPos.y + 84} textAnchor="middle" fill={COLORS.bridge1} fontSize="8.5" fontFamily="'Noto Sans SC', sans-serif" opacity="0.6">
              {"\u4e24\u4e2a\u7cfb\u7edf\u4e4b\u95f4\u7684\u6865\u6881\u672c\u8eab"}
            </text>
          </g>
        )}
      </svg>

      {/* Info panel */}
      <div style={{
        width: "100%",
        maxWidth: "800px",
        minHeight: "80px",
        background: "rgba(255,255,255,0.03)",
        borderRadius: "12px",
        border: "1px solid rgba(255,255,255,0.06)",
        padding: "16px 20px",
        marginTop: "4px",
      }}>
        {activePlanet ? (
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px", flexWrap: "wrap" }}>
              <span style={{ fontSize: "24px", color: PLANETS[activePlanet].color }}>{PLANETS[activePlanet].symbol}</span>
              <span style={{ fontSize: "16px", color: PLANETS[activePlanet].color, fontFamily: "'Cormorant Garamond', serif" }}>
                {PLANETS[activePlanet].label} · {activePlanet}
              </span>
              <span style={{ fontSize: "11px", color: COLORS.textDim }}>
                {PLANETS[activePlanet].houses} · 强度 {PLANETS[activePlanet].strength}
              </span>
            </div>
            <div style={{ fontSize: "12px", color: COLORS.accent, marginBottom: "4px", fontFamily: "monospace", letterSpacing: "0.5px" }}>
              {getChainInfo(activePlanet)}
            </div>
            {getBridgeInfo(activePlanet) && (
              <div style={{ fontSize: "11px", color: COLORS.bridge1, marginTop: "6px", whiteSpace: "pre-line", lineHeight: "1.6" }}>
                {getBridgeInfo(activePlanet)}
              </div>
            )}
          </div>
        ) : activeView === "dashas" ? (
          <div>
            <div style={{ fontSize: "13px", color: COLORS.accent, marginBottom: "10px" }}>{"\u5927\u8fd0\u65f6\u95f4\u7ebf \u00b7 \u7cfb\u7edf\u6fc0\u6d3b\u5ea6"}</div>
            {[
              { period: "\u571f\u661f\u5927\u8fd0 (\u5e7c\u5e74-\u7ea62001)", system: "\u536b\u661f", desc: "Saturn\u2192Mercury \u7aef\u70b9\u8fd0\u884c \u00b7 \u5b66\u4e1a\u65e0\u5fe7", bar: 20, color: COLORS.satellite },
              { period: "\u6c34\u661f\u5927\u8fd0 (\u7ea62001-2018)", system: "\u536b\u661f", desc: "\u72ec\u7acb\u7aef\u70b9\u81ea\u8f6c \u00b7 PhD+\u6559\u804c \u00b7 \u65e0\u804a\u4f4e\u6536\u5165 \u00b7 \u9047\u5230\u4e08\u592b(\u6865\u6881\u5b89\u88c5)", bar: 25, color: COLORS.satellite },
              { period: "\u8ba1\u90fd\u5927\u8fd0 (\u7ea62018-2025)", system: "\u8de8\u7cfb\u7edf", desc: "Nakshatra\u6865\u9996\u6b21\u8054\u901a \u00b7 \u540d\u724c\u5927\u5b66PI \u00b7 \u7206\u53d1 \u00b7 \u539f\u751f\u5bb6\u5ead\u65ad\u94fe", bar: 55, color: COLORS.bridge2 },
              { period: "\u91d1\u661f\u5927\u8fd0 (2025-2045)", system: "\u4e3b\u5faa\u73af", desc: "\u4e09\u661f\u5faa\u73af\u94fe\u901a\u7535 \u00b7 \u4e5d\u9897\u884c\u661f\u5168\u5728\u7ebf \u00b7 \u521b\u4e1a\u8f6c\u5316 \u00b7 \u221e", bar: 95, color: COLORS.mainLoop },
            ].map((d, i) => (
              <div key={i} style={{ marginBottom: "8px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", marginBottom: "3px" }}>
                  <span style={{ color: d.color }}>{d.period}</span>
                  <span style={{ color: COLORS.textDim, fontSize: "10px" }}>{d.system}</span>
                </div>
                <div style={{ background: "rgba(255,255,255,0.05)", borderRadius: "4px", height: "6px", overflow: "hidden" }}>
                  <div style={{ width: `${d.bar}%`, height: "100%", background: d.color, borderRadius: "4px", opacity: 0.7, transition: "width 1s" }} />
                </div>
                <div style={{ fontSize: "10px", color: COLORS.textDim, marginTop: "2px" }}>{d.desc}</div>
              </div>
            ))}
          </div>
        ) : activeView === "bridges" ? (
          <div style={{ fontSize: "12px", lineHeight: "1.8" }}>
            <div style={{ color: COLORS.accent, marginBottom: "6px" }}>{"\u4e09\u5ea7\u6865 \u00b7 \u5197\u4f59\u8bbe\u8ba1 \u00b7 \u533b\u7597\u5668\u68b0\u7ea7\u522b"}</div>
            <div><span style={{ color: COLORS.bridge1 }}>{"\u7b2c\u4e00\u6865 \u00b7"}</span> <span style={{ color: COLORS.textDim }}>{"Saturn-Mercury \u7269\u7406\u5408\u76f8\u4e8e\u7b2c3\u5bab \u00b7 Saturn=\u7b2c7\u5bab\u4e3b=\u4e08\u592b \u00b7 \u4e24\u4e2a\u7cfb\u7edf\u7684\u7269\u7406\u8fde\u63a5"}</span></div>
            <div><span style={{ color: COLORS.bridge2 }}>{"\u7b2c\u4e8c\u6865 \u00b7"}</span> <span style={{ color: COLORS.textDim }}>{"Mercury Nakshatra(Chitra)\u2192Mars \u00b7 \u6c34\u661f\u80fd\u529b\u6301\u7eed\u8f93\u9001\u81f3\u4e3b\u5faa\u73af\u5f15\u64ce"}</span></div>
            <div><span style={{ color: COLORS.bridge3 }}>{"\u7b2c\u4e09\u6865 \u00b7"}</span> <span style={{ color: COLORS.textDim }}>{"Saturn Nakshatra(Hasta)\u2192Moon \u00b7 \u571f\u661f\u7eaa\u5f8b\u6301\u7eed\u8f93\u9001\u81f3\u547d\u4e3b\u661f"}</span></div>
            <div style={{ marginTop: "6px", color: COLORS.textDim, fontSize: "10px" }}>{"\u4efb\u4f55\u4e00\u5ea7\u6865\u65ad\u4e86\uff0c\u53e6\u5916\u4e24\u5ea7\u8fd8\u5728\u3002\u5173\u952e\u8fde\u63a5\u6709\u5907\u4efd\u3002"}</div>
          </div>
        ) : activeView === "loop" ? (
          <div style={{ fontSize: "12px", lineHeight: "1.8" }}>
            <div style={{ color: COLORS.accent, marginBottom: "6px" }}>{"\u4e09\u661f\u95ed\u5408\u5faa\u73af\u94fe \u00b7 Venus\u2192Mars\u2192Sun\u2192Venus \u221e"}</div>
            <div style={{ color: COLORS.textDim }}>{"\u91d1\u661f\u5728\u706b\u661f\u7684\u661f\u5ea7(\u5929\u880e) \u00b7 \u706b\u661f\u5728\u592a\u9633\u7684\u661f\u5ea7(\u72ee\u5b50) \u00b7 \u592a\u9633\u5728\u91d1\u661f\u7684\u661f\u5ea7(\u5929\u79e4)"}</div>
            <div style={{ color: COLORS.textDim, marginTop: "4px" }}>{"\u7ed1\u5b9a\u4e94\u4e2a\u5bab\u4f4d\uff1a\u7b2c2\u5bab(\u8d22\u5bcc) + \u7b2c4\u5bab(\u5e78\u798f) + \u7b2c5\u5bab(\u667a\u6167) + \u7b2c10\u5bab(\u4e8b\u4e1a) + \u7b2c11\u5bab(\u6536\u76ca)"}</div>
            <div style={{ color: COLORS.textDim, marginTop: "4px" }}>{"\u6c47\u5165\u884c\u661f\uff1aMoon(\u547d\u4e3b\u661f) \u00b7 Jupiter(\u798f\u62a5) \u00b7 Rahu(\u91ce\u5fc3) \u2192 \u516d\u9897\u884c\u661f\u540c\u65f6\u8fd0\u8f6c"}</div>
          </div>
        ) : (
          <div style={{ fontSize: "12px", color: COLORS.textDim, lineHeight: "1.8" }}>
            <span style={{ color: COLORS.accent }}>{"\u70b9\u51fb\u4efb\u610f\u884c\u661f"}</span> {"\u67e5\u770b\u5176Dispositor\u94fe\u6761 \u00b7 \u5207\u6362\u4e0a\u65b9\u89c6\u56fe\u67e5\u770b\u4e0d\u540c\u5c42\u9762"}
            <div style={{ marginTop: "6px", fontSize: "11px", opacity: 0.6 }}>
              {"\u201c\u6b64\u76d8\u7684\u529b\u91cf\u4e0d\u5728\u4e8e\u96f6\u4ef6\u6700\u597d \u00b7 \u5728\u4e8e\u5e03\u7ebf\u6700\u5b8c\u7f8e\u201d \u2014\u2014 \u7cfb\u7edf\u8bbe\u8ba1\u5385 \u00b7 \u9547\u9986\u4e4b\u5b9d"}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('app-root')).render(<PlanetarySystem />);
