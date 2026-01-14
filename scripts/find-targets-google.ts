import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

// --- Configuration ---
const GOOGLE_API_KEY = process.env.GOOGLE_PLACES_API_KEY || "YOUR_API_KEY_HERE";
const SEARCH_QUERY = process.argv[2] || "Gyms in Austin, TX";
const MIN_REVIEWS = 50;

// --- Types ---
interface GooglePlace {
    name: string;
    formatted_address: string;
    user_ratings_total: number; // Proxy for foot traffic
    rating: number;
    place_id: string;
    website?: string; // Requires Place Details call usually, assuming accessible or mocked
}

interface EnrichedTarget {
    name: string;
    address: string;
    traffic_score: number;
    opportunity_type: 'whale' | 'quick_win' | 'low_value';
    potential_revenue: number;
    notes: string;
}

// --- Logic ---

/**
 * 1. Scoring Formula (Traffic)
 * Google Reviews * 1.5 = Estimated Traffic Score (Rough Proxy)
 */
function calculateTrafficScore(reviews: number): number {
    return Math.round(reviews * 1.5);
}

/**
 * 2. Opportunity Matrix (Classification)
 * Simulates Tech Stack check. In real app, we ping BuiltWith.
 */
function classifyTarget(trafficScore: number, hasWebsite: boolean): EnrichedTarget['opportunity_type'] {
    if (trafficScore < 100) return 'low_value';

    // Heuristic: No website usually means high tech debt = Whale Opportunity
    if (!hasWebsite) {
        return 'whale';
    }

    // Heuristic: If they have a website, we assume they MIGHT define as Quick Win
    // (In reality, we'd check if `tech_stack` includes Mindbody)
    return 'quick_win';
}

/**
 * 3. Revenue Estimator
 * Traffic Score * $5.00 * 12 months (Very rough estimation)
 */
function estimateRevenue(trafficScore: number): number {
    return trafficScore * 5 * 12;
}

async function main() {
    console.log(`\n🔍 Lead Intelligence Scan: "${SEARCH_QUERY}"\n-----------------------------------`);

    // MOCK DATA MODE (If no API Key)
    if (GOOGLE_API_KEY === "YOUR_API_KEY_HERE") {
        console.warn("⚠️ No GOOGLE_PLACES_API_KEY found in .env.local. Using MOCK DATA.");
        const mockResults: GooglePlace[] = [
            { name: "Iron Forge Gym", formatted_address: "123 Main St", user_ratings_total: 450, rating: 4.8, place_id: "1", website: "ironforge.com" },
            { name: "Old School Barbell", formatted_address: "456 Side St", user_ratings_total: 1200, rating: 4.9, place_id: "2" }, // No website
            { name: "Tiny Yoga", formatted_address: "789 Quiet Ln", user_ratings_total: 20, rating: 4.5, place_id: "3", website: "tinyyoga.com" },
        ];
        processResults(mockResults);
        return;
    }

    try {
        // Real API Call
        const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(SEARCH_QUERY)}&key=${GOOGLE_API_KEY}`;
        const response = await axios.get(url);

        if (response.data.status !== 'OK') {
            console.error(`API Error: ${response.data.status} - ${response.data.error_message}`);
            return;
        }

        const places: GooglePlace[] = response.data.results;
        processResults(places);

    } catch (error: any) {
        console.error("Network Error:", error.message);
    }
}

function processResults(places: GooglePlace[]) {
    const targets: EnrichedTarget[] = places.map((place) => {
        const trafficScore = calculateTrafficScore(place.user_ratings_total || 0);
        // Simulate "No website" if mock data didn't have it, or real API didn't return (TextSearch doesn't always return website)
        const hasWebsite = !!place.website;

        const opportunity = classifyTarget(trafficScore, hasWebsite);

        return {
            name: place.name,
            address: place.formatted_address,
            traffic_score: trafficScore,
            opportunity_type: opportunity,
            potential_revenue: estimateRevenue(trafficScore),
            notes: hasWebsite ? "Website Detected" : "NO WEBSITE (Whale Signal)"
        };
    }).sort((a, b) => b.traffic_score - a.traffic_score); // Sort by highest traffic

    console.table(targets.map(t => ({
        Name: t.name,
        'Traffic (Est)': t.traffic_score,
        'Opp Type': t.opportunity_type.toUpperCase(),
        'Est. Revenue': `$${t.potential_revenue.toLocaleString()}`,
        'Notes': t.notes
    })));

    console.log(`\n✅ Scan Complete. Found ${targets.length} targets.`);
    console.log(`🐳 Whale Opportunities identified: ${targets.filter(t => t.opportunity_type === 'whale').length}`);
}

main();
