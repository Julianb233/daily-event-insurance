/**
 * Test file to verify revenue calculator logic
 * Run with: node test-calculator-logic.js
 */

const OPT_IN_RATE = 0.65;

const commissionTiers = [
  { minVolume: 0, maxVolume: 999, percentage: 25, perParticipant: 10 },
  { minVolume: 1000, maxVolume: 2499, percentage: 27.5, perParticipant: 11 },
  { minVolume: 2500, maxVolume: 4999, percentage: 30, perParticipant: 12 },
  { minVolume: 5000, maxVolume: 9999, percentage: 32.5, perParticipant: 13 },
  { minVolume: 10000, maxVolume: 24999, percentage: 35, perParticipant: 14 },
  { minVolume: 25000, maxVolume: Infinity, percentage: 37.5, perParticipant: 15 },
];

const locationOptions = [
  { label: "1 Location", value: 1, bonus: 0 },
  { label: "2-5 Locations", value: 3, bonus: 0.5 },
  { label: "6-10 Locations", value: 8, bonus: 1 },
  { label: "11-25 Locations", value: 18, bonus: 1.5 },
  { label: "25+ Locations", value: 30, bonus: 2 },
];

function getCommissionTier(totalVolume) {
  return commissionTiers.find(tier =>
    totalVolume >= tier.minVolume && totalVolume <= tier.maxVolume
  ) || commissionTiers[0];
}

function calculateRevenue(monthlyVolume, locations) {
  const totalParticipants = monthlyVolume * locations;
  const optedInParticipants = Math.round(totalParticipants * OPT_IN_RATE);
  const commissionTier = getCommissionTier(totalParticipants);
  const locationOption = locationOptions.find(o => o.value === locations) || locationOptions[0];
  const effectivePerParticipant = commissionTier.perParticipant + locationOption.bonus;
  const monthlyRevenue = optedInParticipants * effectivePerParticipant;
  const annualRevenue = monthlyRevenue * 12;

  return {
    monthlyVolume,
    locations,
    totalParticipants,
    optedInParticipants,
    commissionTier: commissionTier.percentage,
    perParticipant: commissionTier.perParticipant,
    locationBonus: locationOption.bonus,
    effectivePerParticipant,
    monthlyRevenue,
    annualRevenue
  };
}

// Test cases
const testCases = [
  { monthlyVolume: 1000, locations: 1 },  // Small single location
  { monthlyVolume: 2500, locations: 1 },  // Default values
  { monthlyVolume: 5000, locations: 1 },  // Mid tier
  { monthlyVolume: 10000, locations: 1 }, // High tier
  { monthlyVolume: 2500, locations: 3 },  // Multi-location with bonus
  { monthlyVolume: 5000, locations: 8 },  // Larger multi-location
  { monthlyVolume: 1000, locations: 30 }, // Many locations, lower volume
];

console.log('Revenue Calculator Logic Tests\n');
console.log('='.repeat(80));

testCases.forEach((testCase, index) => {
  const result = calculateRevenue(testCase.monthlyVolume, testCase.locations);

  console.log(`\nTest ${index + 1}:`);
  console.log('-'.repeat(80));
  console.log(`Input: ${result.monthlyVolume.toLocaleString()} participants/month × ${result.locations} location(s)`);
  console.log(`Total Participants: ${result.totalParticipants.toLocaleString()}`);
  console.log(`Opt-in Rate: ${(OPT_IN_RATE * 100)}%`);
  console.log(`Opted-in Participants: ${result.optedInParticipants.toLocaleString()}`);
  console.log(`Commission Tier: ${result.commissionTier}%`);
  console.log(`Base Rate: $${result.perParticipant}/participant`);
  console.log(`Location Bonus: +$${result.locationBonus.toFixed(2)}/participant`);
  console.log(`Effective Rate: $${result.effectivePerParticipant.toFixed(2)}/participant`);
  console.log(`\nMONTHLY REVENUE: $${result.monthlyRevenue.toLocaleString()}`);
  console.log(`ANNUAL REVENUE: $${result.annualRevenue.toLocaleString()}`);
});

console.log('\n' + '='.repeat(80));
console.log('All calculations completed successfully!');

// Verify default state (what shows on initial load)
console.log('\n\nDEFAULT INITIAL STATE:');
console.log('-'.repeat(80));
const defaultResult = calculateRevenue(2500, 1);
console.log(`Monthly Volume: ${defaultResult.monthlyVolume}`);
console.log(`Locations: ${defaultResult.locations}`);
console.log(`Monthly Revenue: $${defaultResult.monthlyRevenue.toLocaleString()}`);
console.log(`Annual Revenue: $${defaultResult.annualRevenue.toLocaleString()}`);
console.log('\nThis should be the initial display value when the page loads.');
