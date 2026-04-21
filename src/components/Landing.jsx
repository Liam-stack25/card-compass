import { motion } from 'framer-motion'

function CardStack() {
  return (
    <div className="lstack">
      <div className="lcard lcard-back">
        <div className="lcard-chip" />
      </div>
      <div className="lcard lcard-mid">
        <div className="lcard-chip" />
        <div className="lcard-brand">
          <div className="lcard-circle lc-a" />
          <div className="lcard-circle lc-b" />
        </div>
      </div>
      <div className="lcard lcard-front">
        <div className="lcard-chip lcard-chip-neon" />
        <div className="lcard-number">
          {[0, 1, 2, 3].map((g) => (
            <span key={g} className="lcard-group">
              {[0, 1, 2, 3].map((d) => (
                <span key={d} className="lcard-dot" />
              ))}
            </span>
          ))}
        </div>
        <div className="lcard-brand">
          <div className="lcard-circle lc-a lc-neon-a" />
          <div className="lcard-circle lc-b lc-neon-b" />
        </div>
      </div>
    </div>
  )
}

const wordmarkAnim = {
  hidden: { opacity: 0 },
  show:   { opacity: 1, transition: { duration: 0.4, delay: 0.05 } },
}

const stackAnim = {
  hidden: { opacity: 0, y: 24 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.65, delay: 0.18, ease: [0.22, 1, 0.36, 1] } },
}

const contentStagger = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.1, delayChildren: 0.42 } },
}

const rise = {
  hidden: { opacity: 0, y: 18 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.48, ease: [0.22, 1, 0.36, 1] } },
}

export default function Landing({ onFindCard, onBrowse }) {
  return (
    <div className="landing-shell">

      {/* ① Top bar — wordmark only, flex: 0 */}
      <motion.div
        className="landing-top"
        variants={wordmarkAnim}
        initial="hidden"
        animate="show"
      >
        <span className="landing-wordmark">Card Compass</span>
      </motion.div>

      {/* ② Middle — illustration centered, flex: 1, max-height: 45vh */}
      <motion.div
        className="landing-middle"
        variants={stackAnim}
        initial="hidden"
        animate="show"
      >
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        >
          <CardStack />
        </motion.div>
      </motion.div>

      {/* ③ Bottom — heading + tagline + both buttons, gap: 12px, flex: 0 */}
      <motion.div
        className="landing-bottom"
        variants={contentStagger}
        initial="hidden"
        animate="show"
      >
        <motion.h1 className="landing-title" variants={rise}>
          Card<br />Compass
        </motion.h1>

        <motion.p className="landing-tagline" variants={rise}>
          Find the card that works hardest for you
        </motion.p>

        <motion.button
          className="cta-button"
          variants={rise}
          onClick={onFindCard}
          whileTap={{ scale: 0.97 }}
        >
          Find My Card
        </motion.button>

        <motion.button
          className="cta-ghost-button"
          variants={rise}
          onClick={onBrowse}
          whileTap={{ scale: 0.97 }}
        >
          Browse Cards
        </motion.button>
      </motion.div>

    </div>
  )
}
