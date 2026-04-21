import { useState, useEffect } from 'react'
import { motion, useSpring, useMotionValueEvent } from 'framer-motion'

const CATEGORIES = [
  { key: 'food',          label: 'Food',            subtitle: 'Groceries & dining combined', icon: 'local_grocery_store', max: 3000 },
  { key: 'gas',           label: 'Gas',             subtitle: null,                           icon: 'local_gas_station',   max: 600  },
  { key: 'travel',        label: 'Travel',          subtitle: null,                           icon: 'flight',              max: 2000 },
  { key: 'transit',       label: 'Transit',         subtitle: null,                           icon: 'directions_transit',  max: 400  },
  { key: 'streaming',     label: 'Streaming',       subtitle: null,                           icon: 'tv',                  max: 200  },
  { key: 'entertainment', label: 'Entertainment',   subtitle: null,                           icon: 'local_activity',      max: 800  },
  { key: 'other',         label: 'Everything Else', subtitle: null,                           icon: 'more_horiz',          max: 2000 },
]

const fillPct = (value, max) =>
  `${Math.min(100, Math.round((value / max) * 100))}%`

function AnimatedAmount({ value }) {
  const spring = useSpring(value, { stiffness: 180, damping: 18, restDelta: 0.5 })
  const [display, setDisplay] = useState(value)

  useEffect(() => {
    spring.set(value)
  }, [value, spring])

  useMotionValueEvent(spring, 'change', (v) => {
    setDisplay(Math.round(v))
  })

  return (
    <span className="category-value">
      {display >= 1000 ? `$${(display / 1000).toFixed(1)}k` : `$${display}`}
    </span>
  )
}

export default function SpendingProfile({ spending, onChange, onSubmit }) {
  const total = Object.values(spending).reduce((s, v) => s + v, 0)

  const handleChange = (key, value) => {
    onChange({ ...spending, [key]: Number(value) })
  }

  return (
    <div className="view-wrapper">
      <div className="view-container">
        <motion.header
          className="view-header"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        >
          <h1 className="view-title">Monthly<br />Spending</h1>
          <p className="intro-copy">
            Tell us how you spend and we'll calculate which Canadian credit cards give you the
            best return — factoring in earn rates, annual fees, and first-year welcome bonuses.
          </p>
        </motion.header>

        <div className="category-list">
          {CATEGORIES.map(({ key, label, subtitle, icon, max }, index) => {
            const value = spending[key] ?? 0
            return (
              <motion.div
                key={key}
                className="category-row glass"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-16px' }}
                transition={{ duration: 0.32, delay: index * 0.04, ease: 'easeOut' }}
              >
                <div className="category-top">
                  <span className="material-icons-outlined category-icon">{icon}</span>
                  <div className="category-label-group">
                    <span className="category-label">{label}</span>
                    {subtitle && <span className="category-subtitle">{subtitle}</span>}
                  </div>
                  <AnimatedAmount value={value} />
                </div>
                <input
                  type="range"
                  className="category-slider"
                  min={0}
                  max={max}
                  step={25}
                  value={value}
                  style={{ '--fill-pct': fillPct(value, max) }}
                  onChange={(e) => handleChange(key, e.target.value)}
                />
              </motion.div>
            )
          })}
        </div>

        <motion.div
          className="total-bar glass"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <span className="total-label">Monthly Total</span>
          <AnimatedAmount value={total} />
        </motion.div>

        <motion.button
          className="cta-button"
          onClick={onSubmit}
          whileTap={{ scale: 0.97 }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          Find My Cards →
        </motion.button>
      </div>
    </div>
  )
}
