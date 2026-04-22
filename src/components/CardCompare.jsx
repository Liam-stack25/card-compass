import { motion } from 'framer-motion'
import CardMockup from './CardMockup'
import { estimateBaseValue } from '../hooks/useRecommendations'

const BackArrow = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6" />
  </svg>
)

function buildRows(a, b, spending) {
  const netA = a.netValue ?? estimateBaseValue(a, spending)
  const netB = b.netValue ?? estimateBaseValue(b, spending)

  const cppa  = a.pointValue?.estimatedCentsPerPoint ?? 1
  const cppb  = b.pointValue?.estimatedCentsPerPoint ?? 1
  const bonA  = Math.round((a.welcomeBonus?.totalPotential ?? 0) * cppa / 100)
  const bonB  = Math.round((b.welcomeBonus?.totalPotential ?? 0) * cppb / 100)
  const yr1A  = netA + bonA
  const yr1B  = netB + bonB

  const hi  = (va, vb) => va > vb ? 'a' : va < vb ? 'b' : 'tie'
  const lo  = (va, vb) => va < vb ? 'a' : va > vb ? 'b' : 'tie'

  return {
    netA, netB,
    rows: [
      {
        label: 'Annual Fee',
        valA: `$${a.annualFee.toFixed(0)}`,
        valB: `$${b.annualFee.toFixed(0)}`,
        winner: lo(a.annualFee, b.annualFee),
      },
      {
        label: 'Est. Annual Value',
        valA: `${netA >= 0 ? '+' : ''}$${netA.toLocaleString()}`,
        valB: `${netB >= 0 ? '+' : ''}$${netB.toLocaleString()}`,
        winner: hi(netA, netB),
      },
      {
        label: 'Year 1 Potential',
        valA: `+$${yr1A.toLocaleString()}`,
        valB: `+$${yr1B.toLocaleString()}`,
        winner: hi(yr1A, yr1B),
      },
      {
        label: 'Rewards Program',
        valA: a.rewardsProgram,
        valB: b.rewardsProgram,
        winner: 'tie',
      },
      {
        label: 'Lounge Access',
        valA: a.lounge?.included ? a.lounge.type : 'None',
        valB: b.lounge?.included ? b.lounge.type : 'None',
        winner: a.lounge?.included && !b.lounge?.included ? 'a'
              : !a.lounge?.included && b.lounge?.included ? 'b'
              : 'tie',
      },
      {
        label: 'FX Fee',
        valA: a.foreignTransactionFee === 0 ? 'None' : `${a.foreignTransactionFee}%`,
        valB: b.foreignTransactionFee === 0 ? 'None' : `${b.foreignTransactionFee}%`,
        winner: lo(a.foreignTransactionFee, b.foreignTransactionFee),
      },
      {
        label: 'Travel Medical',
        valA: a.insurance?.travelMedical
          ? `${a.insurance.travelMedicalDays ?? '—'} days`
          : 'None',
        valB: b.insurance?.travelMedical
          ? `${b.insurance.travelMedicalDays ?? '—'} days`
          : 'None',
        winner: hi(
          a.insurance?.travelMedical ? (a.insurance.travelMedicalDays ?? 1) : 0,
          b.insurance?.travelMedical ? (b.insurance.travelMedicalDays ?? 1) : 0,
        ),
      },
      {
        label: 'Welcome Bonus',
        valA: a.welcomeBonus?.totalPotential
          ? `${a.welcomeBonus.totalPotential.toLocaleString()} pts`
          : 'None',
        valB: b.welcomeBonus?.totalPotential
          ? `${b.welcomeBonus.totalPotential.toLocaleString()} pts`
          : 'None',
        winner: hi(a.welcomeBonus?.totalPotential ?? 0, b.welcomeBonus?.totalPotential ?? 0),
      },
    ],
  }
}

const sectionVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 14 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.24, ease: 'easeOut' } },
}

export default function CardCompare({ cards, spending, onBack, onSelectCard }) {
  if (!cards || cards.length < 2) return null

  const [a, b]               = cards
  const { netA, netB, rows } = buildRows(a, b, spending)
  const overallWinner        = netA > netB ? a : netA < netB ? b : null

  return (
    <div className="view-wrapper">
      <div className="view-container">

        <motion.button
          className="detail-back"
          onClick={onBack}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.2 }}
        >
          <BackArrow /> Back
        </motion.button>

        <motion.div variants={sectionVariants} initial="hidden" animate="show">

          {/* Two-column card header */}
          <motion.div className="compare-header" variants={itemVariants}>
            <div className="compare-col">
              <div className="compare-col-mockup">
                <CardMockup cardId={a.id} />
              </div>
              <div className="compare-col-name">{a.name}</div>
            </div>

            <div className="compare-vs">vs</div>

            <div className="compare-col">
              <div className="compare-col-mockup">
                <CardMockup cardId={b.id} />
              </div>
              <div className="compare-col-name">{b.name}</div>
            </div>
          </motion.div>

          {/* Overall winner banner */}
          <motion.div variants={itemVariants}>
            {overallWinner ? (
              <div className="compare-winner-banner">
                <span className="compare-winner-icon">★</span>
                <span className="compare-winner-label">{overallWinner.name} wins overall</span>
              </div>
            ) : (
              <div className="compare-tie-banner">Tied on estimated annual value</div>
            )}
          </motion.div>

          {/* Comparison table */}
          <motion.div className="compare-table glass" variants={itemVariants}>
            {rows.map((row, i) => (
              <div key={i} className="compare-row">
                <div className={`compare-cell${row.winner === 'a' ? ' compare-win' : ''}`}>
                  {row.valA}
                </div>
                <div className="compare-label">{row.label}</div>
                <div className={`compare-cell compare-cell-right${row.winner === 'b' ? ' compare-win' : ''}`}>
                  {row.valB}
                </div>
              </div>
            ))}

            {/* View full details links aligned to each column */}
            <div className="compare-row compare-detail-row">
              <button className="compare-view-link" onClick={() => onSelectCard(a)}>
                Full details
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
              <div />
              <button className="compare-view-link compare-view-link-right" onClick={() => onSelectCard(b)}>
                Full details
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            </div>
          </motion.div>

          {/* New comparison */}
          <motion.div variants={itemVariants} style={{ marginBottom: 0 }}>
            <button className="compare-new-btn" onClick={onBack}>
              <span className="material-icons-outlined" style={{ fontSize: 16 }}>sync_alt</span>
              New comparison
            </button>
          </motion.div>

        </motion.div>
      </div>
    </div>
  )
}
