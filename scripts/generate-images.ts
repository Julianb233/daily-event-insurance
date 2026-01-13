#!/usr/bin/env tsx

import { GoogleGenerativeAI } from '@google/generative-ai';
import * as fs from 'fs';
import * as path from 'path';

const GOOGLE_API_KEY = process.env.GOOGLE_AI_STUDIO_KEY || '';

const genAI = new GoogleGenerativeAI(GOOGLE_API_KEY);

// Standard prefix for Sony A7IV aesthetic
const STANDARD_PREFIX = `Professional candid photography, Sony A7IV with GM 50mm f/1.2 lens,
shallow depth of field, natural lighting, authentic moment,
f/1.2 aperture bokeh, warm color grade, high resolution, photorealistic`;

// Image categories and prompts
export const partnerImages = [
  {
    filename: 'partner-gym.webp',
    prompt: `${STANDARD_PREFIX}, fitness center interior, woman in activewear mid-workout,
    genuine smile, gym equipment bokeh background, teal accent colors, morning natural light through windows`
  },
  {
    filename: 'partner-climbing.webp',
    prompt: `${STANDARD_PREFIX}, indoor climbing gym, climber on wall reaching for hold,
    belayer in foreground slightly blurred, chalk on hands, colorful holds bokeh,
    concentrated expression, safety harness visible`
  },
  {
    filename: 'partner-rentals.webp',
    prompt: `${STANDARD_PREFIX}, bike rental shop, staff member adjusting helmet on customer,
    genuine helpful interaction, row of bikes bokeh background, outdoor light through windows`
  },
  {
    filename: 'partner-adventure.webp',
    prompt: `${STANDARD_PREFIX}, zip line platform, participant in harness stepping off,
    guide's hands visible, forest canopy bokeh, moment of thrilling departure, safety equipment prominent`
  }
];

export const industryImages = [
  { filename: 'gyms-fitness.webp', prompt: `${STANDARD_PREFIX}, personal trainer helping client with weights, encouraging expression, modern gym interior bokeh` },
  { filename: 'rock-climbing.webp', prompt: `${STANDARD_PREFIX}, belayer watching climber ascend, trust moment, climbing wall texture bokeh` },
  { filename: 'ski-resorts.webp', prompt: `${STANDARD_PREFIX}, skier at lift ticket window, excitement and anticipation, snowy mountain resort bokeh` },
  { filename: 'skydiving.webp', prompt: `${STANDARD_PREFIX}, pre-jump gear check moment, instructor adjusting harness, airplane interior bokeh, nervous excitement` },
  { filename: 'equipment-rentals.webp', prompt: `${STANDARD_PREFIX}, staff helping customer fit bike helmet, outdoor rental shop, equipment bokeh` },
  { filename: 'water-sports.webp', prompt: `${STANDARD_PREFIX}, kayaker launching from dock, paddle in water, lake and mountains bokeh` },
  { filename: 'medispas.webp', prompt: `${STANDARD_PREFIX}, client consultation at medspa, relaxed atmosphere, clean modern interior bokeh` },
  { filename: 'wellness-recovery.webp', prompt: `${STANDARD_PREFIX}, person entering cryotherapy chamber, anticipation expression, wellness center bokeh` },
  { filename: 'race-directors.webp', prompt: `${STANDARD_PREFIX}, runner at race registration desk, receiving bib number, race expo bokeh background` },
  { filename: 'cycling-events.webp', prompt: `${STANDARD_PREFIX}, cyclist clipping into pedals, focused determination, other cyclists bokeh` },
  { filename: 'triathlons.webp', prompt: `${STANDARD_PREFIX}, triathlete in transition area, determination expression, bikes and gear bokeh` },
  { filename: 'obstacle-courses.webp', prompt: `${STANDARD_PREFIX}, participant climbing obstacle wall, mud and sweat, obstacle course bokeh` },
  { filename: 'marathons.webp', prompt: `${STANDARD_PREFIX}, runner crossing start line, crowd energy, race banners bokeh` },
  { filename: 'corporate-wellness.webp', prompt: `${STANDARD_PREFIX}, corporate team at finish line celebration, joy and accomplishment, event bokeh` },
  { filename: 'schools-universities.webp', prompt: `${STANDARD_PREFIX}, students at intramural sports signup table, campus recreation, university setting bokeh` }
];

async function generateImage(prompt: string, outputPath: string): Promise<void> {
  try {
    console.log(`Generating: ${path.basename(outputPath)}`);

    // Use Gemini with Imagen 3 model for image generation
    const model = genAI.getGenerativeModel({ model: 'imagen-3.0-generate-002' });

    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        responseModalities: ['image'],
      } as any,
    });

    const response = result.response;
    const imageData = response.candidates?.[0]?.content?.parts?.[0];

    if (imageData && 'inlineData' in imageData && imageData.inlineData) {
      const buffer = Buffer.from(imageData.inlineData.data, 'base64');
      fs.writeFileSync(outputPath, new Uint8Array(buffer));
      console.log(`✓ Saved: ${outputPath}`);
    } else {
      console.error(`✗ No image data for: ${outputPath}`);
    }
  } catch (error) {
    console.error(`✗ Error generating ${outputPath}:`, error);
  }
}

async function generateCategory(category: 'partners' | 'industries' | 'all'): Promise<void> {
  const imagesDir = path.join(process.cwd(), 'public', 'images');

  if (category === 'partners' || category === 'all') {
    const partnersDir = path.join(imagesDir, 'partners');
    fs.mkdirSync(partnersDir, { recursive: true });

    for (const img of partnerImages) {
      await generateImage(img.prompt, path.join(partnersDir, img.filename));
    }
  }

  if (category === 'industries' || category === 'all') {
    const industriesDir = path.join(imagesDir, 'industries');
    fs.mkdirSync(industriesDir, { recursive: true });

    for (const img of industryImages) {
      await generateImage(img.prompt, path.join(industriesDir, img.filename));
    }
  }
}

const category = process.argv[2] as 'partners' | 'industries' | 'all' || 'all';
generateCategory(category).then(() => console.log('Done!'));
