import { useState, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Navigation from './components/Navigation'
import Landing from './components/Landing'
import Preferences from './components/Preferences'
import SpendingProfile from './components/SpendingProfile'
import BrowseCards from './components/BrowseCards'
import Recommendations from './components/Recommendations'
import CardDetail from './components/CardDetail'
import './App.css'

const DEFAULT_SPENDING = {
  food: 800,
  gas: 150,
  travel: 200,
  transit: 100,
  streaming: 50,
  entertainment: 100,
  other: 200,
}

const DEFAULT_PREFERENCES = {
  priority:    null,
  travelStyle: null,
  niceToHaves: [],
}

// Canonical forward flow — used to infer slide direction
const VIEW_ORDER = ['landing', 'preferences', 'profile', 'recommendations', 'detail', 'browse']

const PAGE_VARIANTS = {
  initial: (dir) => ({ opacity: 0, x: dir * 64, y: 0 }),
  animate: { opacity: 1, x: 0, y: 0 },
  exit:    (dir) => ({ opacity: 0, x: dir * -64, y: 0 }),
}

const PAGE_TRANSITION = { duration: 0.32, ease: [0.32, 0.72, 0, 1] }

const LANDING_EXIT = { opacity: 0, scale: 0.96, y: 0 }

const CompassIcon = () => (
  <svg width="18" height="18" viewBox="0 0 32 32" fill="none">
    <circle cx="16" cy="16" r="12.5" stroke="rgba(57,255,20,0.5)" strokeWidth="1.5" />
    <path d="M16 5.5 L17.8 15.2 L16 13.8 L14.2 15.2 Z" fill="#39FF14" />
    <path d="M16 26.5 L14.2 16.8 L16 18.2 L17.8 16.8 Z" fill="rgba(245,240,232,0.22)" />
    <circle cx="16" cy="16" r="2" fill="rgba(57,255,20,0.45)" />
  </svg>
)

export default function App() {
  const [view, setView] = useState('landing')
  const [selectedCard, setSelectedCard] = useState(null)
  const [spending, setSpending] = useState(DEFAULT_SPENDING)
  const [preferences, setPreferences] = useState(DEFAULT_PREFERENCES)

  // Track direction without causing re-renders
  const dirRef  = useRef(1)
  const viewRef = useRef('landing')

  const navigate = (newView, explicitDir) => {
    if (explicitDir !== undefined) {
      dirRef.current = explicitDir
    } else {
      const curr = VIEW_ORDER.indexOf(viewRef.current)
      const next = VIEW_ORDER.indexOf(newView)
      dirRef.current = next >= curr ? 1 : -1
    }
    viewRef.current = newView
    setView(newView)
  }

  const isLanding = view === 'landing'

  const handleSelectCard = (card) => {
    setSelectedCard(card)
    navigate('detail', 1)
  }

  const handleBack = () => navigate('recommendations', -1)

  const handleNavigate = (id) => {
    if (id === 'detail' && !selectedCard) return
    navigate(id)
  }

  const dir = dirRef.current

  return (
    <div className="app-shell">
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />

      <main className="main-content">
        <AnimatePresence>
          {!isLanding && (
            <motion.div
              className="app-header"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
            >
              <button
                className="home-btn"
                onClick={() => navigate('landing', -1)}
                aria-label="Back to home"
              >
                <CompassIcon />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="view-area">
          <AnimatePresence mode="wait" custom={dir}>

            {view === 'landing' && (
              <motion.div
                key="landing"
                style={{ height: '100%' }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={LANDING_EXIT}
                transition={PAGE_TRANSITION}
              >
                <Landing
                  onFindCard={() => navigate('preferences', 1)}
                  onBrowse={() => navigate('browse', 1)}
                />
              </motion.div>
            )}

            {view === 'preferences' && (
              <motion.div
                key="preferences"
                style={{ height: '100%' }}
                custom={dir}
                variants={PAGE_VARIANTS}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={PAGE_TRANSITION}
              >
                <Preferences
                  preferences={preferences}
                  onChange={setPreferences}
                  onContinue={() => navigate('profile', 1)}
                />
              </motion.div>
            )}

            {view === 'profile' && (
              <motion.div
                key="profile"
                style={{ height: '100%' }}
                custom={dir}
                variants={PAGE_VARIANTS}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={PAGE_TRANSITION}
              >
                <SpendingProfile
                  spending={spending}
                  onChange={setSpending}
                  onSubmit={() => navigate('recommendations', 1)}
                />
              </motion.div>
            )}

            {view === 'browse' && (
              <motion.div
                key="browse"
                style={{ height: '100%' }}
                custom={dir}
                variants={PAGE_VARIANTS}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={PAGE_TRANSITION}
              >
                <BrowseCards onSelectCard={handleSelectCard} />
              </motion.div>
            )}

            {view === 'recommendations' && (
              <motion.div
                key="recommendations"
                style={{ height: '100%' }}
                custom={dir}
                variants={PAGE_VARIANTS}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={PAGE_TRANSITION}
              >
                <Recommendations spending={spending} preferences={preferences} onSelectCard={handleSelectCard} />
              </motion.div>
            )}

            {view === 'detail' && (
              <motion.div
                key="detail"
                style={{ height: '100%' }}
                custom={dir}
                variants={PAGE_VARIANTS}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={PAGE_TRANSITION}
              >
                <CardDetail card={selectedCard} onBack={handleBack} />
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </main>

      <AnimatePresence>
        {!isLanding && (
          <motion.div
            key="nav"
            style={{ flexShrink: 0 }}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            transition={{ duration: 0.28, ease: [0.32, 0.72, 0, 1] }}
          >
            <Navigation
              view={view}
              onNavigate={handleNavigate}
              cardSelected={!!selectedCard}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
