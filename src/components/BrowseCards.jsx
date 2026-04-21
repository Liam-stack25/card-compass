import { motion } from 'framer-motion'
import cards from '../data/cards.json'

const TIER_LABEL = { premium: 'Premium', mid: 'Mid-tier' }

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05 } },
}

const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.24, ease: 'easeOut' } },
}

export default function BrowseCards({ onSelectCard }) {
  const byTier = {
    premium: cards.filter((c) => c.tier === 'premium'),
    mid: cards.filter((c) => c.tier === 'mid'),
  }

  return (
    <div className="view-wrapper">
      <div className="view-container">
        <header className="view-header">
          <h1 className="view-title">All<br />Cards</h1>
          <p className="view-subtitle">{cards.length} Canadian credit cards — tap any to explore</p>
        </header>

        {['premium', 'mid'].map((tier) => (
          <div key={tier} className="browse-section">
            <div className="browse-section-label">
              {TIER_LABEL[tier]}
              <span className="browse-count">{byTier[tier].length}</span>
            </div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="show"
            >
              {byTier[tier].map((card) => (
                <motion.div
                  key={card.id}
                  className="browse-card glass"
                  variants={cardVariants}
                  onClick={() => onSelectCard(card)}
                  whileTap={{ scale: 0.985 }}
                >
                  <div className="browse-card-top">
                    <div>
                      <div className="browse-card-name">{card.name}</div>
                      <div className="browse-card-meta">
                        {card.issuer}
                        <span className="rec-network-badge">{card.network}</span>
                      </div>
                    </div>
                    <div className="browse-card-fee">
                      <div className="browse-fee-value">${card.annualFee.toFixed(0)}</div>
                      <div className="browse-fee-label">/ yr</div>
                    </div>
                  </div>

                  <div className="browse-card-tags">
                    {card.bestFor.slice(0, 3).map((tag) => (
                      <span key={tag} className="rec-tag">{tag}</span>
                    ))}
                  </div>

                  <div className="browse-card-footer">
                    <span className="browse-program">{card.rewardsProgram}</span>
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
        ))}
      </div>
    </div>
  )
}
