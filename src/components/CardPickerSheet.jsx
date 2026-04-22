import { motion } from 'framer-motion'
import cards from '../data/cards.json'
import CardMockup from './CardMockup'

const ChevronRight = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6" />
  </svg>
)

export default function CardPickerSheet({ excludeId, onPick, onCancel }) {
  const available = cards.filter((c) => c.id !== excludeId)

  return (
    <motion.div
      className="picker-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.22 }}
    >
      <div className="picker-backdrop" onClick={onCancel} />
      <motion.div
        className="picker-sheet"
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 32, stiffness: 340 }}
      >
        <div className="picker-handle" />

        <div className="picker-header">
          <div className="picker-title">Pick a card to compare</div>
          <button className="picker-cancel-btn" onClick={onCancel}>Cancel</button>
        </div>

        <div className="picker-list">
          {available.map((card) => (
            <button key={card.id} className="picker-row" onClick={() => onPick(card)}>
              <div className="picker-row-mockup">
                <CardMockup cardId={card.id} />
              </div>
              <div className="picker-row-info">
                <div className="picker-row-name">{card.name}</div>
                <div className="picker-row-fee">
                  ${card.annualFee.toFixed(0)}/yr
                  <span className="picker-row-network">{card.network}</span>
                </div>
              </div>
              <span className="picker-row-arrow">
                <ChevronRight />
              </span>
            </button>
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}
