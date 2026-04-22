import { motion } from 'framer-motion'
import CardMockup from './CardMockup'

const BackArrow = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6" />
  </svg>
)

const CheckIcon = ({ yes }) => (
  <span className={`ins-check ${yes ? 'yes' : 'no'}`}>
    {yes ? '✓' : '×'}
  </span>
)

function formatCategoryKey(key) {
  return key
    .replace(/_/g, ' ')
    .replace(/([A-Z])/g, ' $1')
    .replace(/^\w/, (c) => c.toUpperCase())
    .trim()
}

const sectionVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.24, ease: 'easeOut' } },
}

export default function CardDetail({ card, onBack }) {
  if (!card) return null

  const {
    name, issuer, network, tier, annualFee, annualFeeNote,
    earnRates, credits, perks, insurance, welcomeBonus,
    foreignTransactionFee, incomeRequired, lounge,
    pointValue, rewardsProgram,
  } = card

  const totalCredits = (credits ?? []).reduce((s, c) => s + c.amount, 0)

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
          <BackArrow />
          Back to Picks
        </motion.button>

        <motion.div
          variants={sectionVariants}
          initial="hidden"
          animate="show"
        >
          {/* Card visual */}
          <motion.div className="detail-mockup-hero" variants={itemVariants}>
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
            >
              <CardMockup cardId={card.id} large />
            </motion.div>
          </motion.div>

          {/* Hero */}
          <motion.div className="detail-hero glass" variants={itemVariants}>
            <div className={`detail-tier-badge ${tier}`}>
              {tier === 'premium' ? '★ Premium' : 'Mid-tier'}
            </div>
            <div className="detail-card-name">{name}</div>
            <div className="detail-issuer">
              {issuer}
              <span className="rec-network-badge">{network}</span>
            </div>

            <div className="detail-stats">
              <div>
                <div className="detail-stat-label">Annual Fee</div>
                <div className="detail-stat-value">${annualFee.toFixed(0)}</div>
                {annualFeeNote && <div className="detail-stat-sub">{annualFeeNote}</div>}
              </div>
              <div>
                <div className="detail-stat-label">Annual Credits</div>
                <div className="detail-stat-value orange">${totalCredits}</div>
              </div>
              <div>
                <div className="detail-stat-label">Rewards Program</div>
                <div style={{ fontSize: 13, color: 'var(--color-cream)', marginTop: 4 }}>{rewardsProgram}</div>
              </div>
              <div>
                <div className="detail-stat-label">Point Value</div>
                <div className="detail-stat-value neon">{pointValue.estimatedCentsPerPoint}¢</div>
                <div className="detail-stat-sub">per point</div>
              </div>
            </div>
          </motion.div>

          {/* Earn Rates */}
          <motion.div className="detail-section glass" variants={itemVariants}>
            <div className="detail-section-title">Earn Rates (pts per $1)</div>
            <div className="earn-rate-grid">
              {Object.entries(earnRates).map(([cat, rate]) => (
                <div key={cat} className="earn-rate-item">
                  <div className="earn-rate-category">{formatCategoryKey(cat)}</div>
                  <div>
                    <span className="earn-rate-value">{rate}</span>
                    <span className="earn-rate-unit">× pts</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Welcome Bonus */}
          {welcomeBonus && (
            <motion.div className="detail-section glass" variants={itemVariants}>
              <div className="detail-section-title">
                Welcome Bonus — up to {welcomeBonus.totalPotential.toLocaleString()} pts
              </div>
              {welcomeBonus.tiers.map((t, i) => (
                <div key={i} className="bonus-tier">
                  <div className="bonus-points">{t.points.toLocaleString()} pts</div>
                  <div className="bonus-condition">{t.condition}</div>
                </div>
              ))}
            </motion.div>
          )}

          {/* Credits */}
          {credits && credits.length > 0 && (
            <motion.div className="detail-section glass" variants={itemVariants}>
              <div className="detail-section-title">Annual Credits</div>
              {credits.map((credit, i) => (
                <div key={i} className="credit-item">
                  <span className="credit-note">{credit.note}</span>
                  <span className="credit-amount">+${credit.amount}</span>
                </div>
              ))}
            </motion.div>
          )}

          {/* Perks */}
          {perks && perks.length > 0 && (
            <motion.div className="detail-section glass" variants={itemVariants}>
              <div className="detail-section-title">Perks & Benefits</div>
              <div className="perk-list">
                {perks.map((perk, i) => (
                  <div key={i} className="perk-item">
                    <div className="perk-dot" />
                    <span>{perk}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Insurance */}
          <motion.div className="detail-section glass" variants={itemVariants}>
            <div className="detail-section-title">Insurance Coverage</div>
            <div className="insurance-grid">
              {[
                ['Travel Medical', insurance.travelMedical],
                ['Trip Cancellation', insurance.tripCancellation],
                ['Trip Interruption', insurance.tripInterruption],
                ['Flight Delay', insurance.flightDelay],
                ['Baggage Delay', insurance.baggageDelay],
                ['Rental Car', insurance.rentalCar],
                ['Purchase Protection', insurance.purchaseProtection],
                ['Extended Warranty', insurance.extendedWarranty],
                ['Mobile Device', insurance.mobileDevice],
              ].map(([label, covered]) => (
                <div key={label} className="insurance-item">
                  <CheckIcon yes={covered} />
                  <span>{label}</span>
                </div>
              ))}
            </div>
            {insurance.travelMedical && insurance.travelMedicalDays && (
              <div style={{ marginTop: 12, fontSize: 12, color: 'var(--color-muted)' }}>
                Travel medical coverage: up to {insurance.travelMedicalDays} days per trip
              </div>
            )}
          </motion.div>

          {/* Details */}
          <motion.div className="detail-section glass" variants={itemVariants} style={{ marginBottom: 0 }}>
            <div className="detail-section-title">Card Details</div>
            <div className="perk-list">
              <div className="perk-item">
                <div className="perk-dot" style={{ background: 'var(--color-muted)' }} />
                <span>Foreign transaction fee: {foreignTransactionFee === 0 ? 'None' : `${foreignTransactionFee}%`}</span>
              </div>
              {lounge?.included && (
                <div className="perk-item">
                  <div className="perk-dot" style={{ background: 'var(--color-muted)' }} />
                  <span>Lounge: {lounge.type} · {lounge.visitsPerYear === 'unlimited' ? 'Unlimited visits' : `${lounge.visitsPerYear} visits/yr`}</span>
                </div>
              )}
              {incomeRequired?.personal && (
                <div className="perk-item">
                  <div className="perk-dot" style={{ background: 'var(--color-muted)' }} />
                  <span>Min. personal income: ${incomeRequired.personal.toLocaleString()}</span>
                </div>
              )}
              {incomeRequired?.household && (
                <div className="perk-item">
                  <div className="perk-dot" style={{ background: 'var(--color-muted)' }} />
                  <span>Min. household income: ${incomeRequired.household.toLocaleString()}</span>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
