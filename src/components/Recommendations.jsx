import { motion } from 'framer-motion'
import { useRecommendations } from '../hooks/useRecommendations'

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

export default function Recommendations({ spending, preferences, onSelectCard }) {
  const ranked = useRecommendations(spending, preferences)
  const subtitle = SUBTITLE[preferences?.priority] ?? 'Ranked by estimated net annual value'

  return (
    <div className="view-wrapper">
      <div className="view-container">
        <header className="view-header">
          <h1 className="view-title">Your Top<br />Picks</h1>
          <p className="view-subtitle">{subtitle}</p>
        </header>

        <motion.div variants={containerVariants} initial="hidden" animate="show">
          {ranked.map((card, i) => (
            <motion.div
              key={card.id}
              className="rec-card glass"
              variants={cardVariants}
              onClick={() => onSelectCard(card)}
              whileTap={{ scale: 0.985 }}
            >
              <div className="rec-rank">
                <span>#{i + 1}</span>
                <div className="rec-rank-line" />
              </div>

              <div className="rec-card-name">{card.name}</div>
              <div className="rec-issuer">
                {card.issuer}
                <span className="rec-network-badge">{card.network}</span>
              </div>

              <div className="rec-value-row">
                <div className="rec-value">
                  {card.netValue >= 0 ? '+' : ''}${card.netValue.toLocaleString()}
                </div>
              </div>
              <div className="rec-value-label">Est. net annual value</div>

              <div className="rec-tags">
                {card.bestFor.slice(0, 3).map((tag) => (
                  <span key={tag} className="rec-tag">{tag}</span>
                ))}
              </div>

              <div className="rec-footer">
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
          ))}
        </motion.div>
      </div>
    </div>
  )
}
