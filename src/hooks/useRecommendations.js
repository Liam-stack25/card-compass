import { useMemo } from 'react'
import cards from '../data/cards.json'

function estimateBaseValue(card, spending) {
  const {
    food = 0, gas = 0, travel = 0,
    transit = 0, streaming = 0, entertainment = 0, other = 0,
  } = spending

  const rates = card.earnRates
  const cpp = card.pointValue?.estimatedCentsPerPoint ?? 1

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

function prefBonus(card, preferences) {
  if (!preferences) return 0
  const { priority, travelStyle, niceToHaves = [] } = preferences

  const isAeroplan   = card.rewardsProgram?.toLowerCase().includes('aeroplan')
  const hasLounge    = card.lounge?.included === true
  const noFxFee      = card.foreignTransactionFee === 0
  const hasHotelPerk = card.perks?.some((p) =>
    /status|hilton|marriott|ihg/i.test(p)
  )

  let bonus = 0

  if (priority === 'travel_perks') {
    if (travelStyle === 'air_canada') {
      if (isAeroplan) bonus += 200
      else if (hasLounge) bonus += 150
    } else if (hasLounge) {
      bonus += 100
    }
  }

  if (priority === 'simple_flexible') {
    if (noFxFee || card.rewardsType === 'cashback') bonus += 80
  }

  if (niceToHaves.includes('lounge_access')    && hasLounge)                      bonus += 100
  if (niceToHaves.includes('no_fx_fee')        && noFxFee)                        bonus += 100
  if (niceToHaves.includes('travel_insurance') && card.insurance?.travelMedical)  bonus += 80
  if (niceToHaves.includes('hotel_status')     && hasHotelPerk)                   bonus += 100
  if (niceToHaves.includes('family_benefits')  && (card.supplementaryFee ?? 999) < 50) bonus += 80

  return bonus
}

export function useRecommendations(spending, preferences) {
  return useMemo(() => {
    const isWelcomeMode = preferences?.priority === 'welcome_bonus'

    return cards
      .map((card) => {
        const netValue = estimateBaseValue(card, spending)
        const cpp      = card.pointValue?.estimatedCentsPerPoint ?? 1

        let score
        if (isWelcomeMode) {
          // Primary: welcome bonus dollar value — secondary: net annual value
          const bonusDollar = Math.round((card.welcomeBonus?.totalPotential ?? 0) * cpp / 100)
          score = bonusDollar * 10000 + netValue
        } else {
          score = netValue + prefBonus(card, preferences)
        }

        return { ...card, netValue, _score: score }
      })
      .sort((a, b) => b._score - a._score)
  }, [spending, preferences])
}
