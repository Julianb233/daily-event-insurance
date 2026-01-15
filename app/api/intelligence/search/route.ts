
import { NextResponse } from 'next/server';
import axios from 'axios';
import { LeadScoringEngine, RawPlaceData } from '@/lib/intelligence/lead-intelligence';

const GOOGLE_API_KEY = process.env.GOOGLE_PLACES_API_KEY;

export async function POST(req: Request) {
    try {
        const { query } = await req.json();

        if (!query) {
            return NextResponse.json({ error: 'Search query is required' }, { status: 400 });
        }

        console.log(`[Intelligence Search] Scanning for: "${query}"`);

        let places: RawPlaceData[] = [];

        if (!GOOGLE_API_KEY) {
            console.warn('[Intelligence Search] No Google API key. Using Mock Data.');
            places = [
                {
                    name: "Iron Forge Gym",
                    formatted_address: "123 Main St, Austin, TX",
                    user_ratings_total: 450,
                    rating: 4.8,
                    place_id: "mock_1",
                    types: ["gym", "health"],
                    geometry: { location: { lat: 30.2672, lng: -97.7431 } }
                },
                {
                    name: "OrangeTheory Fitness Downtown",
                    formatted_address: "456 Side St, Austin, TX",
                    user_ratings_total: 1200,
                    rating: 4.9,
                    place_id: "mock_2",
                    types: ["gym"],
                    geometry: { location: { lat: 30.2672, lng: -97.7431 } }
                },
                {
                    name: "Planet Fitness South",
                    formatted_address: "789 Broadway, Austin, TX",
                    user_ratings_total: 800,
                    rating: 4.2,
                    place_id: "mock_4",
                    types: ["gym"],
                    geometry: { location: { lat: 30.2672, lng: -97.7431 } }
                },
                {
                    name: "Tiny Yoga",
                    formatted_address: "789 Quiet Ln, Austin, TX",
                    user_ratings_total: 20,
                    rating: 4.5,
                    place_id: "mock_3",
                    types: ["gym"],
                    geometry: { location: { lat: 30.2672, lng: -97.7431 } }
                },
            ];
        } else {
            const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query)}&key=${GOOGLE_API_KEY}`;
            const response = await axios.get(url);

            if (response.data.status !== 'OK' && response.data.status !== 'ZERO_RESULTS') {
                throw new Error(`Google API Error: ${response.data.status}`);
            }

            places = (response.data.results || []).map((p: any) => ({
                name: p.name,
                formatted_address: p.formatted_address,
                user_ratings_total: p.user_ratings_total || 0,
                rating: p.rating || 0,
                place_id: p.place_id,
                types: p.types || [],
                geometry: p.geometry || { location: { lat: 0, lng: 0 } }
            }));
        }

        // Process and score leads
        const scoredLeads = LeadScoringEngine.processResults(places);

        return NextResponse.json({
            success: true,
            count: scoredLeads.length,
            leads: scoredLeads,
            is_mock: !GOOGLE_API_KEY
        });

    } catch (error: any) {
        console.error('[Intelligence Search] Error:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
