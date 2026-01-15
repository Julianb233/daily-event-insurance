// Lead Intelligence - Stub for Google Places lead scoring
// TODO: Implement full lead scoring logic

export interface RawPlaceData {
  name: string
  formatted_address: string
  user_ratings_total: number
  rating: number
  place_id: string
  types: string[]
  geometry: {
    location: {
      lat: number
      lng: number
    }
  }
}

export interface ScoredLead extends RawPlaceData {
  score: number
  tier: 'high' | 'medium' | 'low'
  signals: string[]
}

export class LeadScoringEngine {
  static processResults(places: RawPlaceData[]): ScoredLead[] {
    return places.map((place) => {
      // Simple scoring based on reviews and rating
      let score = 0
      const signals: string[] = []

      // High review count = established business
      if (place.user_ratings_total > 500) {
        score += 40
        signals.push('High review count')
      } else if (place.user_ratings_total > 100) {
        score += 25
        signals.push('Medium review count')
      } else {
        score += 10
        signals.push('Low review count')
      }

      // High rating = quality business
      if (place.rating >= 4.5) {
        score += 30
        signals.push('Excellent rating')
      } else if (place.rating >= 4.0) {
        score += 20
        signals.push('Good rating')
      } else {
        score += 10
        signals.push('Average rating')
      }

      // Business type bonus
      const gymTypes = ['gym', 'health', 'fitness_center', 'spa']
      const hasGymType = place.types.some((t) => gymTypes.includes(t.toLowerCase()))
      if (hasGymType) {
        score += 20
        signals.push('Fitness business type')
      }

      // Determine tier
      let tier: 'high' | 'medium' | 'low' = 'low'
      if (score >= 70) tier = 'high'
      else if (score >= 50) tier = 'medium'

      return {
        ...place,
        score,
        tier,
        signals,
      }
    }).sort((a, b) => b.score - a.score)
  }
}
