import { motion } from 'framer-motion'

const SECTIONS = [
  {
    key: 'priority',
    title: "What matters most?",
    multi: false,
    options: [
      { id: 'maximize_rewards', label: 'Maximize rewards',          icon: 'trending_up'     },
      { id: 'travel_perks',     label: 'Travel perks & lounges',    icon: 'flight_class'    },
      { id: 'welcome_bonus',    label: 'Best welcome bonus',        icon: 'card_giftcard'   },
      { id: 'simple_flexible',  label: 'Simple & flexible',         icon: 'tune'            },
    ],
  },
  {
    key: 'travelStyle',
    title: 'How do you travel?',
    multi: false,
    options: [
      { id: 'air_canada',       label: 'Air Canada regularly',      icon: 'flight'               },
      { id: 'various_airlines', label: 'Various airlines',          icon: 'connecting_airports'  },
      { id: 'international',    label: 'Internationally often',     icon: 'public'               },
      { id: 'rarely_travel',    label: 'Rarely travel',             icon: 'home'                 },
    ],
  },
  {
    key: 'niceToHaves',
    title: 'Nice to haves',
    subtitle: 'Pick up to 2',
    multi: true,
    maxSelect: 2,
    options: [
      { id: 'lounge_access',    label: 'Lounge access',              icon: 'weekend'              },
      { id: 'no_fx_fee',        label: 'No foreign transaction fee', icon: 'currency_exchange'    },
      { id: 'travel_insurance', label: 'Travel insurance',           icon: 'health_and_safety'    },
      { id: 'hotel_status',     label: 'Hotel status or perks',      icon: 'hotel'                },
      { id: 'family_benefits',  label: 'Family card benefits',       icon: 'group'                },
    ],
  },
]

// Stagger container for tiles — whileInView triggers on the grid
const tileStagger = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.055 } },
}

const tileRise = {
  hidden: { opacity: 0, y: 14 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.26, ease: 'easeOut' } },
}

const TILE_UNSELECTED = {
  borderColor:     'rgba(255,255,255,0.1)',
  backgroundColor: 'rgba(255,255,255,0.05)',
  boxShadow:       '0 0 0px rgba(57,255,20,0)',
}

const TILE_SELECTED = {
  borderColor:     '#39FF14',
  backgroundColor: 'rgba(57,255,20,0.07)',
  boxShadow:       '0 0 18px rgba(57,255,20,0.12), inset 0 0 12px rgba(57,255,20,0.04)',
}

const TILE_TRANSITION = { duration: 0.28, ease: 'easeOut' }

function TileGrid({ options, selected, onToggle, multi, maxSelect }) {
  return (
    <motion.div
      className="pref-grid"
      variants={tileStagger}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-24px' }}
    >
      {options.map((opt) => {
        const isSelected = multi ? selected.includes(opt.id) : selected === opt.id
        const isDisabled = multi && !isSelected && selected.length >= maxSelect

        return (
          // Outer div handles stagger entrance via variants
          <motion.div key={opt.id} variants={tileRise}>
            {/* Inner button handles selection state via animate */}
            <motion.button
              className={`pref-tile${isDisabled ? ' pref-tile-dimmed' : ''}`}
              initial={false}
              animate={isSelected ? TILE_SELECTED : TILE_UNSELECTED}
              transition={TILE_TRANSITION}
              onClick={() => onToggle(opt.id)}
              whileTap={{ scale: 0.95 }}
            >
              <span
                className="material-icons-outlined pref-tile-icon"
                style={{ color: isSelected ? '#39FF14' : undefined }}
              >
                {opt.icon}
              </span>
              <span
                className="pref-tile-label"
                style={{ color: isSelected ? 'var(--color-cream)' : undefined }}
              >
                {opt.label}
              </span>
            </motion.button>
          </motion.div>
        )
      })}
    </motion.div>
  )
}

export default function Preferences({ preferences, onChange, onContinue }) {
  const canContinue = preferences.priority !== null && preferences.travelStyle !== null

  const handleToggle = (key, id, multi, maxSelect) => {
    if (multi) {
      const current = preferences[key]
      if (current.includes(id)) {
        onChange({ ...preferences, [key]: current.filter((x) => x !== id) })
      } else if (current.length < maxSelect) {
        onChange({ ...preferences, [key]: [...current, id] })
      }
    } else {
      onChange({ ...preferences, [key]: preferences[key] === id ? null : id })
    }
  }

  return (
    <div className="pref-shell">
      <div className="pref-scroll">
        <div className="pref-content">
          <motion.header
            className="view-header"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h1 className="view-title">Your<br />Style</h1>
            <p className="view-subtitle">A few quick questions to sharpen your picks</p>
          </motion.header>

          {SECTIONS.map((section, i) => (
            <motion.div
              key={section.key}
              className="pref-section"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-32px' }}
              transition={{ duration: 0.36, delay: i * 0.04, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="pref-section-header">
                <span className="pref-section-title">{section.title}</span>
                {section.subtitle && (
                  <span className="pref-section-subtitle">{section.subtitle}</span>
                )}
              </div>

              <TileGrid
                options={section.options}
                selected={preferences[section.key]}
                onToggle={(id) => handleToggle(section.key, id, section.multi, section.maxSelect)}
                multi={section.multi}
                maxSelect={section.maxSelect}
              />
            </motion.div>
          ))}

          <div className="pref-bottom-spacer" />
        </div>
      </div>

      <motion.div
        className="pref-cta-bar"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.32, delay: 0.42 }}
      >
        <motion.button
          className="cta-button"
          style={{ opacity: canContinue ? 1 : 0.35 }}
          onClick={canContinue ? onContinue : undefined}
          whileTap={canContinue ? { scale: 0.97 } : {}}
        >
          Set My Spending
        </motion.button>
      </motion.div>
    </div>
  )
}
