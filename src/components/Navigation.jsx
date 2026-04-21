import { motion, AnimatePresence } from 'framer-motion'

const ProfileIcon = () => (
  <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="4" />
    <path d="M4 20c0-4.4 3.6-7 8-7s8 2.6 8 7" />
  </svg>
)

const BrowseIcon = () => (
  <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" />
    <rect x="14" y="14" width="7" height="7" rx="1" />
  </svg>
)

const PicksIcon = () => (
  <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
  </svg>
)

const CardIcon = () => (
  <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="5" width="20" height="14" rx="2" />
    <line x1="2" y1="10" x2="22" y2="10" />
    <line x1="6" y1="15" x2="10" y2="15" />
  </svg>
)

const TABS = [
  { id: 'profile',         label: 'Profile', Icon: ProfileIcon },
  { id: 'browse',          label: 'Browse',  Icon: BrowseIcon  },
  { id: 'recommendations', label: 'Picks',   Icon: PicksIcon   },
  { id: 'detail',          label: 'Card',    Icon: CardIcon    },
]

export default function Navigation({ view, onNavigate, cardSelected }) {
  return (
    <nav className="bottom-nav">
      <div className="bottom-nav-inner">
        {TABS.map(({ id, label, Icon }) => {
          const isActive = view === id
          const isDisabled = id === 'detail' && !cardSelected

          return (
            <button
              key={id}
              className={`nav-tab ${isActive ? 'active' : ''} ${isDisabled ? 'disabled' : ''}`}
              onClick={() => !isDisabled && onNavigate(id)}
              aria-label={label}
            >
              <AnimatePresence>
                {isActive && (
                  <motion.div
                    className="nav-active-dot"
                    layoutId="nav-dot"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 28 }}
                  />
                )}
              </AnimatePresence>
              <Icon />
              <span className="nav-tab-label">{label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
