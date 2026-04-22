import { useMemo } from 'react'
import cards from '../data/cards.json'

// When travelStyle === 'air_canada', Aeroplan points are worth significantly more
// than generic redemptions (premium AC cabin flights → ~2.5× stated cpp).
const AEROPLAN_AIR_CANADA_CPP_MULTIPLIER = 2.5

export function estimateBaseValue(card, spending, cppOverride) {
  const {
    food = 0, gas = 0, travel = 0,
    transit = 0, streaming = 0, entertainment = 0, other = 0,
  } = spending

  const rates = card.earnRates
  const cpp = cppOverride ?? card.pointValue?.estimatedCentsPerPoint ?? 1

  const groceryRate = rates.groceries ?? rates.other ?? 1
  const diningRate  = rates.dining ?? rates.bar ?? rates.other ?? 1
  const foodRate    = Math.max(groceryRate, diningRate)

  const annualEarn = (
    foodRate * food +
    (rates.gas           ?? rates.other ?? 1) * gas +
    (rates.travel        ?? rates.other ?? 1) * travel +
    (rates.transit       ?? rates.other ?? 1) * transit +
    (rates.streaming     ?? rates.other ?? 1) * streaming +
    (rates.entertainment ?? rates.other ?? 1) * entertainment +
    (rates.other         ?? 1) * other
  ) * 12 * (cpp / 100)

  const credits = (card.credits ?? []).reduce((s, c) => s + c.amount, 0)
  return Math.round(annualEarn + credits - card.annualFee)
}

export function useRecommendations(spending, preferences) {
  return useMemo(() => {
    const { priority, travelStyle, niceToHaves = [] } = preferences || {}

    const isWelcomeMode  = priority === 'welcome_bonus'
    const isAirCanada    = travelStyle === 'air_canada'
    const wantsLounge    = niceToHaves.includes('lounge_access')
    const wantsNoFx      = niceToHaves.includes('no_fx_fee')
    const wantsInsurance = niceToHaves.includes('travel_insurance')
    const wantsHotel     = niceToHaves.includes('hotel_status')
    const wantsFamily    = niceToHaves.includes('family_benefits')

    console.group('[CardCompass] Recommendation scores')
    console.log('Preferences:', { priority, travelStyle, niceToHaves })
    console.log('Spending:', spending)

    const scored = cards.map((card) => {
      const isAeroplan = card.rewardsProgram === 'Aeroplan'
      const hasLounge  = card.lounge?.included === true
      const noFxFee    = card.foreignTransactionFee === 0
      const hasHotel   = card.perks?.some((p) => /status|hilton|marriott|ihg/i.test(p))

      // Boost effective CPP for Aeroplan cards when user flies Air Canada —
      // premium cabin redemptions yield ~2.5× the base stated rate.
      const cppOverride = (isAeroplan && isAirCanada)
        ? (card.pointValue?.estimatedCentsPerPoint ?? 1) * AEROPLAN_AIR_CANADA_CPP_MULTIPLIER
        : undefined

      const netValue = estimateBaseValue(card, spending, cppOverride)

      let score
      const appliedBoosts = []

      if (isWelcomeMode) {
        const cpp         = card.pointValue?.estimatedCentsPerPoint ?? 1
        const bonusDollar = Math.round((card.welcomeBonus?.totalPotential ?? 0) * cpp / 100)
        score = bonusDollar * 10_000 + netValue
        appliedBoosts.push(`welcomeBonus=$${bonusDollar}`)
      } else {
        // Multipliers stack multiplicatively — a card matching multiple criteria
        // ranks significantly higher than one matching only one.
        let multiplier = 1.0

        if (isAirCanada && isAeroplan) {
          multiplier *= 1.4
          appliedBoosts.push(`Aeroplan/AirCanada×1.4 (cpp boosted ×${AEROPLAN_AIR_CANADA_CPP_MULTIPLIER})`)
        }

        if (wantsLounge && hasLounge) {
          multiplier *= 1.4
          appliedBoosts.push('lounge×1.4')
        }

        if (wantsNoFx && noFxFee) {
          multiplier *= 1.2
          appliedBoosts.push('noFx×1.2')
        }

        if (wantsInsurance && card.insurance?.travelMedical) {
          multiplier *= 1.1
          appliedBoosts.push('insurance×1.1')
        }

        if (wantsHotel && hasHotel) {
          multiplier *= 1.1
          appliedBoosts.push('hotel×1.1')
        }

        if (wantsFamily && (card.supplementaryFee ?? 999) < 50) {
          multiplier *= 1.1
          appliedBoosts.push('family×1.1')
        }

        score = Math.round(netValue * multiplier)
      }

      console.log(
        `  ${card.id.padEnd(44)}`,
        `netValue=$${String(netValue).padStart(5)}`,
        `→ score=${String(score).padStart(5)}`,
        appliedBoosts.length ? `[ ${appliedBoosts.join(' | ')} ]` : '',
      )

      return { ...card, netValue, _score: score }
    })

    console.groupEnd()

    return scored.sort((a, b) => b._score - a._score)
  }, [spending, preferences])
}
