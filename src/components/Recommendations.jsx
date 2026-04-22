import { useState } from 'react'
import { motion } from 'framer-motion'
import { useRecommendations } from '../hooks/useRecommendations'
import CardMockup from './CardMockup'

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
}

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.28, ease: 'easeOut' } },
}

const SUBTITLE = {
  welcome_bonus:    'Ranked by welcome bonus value in year one',
  travel_perks:     'Weighted for travel perks & lounge access',
  maximize_rewards: 'Ranked by estimated net annual value',
  simple_flexible:  'Ranked by estimated net annual value',
}

// ── Match reason ─────────────────────────────────────────────

function generateMatchReason(card, preferences) {
  const { priority, travelStyle, niceToHaves = [] } = preferences || {}
  const parts = []

  if (travelStyle === 'air_canada' && card.rewardsProgram === 'Aeroplan') {
    parts.push('Air Canada travel')
  } else if (travelStyle === 'other_airlines') {
    parts.push('flexible airline travel')
  }

  if (niceToHaves.includes('lounge_access') && card.lounge?.included) parts.push('lounge access')
  if (niceToHaves.includes('no_fx_fee') && card.foreignTransactionFee === 0) parts.push('no foreign fees')
  if (niceToHaves.includes('travel_insurance') && card.insurance?.travelMedical) parts.push('travel insurance')
  if (niceToHaves.includes('hotel_status') && card.perks?.some((p) => /status|hilton|marriott|ihg/i.test(p))) {
    parts.push('hotel status')
  }
  if (priority === 'welcome_bonus') parts.push('welcome bonus value')

  if (parts.length === 0) return 'Best overall match for your spending profile'
  if (parts.length === 1) return `Matched your ${parts[0]} preference`
  const last = parts.pop()
  return `Matched your ${parts.join(', ')} and ${last} preferences`
}

// ── Why bullets ──────────────────────────────────────────────

function generateWhyBullets(card, preferences) {
  const { travelStyle, niceToHaves = [] } = preferences || {}
  const cpp = card.pointValue?.estimatedCentsPerPoint ?? 1
  const bullets = []

  if (card.rewardsProgram === 'Aeroplan' && travelStyle === 'air_canada') {
    bullets.push('Earn Aeroplan points on every Air Canada purchase')
  }

  if (card.lounge?.included) {
    const count   = card.lounge.visitsPerYear === 'unlimited' ? 'Unlimited' : card.lounge.visitsPerYear
    const suffix  = card.lounge.visitsPerYear === 'unlimited' ? 'access' : 'visits/year'
    bullets.push(`${count} ${card.lounge.type} lounge ${suffix}`)
  }

  if (card.welcomeBonus?.totalPotential) {
    const dollars = Math.round(card.welcomeBonus.totalPotential * cpp / 100)
    bullets.push(`${card.welcomeBonus.totalPotential.toLocaleString()} pt welcome bonus worth ~$${dollars}`)
  }

  if (bullets.length < 3) {
    const maxRate  = Math.max(...Object.values(card.earnRates))
    const topEntry = Object.entries(card.earnRates).find(([, v]) => v === maxRate)
    if (maxRate >= 3 && topEntry) {
      bullets.push(`Earn ${maxRate}× points on ${topEntry[0].replace(/_/g, ' ')}`)
    }
  }

  if (bullets.length < 3 && card.foreignTransactionFee === 0 && niceToHaves.includes('no_fx_fee')) {
    bullets.push('No foreign transaction fees worldwide')
  }

  if (bullets.length < 3 && card.credits?.length > 0) {
    const total = card.credits.reduce((s, c) => s + c.amount, 0)
    if (total > 0) bullets.push(`$${total} in annual statement credits`)
  }

  return bullets.slice(0, 3)
}

// ── Sub-components ───────────────────────────────────────────

const ChevronIcon = ({ open }) => (
  <motion.svg
    width="14" height="14" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="2.5"
    strokeLinecap="round" strokeLinejoin="round"
    animate={{ rotate: open ? 180 : 0 }}
    transition={{ duration: 0.22 }}
    style={{ flexShrink: 0 }}
  >
    <polyline points="6 9 12 15 18 9" />
  </motion.svg>
)

function HeroCard({ card, preferences, onSelect }) {
  const [whyOpen, setWhyOpen] = useState(false)

  const cpp         = card.pointValue?.estimatedCentsPerPoint ?? 1
  const bonusDollars = Math.round((card.welcomeBonus?.totalPotential ?? 0) * cpp / 100)
  const yearOne     = card.netValue + bonusDollars

  const matchReason = generateMatchReason(card, preferences)
  const whyBullets  = generateWhyBullets(card, preferences)

  return (
    <motion.div
      className="rec-hero-card"
      variants={cardVariants}
      onClick={() => onSelect(card)}
      whileTap={{ scale: 0.985 }}
    >
      <div className="rec-best-match-label">Your Best Match</div>

      {/* Floating card illustration */}
      <motion.div
        className="rec-hero-card-mockup"
        onClick={(e) => e.stopPropagation()}
      >
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <CardMockup cardId={card.id} />
        </motion.div>
      </motion.div>

      <div className="rec-hero-name">{card.name}</div>
      <div className="rec-match-reason">{matchReason}</div>

      {/* Stats row */}
      <div className="rec-hero-stats">
        <div className="rec-hero-stat">
          <div className="rec-hero-stat-label">Est. Annual Value</div>
          <div className="rec-hero-stat-value rec-hero-stat-neon">
            {card.netValue >= 0 ? '+' : ''}${card.netValue.toLocaleString()}
          </div>
        </div>
        <div className="rec-hero-stat-divider" />
        <div className="rec-hero-stat">
          <div className="rec-hero-stat-label">Year 1 Potential</div>
          <div className="rec-hero-stat-value rec-hero-stat-orange">
            +${yearOne.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Expandable why section */}
      <div className="rec-why-section" onClick={(e) => e.stopPropagation()}>
        <button
          className="rec-why-trigger"
          onClick={() => setWhyOpen((o) => !o)}
        >
          Why this card?
          <ChevronIcon open={whyOpen} />
        </button>
        <motion.div
          initial={false}
          animate={{ height: whyOpen ? 'auto' : 0, opacity: whyOpen ? 1 : 0 }}
          style={{ overflow: 'hidden' }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
        >
          <ul className="rec-why-bullets">
            {whyBullets.map((b, i) => <li key={i}>{b}</li>)}
          </ul>
        </motion.div>
      </div>

      {/* Footer */}
      <div className="rec-hero-footer">
        <span className="rec-fee">
          Annual fee: <span>${card.annualFee.toFixed(0)}</span>
        </span>
        <span className="rec-arrow">
          Details
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </span>
      </div>
    </motion.div>
  )
}

// ── Main component ────────────────────────────────────────────

export default function Recommendations({ spending, preferences, onSelectCard }) {
  const ranked   = useRecommendations(spending, preferences)
  const subtitle = SUBTITLE[preferences?.priority] ?? 'Ranked by estimated net annual value'

  if (!ranked.length) return null

  const [hero, ...rest] = ranked

  return (
    <div className="view-wrapper">
      <div className="view-container">
        <header className="view-header">
          <h1 className="view-title">Your Top<br />Picks</h1>
          <p className="view-subtitle">{subtitle}</p>
        </header>

        <motion.div variants={containerVariants} initial="hidden" animate="show">

          <HeroCard card={hero} preferences={preferences} onSelect={onSelectCard} />

          {rest.map((card, i) => (
            <motion.div
              key={card.id}
              className="rec-compact-card glass"
              variants={cardVariants}
              onClick={() => onSelectCard(card)}
              whileTap={{ scale: 0.985 }}
            >
              <div className="rec-compact-rank">#{i + 2}</div>
              <div className="rec-compact-right">
                <div className="rec-compact-name">{card.name}</div>
                <div className="rec-issuer">
                  {card.issuer}
                  <span className="rec-network-badge">{card.network}</span>
                </div>
                <div className="rec-compact-row">
                  <span className="rec-compact-value">
                    {card.netValue >= 0 ? '+' : ''}${card.netValue.toLocaleString()}
                    <span className="rec-compact-value-label"> / yr</span>
                  </span>
                  <span className="rec-arrow">
                    Details
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </span>
                </div>
              </div>
            </motion.div>
          ))}

        </motion.div>
      </div>
    </div>
  )
}
