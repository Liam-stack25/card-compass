/* Standalone card preview — accepts cardId prop, renders a distinct design per card. */

function Chip({ large }) {
  const w = large ? 36 : 30
  const h = large ? 26 : 22
  const r = large ? 4 : 3
  const p = large ? 4 : 3
  const lines = large ? [6, 12, 18] : [5, 10, 15]
  return (
    <div style={{
      width: w,
      height: h,
      borderRadius: r,
      flexShrink: 0,
      position: 'relative',
      overflow: 'hidden',
      background: 'linear-gradient(140deg, #D9AA40 0%, #B8881C 22%, #EAC95A 42%, #C49020 62%, #D9AA40 82%, #EBC84E 100%)',
      boxShadow: '0 1px 4px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.32), inset 0 -1px 0 rgba(0,0,0,0.18)',
    }}>
      {lines.map((t) => (
        <div key={t} style={{
          position: 'absolute', left: p, right: p, top: t, height: 1,
          background: 'rgba(0,0,0,0.17)',
        }} />
      ))}
      <div style={{
        position: 'absolute', top: p, bottom: p, left: '50%', width: 1,
        background: 'rgba(0,0,0,0.17)',
      }} />
    </div>
  )
}

function CenturionMark({ isDark }) {
  const c = isDark ? 'rgba(30,30,50,0.72)' : 'rgba(255,255,255,0.7)'
  return (
    <svg width="26" height="32" viewBox="0 0 26 32" fill="none" aria-hidden="true">
      <path d="M4 13 Q13 1 22 12" stroke={c} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M7 12 L7 17 Q13 19.5 19 17 L19 12 Q13 8 7 12Z" fill={c} />
      <line x1="7" y1="16" x2="19" y2="16" stroke="rgba(0,0,0,0.18)" strokeWidth="0.8" />
      <ellipse cx="13" cy="23" rx="4.5" ry="5" fill={c} />
      <path d="M3 31 Q7 26 13 28.5 Q19 26 23 31" stroke={c} strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  )
}

function VisaMark({ isDark }) {
  return (
    <div style={{
      fontFamily: '"Helvetica Neue", Arial, sans-serif',
      fontSize: 20,
      fontWeight: 900,
      fontStyle: 'italic',
      letterSpacing: '-0.02em',
      color: isDark ? 'rgba(26,35,90,0.88)' : 'rgba(255,255,255,0.88)',
      lineHeight: 1,
      userSelect: 'none',
    }}>VISA</div>
  )
}

function MastercardMark() {
  return (
    <svg width="44" height="28" viewBox="0 0 44 28" fill="none" aria-hidden="true">
      <circle cx="17" cy="14" r="12" fill="rgba(235,0,27,0.92)" />
      <circle cx="27" cy="14" r="12" fill="rgba(247,158,27,0.9)" />
      <path
        d="M22 3.5 Q26.5 7.8 26.5 14 Q26.5 20.2 22 24.5 Q17.5 20.2 17.5 14 Q17.5 7.8 22 3.5Z"
        fill="rgba(255,95,0,0.88)"
      />
    </svg>
  )
}

function NetworkMark({ network, isDark }) {
  if (network === 'amex')       return <CenturionMark isDark={isDark} />
  if (network === 'visa')       return <VisaMark isDark={isDark} />
  if (network === 'mastercard') return <MastercardMark />
  return null
}

// ── Theme helpers ────────────────────────────────────────────────────────────

const dark = (o) => ({
  light: false,
  dotColor: 'rgba(255,255,255,0.33)',
  issuerColor: 'rgba(255,255,255,0.5)',
  networkIsDark: false,
  ...o,
})

// ── Card themes ──────────────────────────────────────────────────────────────

const CARD_THEMES = {

  'amex-platinum': {
    light: true,
    networkIsDark: true,
    bg: [
      'radial-gradient(ellipse 70% 55% at 22% 15%, rgba(255,255,255,0.88) 0%, transparent 55%)',
      'radial-gradient(ellipse 65% 60% at 80% 85%, rgba(185,190,210,0.5) 0%, transparent 50%)',
      'linear-gradient(145deg, #E4E5EE 0%, #D6D8E4 38%, #C8CAD8 65%, #D4D6E2 100%)',
    ].join(','),
    shadow: [
      'inset 0 0 0 1px rgba(255,255,255,0.72)',
      '0 2px 8px rgba(170,174,200,0.35)',
      '0 24px 64px rgba(0,0,0,0.45)',
    ].join(','),
    edge: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.9) 30%, rgba(255,255,255,1) 50%, rgba(255,255,255,0.9) 70%, transparent 100%)',
    texture: 'radial-gradient(circle, rgba(30,30,55,0.052) 1px, transparent 1px)',
    shimmer: 'linear-gradient(112deg, transparent 22%, rgba(255,255,255,0.28) 35%, rgba(255,255,255,0.52) 50%, rgba(255,255,255,0.28) 65%, transparent 78%)',
    wordmark: 'PLATINUM',
    wmSize: 13,
    wmSpacing: '0.22em',
    wmGradient: 'linear-gradient(135deg, #2A2A3C 0%, #0E0E20 46%, #2A2A3C 100%)',
    network: 'amex',
    issuerText: 'AMERICAN\nEXPRESS',
    dotColor: 'rgba(20,22,50,0.26)',
    issuerColor: 'rgba(20,22,50,0.50)',
  },

  'amex-cobalt': dark({
    bg: [
      'radial-gradient(ellipse 88% 65% at 76% 92%, rgba(28,74,230,0.52) 0%, transparent 58%)',
      'radial-gradient(ellipse 52% 58% at 18% 12%, rgba(14,38,148,0.28) 0%, transparent 54%)',
      'linear-gradient(148deg, #0C0F1C 0%, #070A12 100%)',
    ].join(','),
    shadow: [
      'inset 0 0 0 1px rgba(42,82,220,0.14)',
      '0 2px 8px rgba(10,20,80,0.4)',
      '0 24px 64px rgba(0,0,0,0.72)',
    ].join(','),
    edge: 'linear-gradient(90deg, transparent 0%, rgba(110,155,255,0.3) 22%, rgba(200,220,255,0.58) 50%, rgba(110,155,255,0.3) 78%, transparent 100%)',
    texture: 'radial-gradient(circle, rgba(255,255,255,0.062) 1px, transparent 1px)',
    shimmer: 'linear-gradient(112deg, transparent 22%, rgba(80,130,255,0.028) 35%, rgba(155,192,255,0.072) 50%, rgba(80,130,255,0.028) 65%, transparent 78%)',
    wordmark: 'COBALT',
    wmSize: 28,
    wmSpacing: '0.34em',
    wmGradient: 'linear-gradient(130deg, #7CA8FF 0%, #FFFFFF 46%, #8AB3FF 100%)',
    network: 'amex',
    issuerText: 'AMERICAN\nEXPRESS',
  }),

  'amex-gold-rewards': dark({
    bg: [
      'radial-gradient(ellipse 80% 62% at 70% 90%, rgba(200,140,20,0.50) 0%, transparent 55%)',
      'radial-gradient(ellipse 55% 52% at 15% 10%, rgba(155,90,10,0.28) 0%, transparent 52%)',
      'linear-gradient(148deg, #1A1205 0%, #100C02 100%)',
    ].join(','),
    shadow: [
      'inset 0 0 0 1px rgba(200,150,30,0.18)',
      '0 2px 8px rgba(80,50,0,0.4)',
      '0 24px 64px rgba(0,0,0,0.72)',
    ].join(','),
    edge: 'linear-gradient(90deg, transparent 0%, rgba(215,170,55,0.36) 22%, rgba(255,220,95,0.65) 50%, rgba(215,170,55,0.36) 78%, transparent 100%)',
    texture: 'radial-gradient(circle, rgba(255,220,100,0.055) 1px, transparent 1px)',
    shimmer: 'linear-gradient(112deg, transparent 22%, rgba(200,148,38,0.04) 35%, rgba(255,210,78,0.09) 50%, rgba(200,148,38,0.04) 65%, transparent 78%)',
    wordmark: 'GOLD',
    wmSize: 32,
    wmSpacing: '0.38em',
    wmGradient: 'linear-gradient(130deg, #C89020 0%, #F5D060 38%, #FFED99 55%, #F5D060 72%, #C89020 100%)',
    network: 'amex',
    issuerText: 'AMERICAN\nEXPRESS',
    dotColor: 'rgba(225,178,75,0.40)',
    issuerColor: 'rgba(220,185,88,0.60)',
  }),

  'scotiabank-gold-amex': dark({
    bg: [
      'radial-gradient(ellipse 85% 65% at 72% 90%, rgba(180,15,30,0.56) 0%, transparent 56%)',
      'radial-gradient(ellipse 55% 55% at 20% 10%, rgba(128,10,20,0.30) 0%, transparent 52%)',
      'linear-gradient(148deg, #18040A 0%, #0D0205 100%)',
    ].join(','),
    shadow: [
      'inset 0 0 0 1px rgba(200,30,50,0.14)',
      '0 2px 8px rgba(80,5,15,0.4)',
      '0 24px 64px rgba(0,0,0,0.72)',
    ].join(','),
    edge: 'linear-gradient(90deg, transparent 0%, rgba(225,58,80,0.35) 22%, rgba(255,100,115,0.60) 50%, rgba(225,58,80,0.35) 78%, transparent 100%)',
    texture: 'radial-gradient(circle, rgba(255,100,120,0.05) 1px, transparent 1px)',
    shimmer: 'linear-gradient(112deg, transparent 22%, rgba(200,30,50,0.035) 35%, rgba(255,80,100,0.075) 50%, rgba(200,30,50,0.035) 65%, transparent 78%)',
    wordmark: 'GOLD',
    wmSize: 32,
    wmSpacing: '0.38em',
    wmGradient: 'linear-gradient(130deg, #C89020 0%, #F5D060 38%, #FFED99 55%, #F5D060 72%, #C89020 100%)',
    network: 'amex',
    issuerText: 'SCOTIABANK',
    dotColor: 'rgba(255,155,168,0.38)',
    issuerColor: 'rgba(255,165,175,0.55)',
  }),

  'scotiabank-passport-visa-infinite': dark({
    bg: [
      'radial-gradient(ellipse 80% 62% at 68% 88%, rgba(0,128,118,0.48) 0%, transparent 55%)',
      'radial-gradient(ellipse 55% 52% at 22% 12%, rgba(0,88,78,0.28) 0%, transparent 52%)',
      'linear-gradient(148deg, #040F0E 0%, #020908 100%)',
    ].join(','),
    shadow: [
      'inset 0 0 0 1px rgba(0,160,145,0.14)',
      '0 2px 8px rgba(0,58,52,0.4)',
      '0 24px 64px rgba(0,0,0,0.72)',
    ].join(','),
    edge: 'linear-gradient(90deg, transparent 0%, rgba(0,198,178,0.32) 22%, rgba(58,228,208,0.58) 50%, rgba(0,198,178,0.32) 78%, transparent 100%)',
    texture: 'radial-gradient(circle, rgba(60,220,200,0.055) 1px, transparent 1px)',
    shimmer: 'linear-gradient(112deg, transparent 22%, rgba(0,178,158,0.035) 35%, rgba(58,218,198,0.075) 50%, rgba(0,178,158,0.035) 65%, transparent 78%)',
    wordmark: 'PASSPORT',
    wmSize: 19,
    wmSpacing: '0.26em',
    wmGradient: 'linear-gradient(130deg, #38DFC8 0%, #FFFFFF 46%, #50E5CF 100%)',
    network: 'visa',
    issuerText: 'SCOTIABANK',
    dotColor: 'rgba(58,218,198,0.38)',
    issuerColor: 'rgba(58,218,198,0.55)',
  }),

  'td-first-class-visa-infinite': dark({
    bg: [
      'radial-gradient(ellipse 82% 62% at 70% 90%, rgba(0,100,50,0.52) 0%, transparent 56%)',
      'radial-gradient(ellipse 55% 52% at 18% 12%, rgba(0,68,28,0.28) 0%, transparent 52%)',
      'linear-gradient(148deg, #020E06 0%, #010803 100%)',
    ].join(','),
    shadow: [
      'inset 0 0 0 1px rgba(0,128,62,0.14)',
      '0 2px 8px rgba(0,48,18,0.4)',
      '0 24px 64px rgba(0,0,0,0.72)',
    ].join(','),
    edge: 'linear-gradient(90deg, transparent 0%, rgba(0,178,88,0.30) 22%, rgba(58,218,128,0.55) 50%, rgba(0,178,88,0.30) 78%, transparent 100%)',
    texture: 'radial-gradient(circle, rgba(58,218,128,0.052) 1px, transparent 1px)',
    shimmer: 'linear-gradient(112deg, transparent 22%, rgba(0,158,78,0.035) 35%, rgba(58,208,118,0.075) 50%, rgba(0,158,78,0.035) 65%, transparent 78%)',
    wordmark: 'FIRST CLASS',
    wmSize: 15,
    wmSpacing: '0.22em',
    wmGradient: 'linear-gradient(130deg, #52D885 0%, #FFFFFF 46%, #62E895 100%)',
    network: 'visa',
    issuerText: 'TD',
    dotColor: 'rgba(58,208,118,0.38)',
    issuerColor: 'rgba(72,218,128,0.60)',
  }),

  'td-aeroplan-visa-infinite-privilege': dark({
    bg: [
      'radial-gradient(ellipse 85% 65% at 74% 90%, rgba(0,58,162,0.54) 0%, transparent 56%)',
      'radial-gradient(ellipse 55% 55% at 18% 12%, rgba(0,28,98,0.30) 0%, transparent 52%)',
      'linear-gradient(148deg, #050814 0%, #020510 100%)',
    ].join(','),
    shadow: [
      'inset 0 0 0 1px rgba(0,78,198,0.16)',
      '0 2px 8px rgba(0,18,78,0.4)',
      '0 24px 64px rgba(0,0,0,0.72)',
    ].join(','),
    edge: 'linear-gradient(90deg, transparent 0%, rgba(78,138,255,0.30) 22%, rgba(148,198,255,0.60) 50%, rgba(78,138,255,0.30) 78%, transparent 100%)',
    texture: 'radial-gradient(circle, rgba(100,158,255,0.055) 1px, transparent 1px)',
    shimmer: 'linear-gradient(112deg, transparent 22%, rgba(48,108,238,0.04) 35%, rgba(128,178,255,0.085) 50%, rgba(48,108,238,0.04) 65%, transparent 78%)',
    wordmark: 'AEROPLAN',
    wmSize: 18,
    wmSpacing: '0.24em',
    wmGradient: 'linear-gradient(130deg, #7EB2FF 0%, #FFFFFF 46%, #8EBDFF 100%)',
    network: 'visa',
    issuerText: 'TD',
    dotColor: 'rgba(118,172,255,0.38)',
    issuerColor: 'rgba(128,178,255,0.58)',
  }),

  'cibc-aventura-visa-infinite': dark({
    bg: [
      'radial-gradient(ellipse 82% 63% at 72% 90%, rgba(162,0,44,0.52) 0%, transparent 56%)',
      'radial-gradient(ellipse 55% 52% at 18% 12%, rgba(118,0,28,0.28) 0%, transparent 52%)',
      'linear-gradient(148deg, #150206 0%, #0D0104 100%)',
    ].join(','),
    shadow: [
      'inset 0 0 0 1px rgba(198,0,52,0.14)',
      '0 2px 8px rgba(68,0,14,0.4)',
      '0 24px 64px rgba(0,0,0,0.72)',
    ].join(','),
    edge: 'linear-gradient(90deg, transparent 0%, rgba(228,58,88,0.32) 22%, rgba(255,98,128,0.58) 50%, rgba(228,58,88,0.32) 78%, transparent 100%)',
    texture: 'radial-gradient(circle, rgba(255,98,128,0.05) 1px, transparent 1px)',
    shimmer: 'linear-gradient(112deg, transparent 22%, rgba(198,18,58,0.035) 35%, rgba(255,68,108,0.075) 50%, rgba(198,18,58,0.035) 65%, transparent 78%)',
    wordmark: 'AVENTURA',
    wmSize: 19,
    wmSpacing: '0.24em',
    wmGradient: 'linear-gradient(130deg, #FF6E8E 0%, #FFFFFF 46%, #FF7E9A 100%)',
    network: 'visa',
    issuerText: 'CIBC',
    dotColor: 'rgba(255,118,148,0.38)',
    issuerColor: 'rgba(255,128,155,0.60)',
  }),

  'rbc-avion-visa-infinite': dark({
    bg: [
      'radial-gradient(ellipse 82% 63% at 70% 90%, rgba(0,58,178,0.52) 0%, transparent 56%)',
      'radial-gradient(ellipse 55% 52% at 18% 12%, rgba(0,28,118,0.28) 0%, transparent 52%)',
      'linear-gradient(148deg, #040818 0%, #020512 100%)',
    ].join(','),
    shadow: [
      'inset 0 0 0 1px rgba(0,78,218,0.14)',
      '0 2px 8px rgba(0,18,88,0.4)',
      '0 24px 64px rgba(0,0,0,0.72)',
    ].join(','),
    edge: 'linear-gradient(90deg, transparent 0%, rgba(68,128,255,0.30) 22%, rgba(138,188,255,0.58) 50%, rgba(68,128,255,0.30) 78%, transparent 100%)',
    texture: 'radial-gradient(circle, rgba(98,162,255,0.055) 1px, transparent 1px)',
    shimmer: 'linear-gradient(112deg, transparent 22%, rgba(38,98,228,0.04) 35%, rgba(118,172,255,0.085) 50%, rgba(38,98,228,0.04) 65%, transparent 78%)',
    wordmark: 'AVION',
    wmSize: 26,
    wmSpacing: '0.36em',
    wmGradient: 'linear-gradient(130deg, #78AEFF 0%, #FFFFFF 46%, #88BCFF 100%)',
    network: 'visa',
    issuerText: 'RBC',
    dotColor: 'rgba(118,172,255,0.38)',
    issuerColor: 'rgba(128,182,255,0.58)',
  }),

  'rbc-avion-visa-infinite-privilege': dark({
    bg: [
      'radial-gradient(ellipse 80% 60% at 70% 90%, rgba(158,118,18,0.42) 0%, transparent 56%)',
      'radial-gradient(ellipse 55% 52% at 18% 12%, rgba(98,72,8,0.26) 0%, transparent 52%)',
      'linear-gradient(148deg, #0A0805 0%, #060503 100%)',
    ].join(','),
    shadow: [
      'inset 0 0 0 1px rgba(178,138,28,0.20)',
      '0 2px 8px rgba(58,38,0,0.4)',
      '0 24px 64px rgba(0,0,0,0.72)',
    ].join(','),
    edge: 'linear-gradient(90deg, transparent 0%, rgba(208,162,48,0.36) 22%, rgba(255,212,88,0.65) 50%, rgba(208,162,48,0.36) 78%, transparent 100%)',
    texture: 'radial-gradient(circle, rgba(218,172,58,0.055) 1px, transparent 1px)',
    shimmer: 'linear-gradient(112deg, transparent 22%, rgba(178,138,28,0.04) 35%, rgba(238,198,68,0.085) 50%, rgba(178,138,28,0.04) 65%, transparent 78%)',
    wordmark: 'AVION\nPRIVILEGE',
    wmSize: 14,
    wmSpacing: '0.28em',
    wmGradient: 'linear-gradient(130deg, #C89020 0%, #F5D060 38%, #FFED99 55%, #F5D060 72%, #C89020 100%)',
    network: 'visa',
    issuerText: 'RBC',
    dotColor: 'rgba(218,178,68,0.40)',
    issuerColor: 'rgba(218,182,78,0.60)',
  }),

  'bmo-ascend-world-elite': dark({
    bg: [
      'radial-gradient(ellipse 82% 63% at 72% 90%, rgba(0,58,148,0.48) 0%, transparent 56%)',
      'radial-gradient(ellipse 55% 52% at 20% 12%, rgba(0,28,98,0.26) 0%, transparent 52%)',
      'linear-gradient(148deg, #030711 0%, #02050C 100%)',
    ].join(','),
    shadow: [
      'inset 0 0 0 1px rgba(0,72,182,0.14)',
      '0 2px 8px rgba(0,18,68,0.4)',
      '0 24px 64px rgba(0,0,0,0.72)',
    ].join(','),
    edge: 'linear-gradient(90deg, transparent 0%, rgba(58,118,238,0.30) 22%, rgba(128,182,255,0.58) 50%, rgba(58,118,238,0.30) 78%, transparent 100%)',
    texture: 'radial-gradient(circle, rgba(98,158,255,0.055) 1px, transparent 1px)',
    shimmer: 'linear-gradient(112deg, transparent 22%, rgba(38,92,218,0.04) 35%, rgba(118,172,255,0.085) 50%, rgba(38,92,218,0.04) 65%, transparent 78%)',
    wordmark: 'ASCEND',
    wmSize: 22,
    wmSpacing: '0.32em',
    wmGradient: 'linear-gradient(130deg, #76A8FF 0%, #FFFFFF 46%, #86B6FF 100%)',
    network: 'mastercard',
    issuerText: 'BMO',
    dotColor: 'rgba(108,165,255,0.38)',
    issuerColor: 'rgba(118,172,255,0.58)',
  }),

  'national-bank-world-elite': dark({
    bg: [
      'radial-gradient(ellipse 82% 62% at 72% 90%, rgba(158,14,38,0.52) 0%, transparent 56%)',
      'radial-gradient(ellipse 55% 52% at 18% 12%, rgba(108,8,22,0.28) 0%, transparent 52%)',
      'linear-gradient(148deg, #120205 0%, #0A0103 100%)',
    ].join(','),
    shadow: [
      'inset 0 0 0 1px rgba(188,18,48,0.14)',
      '0 2px 8px rgba(62,4,12,0.4)',
      '0 24px 64px rgba(0,0,0,0.72)',
    ].join(','),
    edge: 'linear-gradient(90deg, transparent 0%, rgba(218,52,82,0.32) 22%, rgba(255,92,118,0.58) 50%, rgba(218,52,82,0.32) 78%, transparent 100%)',
    texture: 'radial-gradient(circle, rgba(255,88,118,0.05) 1px, transparent 1px)',
    shimmer: 'linear-gradient(112deg, transparent 22%, rgba(192,18,52,0.035) 35%, rgba(255,62,98,0.075) 50%, rgba(192,18,52,0.035) 65%, transparent 78%)',
    wordmark: 'WORLD ELITE',
    wmSize: 14,
    wmSpacing: '0.24em',
    wmGradient: 'linear-gradient(130deg, #FF6E8E 0%, #FFFFFF 46%, #FF7E9A 100%)',
    network: 'mastercard',
    issuerText: 'NATIONAL BANK',
    dotColor: 'rgba(255,112,142,0.38)',
    issuerColor: 'rgba(255,118,145,0.60)',
  }),
}

// ── Main component ───────────────────────────────────────────────────────────

export default function CardMockup({ cardId = 'amex-cobalt', large = false }) {
  const theme = CARD_THEMES[cardId] ?? CARD_THEMES['amex-cobalt']
  const wmSize = Math.min(theme.wmSize, large ? 32 : 20)
  const wordmarkLines = theme.wordmark.split('\n')
  const issuerLines   = theme.issuerText.split('\n')

  return (
    <div
      className="cmk-card"
      style={{
        background: theme.bg,
        boxShadow: theme.shadow,
        '--cmk-edge': theme.edge,
      }}
    >
      <div className="cmk-texture" style={{ backgroundImage: theme.texture }} />
      <div className="cmk-shimmer" style={{ background: theme.shimmer }} />

      <div className="cmk-content">

        <div className="cmk-top">
          <Chip large={large} />
          <NetworkMark network={theme.network} isDark={theme.networkIsDark} />
        </div>

        <div
          className="cmk-brand"
          style={{
            fontSize: wmSize,
            letterSpacing: theme.wmSpacing,
            textIndent: wordmarkLines.length === 1 ? theme.wmSpacing : '0',
            background: theme.wmGradient,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          {wordmarkLines.map((line, i) => (
            <span key={i} style={{ display: 'block' }}>{line}</span>
          ))}
        </div>

        <div className="cmk-bottom">
          <div className="cmk-number">
            {[0, 1, 2, 3].map((g) => (
              <span key={g} className="cmk-group">
                {[0, 1, 2, 3].map((d) => (
                  <span key={d} className="cmk-dot" style={{ background: theme.dotColor }} />
                ))}
              </span>
            ))}
          </div>
          <div className="cmk-issuer" style={{ color: theme.issuerColor }}>
            {issuerLines.map((line, i) => (
              <span key={i} style={{ display: 'block' }}>{line}</span>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}
