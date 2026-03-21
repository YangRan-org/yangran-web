import { useState, useEffect } from "react";

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
  Venus: { symbol: "♀", label: "金星", houses: "4宫+11宫主", color: "#e8963e", strength: "35%" },
  Mars: { symbol: "♂", label: "火星", houses: "5宫+10宫主", color: "#d4513a", strength: "75%", tag: "Yogakaraka" },
  Sun: { symbol: "☉", label: "太阳", houses: "2宫主", color: "#f0d48a", strength: "60%", tag: "Neechabhanga" },
  Moon: { symbol: "☽", label: "月亮", houses: "1宫主", color: "#c7d4e8", strength: "35%" },
  Jupiter: { symbol: "♃", label: "木星", houses: "6宫+9宫主", color: "#e8c86d", strength: "50%" },
  Rahu: { symbol: "☊", label: "罗睺", houses: "在1宫", color: "#7a8a9a", strength: "35%" },
  Mercury: { symbol: "☿", label: "水星", houses: "3宫+12宫主", color: "#6ba3c7", strength: "55%", tag: "高升7分" },
  Saturn: { symbol: "♄", label: "土星", houses: "7宫+8宫主", color: "#8a9aaa", strength: "55%", tag: "桥梁" },
  Ketu: { symbol: "☋", label: "计都", houses: "在7宫", color: "#9a8a7a", strength: "45%" },
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
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.sqrt(dx * dx + dy * dy);
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  
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

export default function PlanetarySystem() {
  const [activePlanet, setActivePlanet] = useState(null);
  const [activeView, setActiveView] = useState("full");
  const [animStep, setAnimStep] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setAnimStep(s => (s + 1) % 120), 100);
    return () => clearInterval(timer);
  }, []);

  // Main loop positions (triangle)
  const venusPos = { x: 400, y: 140 };
  const marsPos = { x: 540, y: 310 };
  const sunPos = { x: 260, y: 310 };

  // Inflow planets
  const moonPos = { x: 620, y: 160 };
  const jupiterPos = { x: 160, y: 160 };
  const rahuPos = { x: 680, y: 310 };

  // Satellite system
  const mercuryPos = { x: 260, y: 520 };
  const saturnPos = { x: 400, y: 520 };
  const ketuPos = { x: 540, y: 520 };

  const handlePlanetClick = (p) => {
    setActivePlanet(activePlanet === p ? null : p);
  };

  const getChainInfo = (planet) => {
    const chains = {
      Venus: "Venus → 火星的星座(天蝎) → Mars → 太阳的星座(狮子) → Sun → 金星的星座(天秤) → Venus ∞",
      Mars: "Mars → 太阳的星座(狮子) → Sun → 金星的星座(天秤) → Venus → 火星的星座(天蝎) → Mars ∞",
      Sun: "Sun → 金星的星座(天秤) → Venus → 火星的星座(天蝎) → Mars → 太阳的星座(狮子) → Sun ∞",
      Moon: "Moon → 火星(天蝎座主) → 进入主循环 ∞",
      Jupiter: "Jupiter → 金星(天秤座主) → 进入主循环 ∞",
      Rahu: "Rahu → 月亮(巨蟹座主) → 火星(天蝎座主) → 进入主循环 ∞",
      Mercury: "Mercury → 自己(处女座=自宫) ⊙ 独立端点",
      Saturn: "Saturn → 水星(处女座主) → 水星端点 ⊙",
      Ketu: "Ketu → 土星(摩羯座主) → 水星 → 水星端点 ⊙",
    };
    return chains[planet] || "";
  };

  const getBridgeInfo = (planet) => {
    const bridges = {
      Saturn: "第一座桥：与Mercury物理合相于第3宫处女座\n= 她的丈夫 = 两个系统之间的连接者",
      Mercury: "第二座桥：Nakshatra Lord是Mars(Chitra→Mars)\n水星的全部能力持续向主循环输送",
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
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@300;400;500;700&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300&display=swap');
      `}</style>

      <div style={{ textAlign: "center", marginBottom: "8px" }}>
        <h1 style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: "28px",
          fontWeight: 300,
          color: COLORS.accent,
          letterSpacing: "4px",
          margin: "0 0 4px 0",
        }}>
          ॐ 星盘系统架构
        </h1>
        <p style={{ color: COLORS.textDim, fontSize: "12px", margin: 0, letterSpacing: "2px" }}>
          九颗行星 · 两个系统 · 三座桥 · 零孤立
        </p>
      </div>

      {/* View toggles */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "12px" }}>
        {[
          { key: "full", label: "全貌" },
          { key: "loop", label: "主循环" },
          { key: "bridges", label: "三座桥" },
          { key: "dashas", label: "大运时间线" },
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

        {/* Background labels */}
        <text x="400" y="74" textAnchor="middle" fill={COLORS.mainLoop} opacity="0.3" fontSize="13" fontFamily="'Cormorant Garamond', serif" letterSpacing="6">
          ◈ 主循环系统 · MAIN LOOP ◈
        </text>
        <text x="400" y="480" textAnchor="middle" fill={COLORS.satellite} opacity="0.3" fontSize="13" fontFamily="'Cormorant Garamond', serif" letterSpacing="6">
          ◈ 卫星系统 · SATELLITE ◈
        </text>

        {/* Main loop triangle - glowing background */}
        <polygon
          points={`${venusPos.x},${venusPos.y} ${marsPos.x},${marsPos.y} ${sunPos.x},${sunPos.y}`}
          fill={COLORS.mainLoopGlow}
          opacity="0.08"
          filter="url(#softGlow)"
        />

        {/* Covered houses in center of triangle */}
        <text x="400" y="240" textAnchor="middle" fill={COLORS.accent} opacity="0.5" fontSize="11" fontFamily="'Noto Sans SC', sans-serif">
          第2·4·5·10·11宫
        </text>
        <text x="400" y="256" textAnchor="middle" fill={COLORS.textDim} opacity="0.4" fontSize="9" fontFamily="'Noto Sans SC', sans-serif">
          财富·幸福·智慧·事业·收益
        </text>

        {/* === MAIN LOOP ARROWS === */}
        <CurvedArrow sx={venusPos.x + 30} sy={venusPos.y + 20} ex={marsPos.x - 15} ey={marsPos.y - 30}
          cx={520} cy={190} color={COLORS.mainLoop} id="v2m" dur="2.5s" opacity={0.7} />
        <CurvedArrow sx={marsPos.x - 20} sy={marsPos.y + 15} ex={sunPos.x + 20} ey={sunPos.y + 15}
          cx={400} cy={380} color={COLORS.mainLoop} id="m2s" dur="2.5s" delay={0.8} opacity={0.7} />
        <CurvedArrow sx={sunPos.x + 15} sy={sunPos.y - 30} ex={venusPos.x - 30} ey={venusPos.y + 20}
          cx={280} cy={190} color={COLORS.mainLoop} id="s2v" dur="2.5s" delay={1.6} opacity={0.7} />

        {/* Loop direction labels */}
        <text x={490} y={200} fill={COLORS.mainLoop} opacity="0.5" fontSize="8" fontFamily="'Noto Sans SC', sans-serif" transform="rotate(32, 490, 200)">在火星星座</text>
        <text x={390} y={360} fill={COLORS.mainLoop} opacity="0.5" fontSize="8" fontFamily="'Noto Sans SC', sans-serif">在金星星座</text>
        <text x={280} y={200} fill={COLORS.mainLoop} opacity="0.5" fontSize="8" fontFamily="'Noto Sans SC', sans-serif" transform="rotate(-32, 280, 200)">在太阳星座</text>

        {/* === INFLOW ARROWS === */}
        {/* Moon → Mars */}
        <AnimatedArrow x1={moonPos.x - 25} y1={moonPos.y + 20} x2={marsPos.x + 20} y2={marsPos.y - 25} color={COLORS.flowIn} delay={0.5} />
        <text x={600} y={225} fill={COLORS.textDim} opacity="0.4" fontSize="7.5" transform="rotate(60, 600, 225)">月→火</text>

        {/* Jupiter → Venus */}
        <AnimatedArrow x1={jupiterPos.x + 25} y1={jupiterPos.y + 15} x2={venusPos.x - 30} y2={venusPos.y + 5} color={COLORS.flowIn} delay={1} />
        <text x={260} y={140} fill={COLORS.textDim} opacity="0.4" fontSize="7.5">木→金</text>

        {/* Rahu → Moon */}
        <AnimatedArrow x1={rahuPos.x - 20} y1={rahuPos.y - 20} x2={moonPos.x + 15} y2={moonPos.y + 20} color={COLORS.flowIn} dashArray="4 3" delay={1.5} opacity={0.4} />
        <text x={670} y={250} fill={COLORS.textDim} opacity="0.35" fontSize="7.5">罗→月</text>

        {/* === SATELLITE SYSTEM === */}
        {/* Ketu → Saturn */}
        <AnimatedArrow x1={ketuPos.x - 30} y1={ketuPos.y} x2={saturnPos.x + 30} y2={saturnPos.y} color={COLORS.satellite} delay={0.3} opacity={0.5} />
        {/* Saturn → Mercury */}
        <AnimatedArrow x1={saturnPos.x - 30} y1={saturnPos.y} x2={mercuryPos.x + 30} y2={mercuryPos.y} color={COLORS.satellite} delay={0.8} opacity={0.5} />
        {/* Mercury self-loop */}
        <path d={`M${mercuryPos.x - 20},${mercuryPos.y + 30} A 25 25 0 1 0 ${mercuryPos.x + 20},${mercuryPos.y + 30}`}
          fill="none" stroke={COLORS.satellite} strokeWidth="1.5" opacity="0.4" />
        <text x={mercuryPos.x} y={mercuryPos.y + 68} textAnchor="middle" fill={COLORS.satellite} opacity="0.4" fontSize="7.5" fontFamily="'Noto Sans SC', sans-serif">自宫·独立端点</text>

        {/* === THREE BRIDGES === */}
        {(activeView === "full" || activeView === "bridges") && (
          <g>
            {/* Bridge 1: Saturn-Mercury physical conjunction (already shown as satellite arrow) */}
            {/* Bridge 1 label */}
            <rect x={298} y={495} width="80" height="16" rx="8" fill={COLORS.bridge1} opacity="0.15" />
            <text x={338} y={506} textAnchor="middle" fill={COLORS.bridge1} opacity="0.7" fontSize="7.5" fontFamily="'Noto Sans SC', sans-serif">
              第一桥·合相
            </text>

            {/* Bridge 2: Mercury Nakshatra → Mars */}
            <CurvedArrow sx={mercuryPos.x} sy={mercuryPos.y - 40} ex={marsPos.x + 10} ey={marsPos.y + 35}
              cx={320} cy={400} color={COLORS.bridge2} id="bridge2" dashArray="6 4" dur="4s" opacity={0.45} />
            <text x={305} y={430} fill={COLORS.bridge2} opacity="0.5" fontSize="7.5" fontFamily="'Noto Sans SC', sans-serif" transform="rotate(-50, 305, 430)">
              第二桥·Chitra→Mars
            </text>

            {/* Bridge 3: Saturn Nakshatra → Moon */}
            <CurvedArrow sx={saturnPos.x + 10} sy={saturnPos.y - 40} ex={moonPos.x - 10} ey={moonPos.y + 35}
              cx={580} cy={370} color={COLORS.bridge3} id="bridge3" dashArray="6 4" dur="4s" delay={1} opacity={0.45} />
            <text x={560} y={410} fill={COLORS.bridge3} opacity="0.5" fontSize="7.5" fontFamily="'Noto Sans SC', sans-serif" transform="rotate(40, 560, 410)">
              第三桥·Hasta→Moon
            </text>
          </g>
        )}

        {/* === PLANET NODES === */}
        {/* Main loop */}
        <PlanetNode x={venusPos.x} y={venusPos.y} planet="Venus" info={PLANETS.Venus}
          isActive={activePlanet === "Venus"} onClick={handlePlanetClick} size={46} />
        <PlanetNode x={marsPos.x} y={marsPos.y} planet="Mars" info={PLANETS.Mars}
          isActive={activePlanet === "Mars"} onClick={handlePlanetClick} size={46} />
        <PlanetNode x={sunPos.x} y={sunPos.y} planet="Sun" info={PLANETS.Sun}
          isActive={activePlanet === "Sun"} onClick={handlePlanetClick} size={46} />

        {/* Inflow */}
        <PlanetNode x={moonPos.x} y={moonPos.y} planet="Moon" info={PLANETS.Moon}
          isActive={activePlanet === "Moon"} onClick={handlePlanetClick} size={36} />
        <PlanetNode x={jupiterPos.x} y={jupiterPos.y} planet="Jupiter" info={PLANETS.Jupiter}
          isActive={activePlanet === "Jupiter"} onClick={handlePlanetClick} size={36} />
        <PlanetNode x={rahuPos.x} y={rahuPos.y} planet="Rahu" info={PLANETS.Rahu}
          isActive={activePlanet === "Rahu"} onClick={handlePlanetClick} size={36} />

        {/* Satellite */}
        <PlanetNode x={mercuryPos.x} y={mercuryPos.y} planet="Mercury" info={PLANETS.Mercury}
          isActive={activePlanet === "Mercury"} onClick={handlePlanetClick} size={40} />
        <PlanetNode x={saturnPos.x} y={saturnPos.y} planet="Saturn" info={PLANETS.Saturn}
          isActive={activePlanet === "Saturn"} onClick={handlePlanetClick} size={40} />
        <PlanetNode x={ketuPos.x} y={ketuPos.y} planet="Ketu" info={PLANETS.Ketu}
          isActive={activePlanet === "Ketu"} onClick={handlePlanetClick} size={36} />

        {/* Saturn bridge annotation */}
        {activeView === "bridges" && (
          <g>
            <text x={saturnPos.x} y={saturnPos.y + 70} textAnchor="middle" fill={COLORS.bridge1} fontSize="9" fontFamily="'Noto Sans SC', sans-serif" opacity="0.8">
              ♄ = 第7宫主 = 丈夫
            </text>
            <text x={saturnPos.x} y={saturnPos.y + 84} textAnchor="middle" fill={COLORS.bridge1} fontSize="8.5" fontFamily="'Noto Sans SC', sans-serif" opacity="0.6">
              两个系统之间的桥梁本身
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
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
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
            <div style={{ fontSize: "13px", color: COLORS.accent, marginBottom: "10px" }}>大运时间线 · 系统激活度</div>
            {[
              { period: "土星大运 (幼年-约2001)", system: "卫星", desc: "Saturn→Mercury 端点运行 · 学业无忧", bar: 20, color: COLORS.satellite },
              { period: "水星大运 (约2001-2018)", system: "卫星", desc: "独立端点自转 · PhD+教职 · 无聊低收入 · 遇到丈夫(桥梁安装)", bar: 25, color: COLORS.satellite },
              { period: "计都大运 (约2018-2025)", system: "跨系统", desc: "Nakshatra桥首次联通 · 名牌大学PI · 爆发 · 原生家庭断链", bar: 55, color: COLORS.bridge2 },
              { period: "金星大运 (2025-2045)", system: "主循环", desc: "三星循环链通电 · 九颗行星全在线 · 创业转化 · ∞", bar: 95, color: COLORS.mainLoop },
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
            <div style={{ color: COLORS.accent, marginBottom: "6px" }}>三座桥 · 冗余设计 · 医疗器械级别</div>
            <div><span style={{ color: COLORS.bridge1 }}>第一桥 ·</span> <span style={{ color: COLORS.textDim }}>Saturn-Mercury 物理合相于第3宫 · Saturn=第7宫主=丈夫 · 两个系统的物理连接</span></div>
            <div><span style={{ color: COLORS.bridge2 }}>第二桥 ·</span> <span style={{ color: COLORS.textDim }}>Mercury Nakshatra(Chitra)→Mars · 水星能力持续输送至主循环引擎</span></div>
            <div><span style={{ color: COLORS.bridge3 }}>第三桥 ·</span> <span style={{ color: COLORS.textDim }}>Saturn Nakshatra(Hasta)→Moon · 土星纪律持续输送至命主星</span></div>
            <div style={{ marginTop: "6px", color: COLORS.textDim, fontSize: "10px" }}>任何一座桥断了，另外两座还在。关键连接有备份。</div>
          </div>
        ) : activeView === "loop" ? (
          <div style={{ fontSize: "12px", lineHeight: "1.8" }}>
            <div style={{ color: COLORS.accent, marginBottom: "6px" }}>三星闭合循环链 · Venus→Mars→Sun→Venus ∞</div>
            <div style={{ color: COLORS.textDim }}>金星在火星的星座(天蝎) · 火星在太阳的星座(狮子) · 太阳在金星的星座(天秤)</div>
            <div style={{ color: COLORS.textDim, marginTop: "4px" }}>绑定五个宫位：第2宫(财富) + 第4宫(幸福) + 第5宫(智慧) + 第10宫(事业) + 第11宫(收益)</div>
            <div style={{ color: COLORS.textDim, marginTop: "4px" }}>汇入行星：Moon(命主星) · Jupiter(福报) · Rahu(野心) → 六颗行星同时运转</div>
          </div>
        ) : (
          <div style={{ fontSize: "12px", color: COLORS.textDim, lineHeight: "1.8" }}>
            <span style={{ color: COLORS.accent }}>点击任意行星</span> 查看其Dispositor链条 · 切换上方视图查看不同层面
            <div style={{ marginTop: "6px", fontSize: "11px", opacity: 0.6 }}>
              "此盘的力量不在于零件最好 · 在于布线最完美" —— 系统设计厅 · 镇馆之宝
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
