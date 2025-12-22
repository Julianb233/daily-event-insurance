#!/usr/bin/env node
/**
 * Fetch AI Agent/Solution details from Notion database
 * Database ID: 247c283b-4ad9-80bf-b038-ec5f067aff88
 *
 * This script queries the Notion database and outputs the agent data
 * in a format that can be copied into the agentData object.
 */

const { Client } = require('@notionhq/client');

// Initialize Notion client
// You'll need to set NOTION_API_KEY environment variable
const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

const DATABASE_ID = '247c283b-4ad9-80bf-b038-ec5f067aff88';

async function fetchAgents() {
  try {
    console.log('Querying Notion database...\n');

    const response = await notion.databases.query({
      database_id: DATABASE_ID,
    });

    console.log(`Found ${response.results.length} agents\n`);
    console.log('='.repeat(80));

    response.results.forEach((page, index) => {
      console.log(`\nAgent ${index + 1}:`);
      console.log('-'.repeat(80));

      // Extract properties
      const properties = page.properties;

      // Common property extraction patterns
      const getName = (prop) => {
        if (prop?.title?.[0]?.plain_text) return prop.title[0].plain_text;
        if (prop?.rich_text?.[0]?.plain_text) return prop.rich_text[0].plain_text;
        return '';
      };

      const getRichText = (prop) => {
        if (prop?.rich_text) {
          return prop.rich_text.map(t => t.plain_text).join('');
        }
        return '';
      };

      const getUrl = (prop) => {
        if (prop?.url) return prop.url;
        return '';
      };

      // Display all properties
      console.log('\nProperties:');
      Object.keys(properties).forEach(key => {
        const prop = properties[key];
        let value = '';

        switch (prop.type) {
          case 'title':
            value = getName(prop);
            break;
          case 'rich_text':
            value = getRichText(prop);
            break;
          case 'url':
            value = getUrl(prop);
            break;
          case 'select':
            value = prop.select?.name || '';
            break;
          case 'multi_select':
            value = prop.multi_select?.map(s => s.name).join(', ') || '';
            break;
          default:
            value = JSON.stringify(prop);
        }

        if (value) {
          console.log(`  ${key}: ${value}`);
        }
      });

      console.log('\n' + '='.repeat(80));
    });

    // Output JSON format for easy copying
    console.log('\n\nJSON Format for agentData:');
    console.log('='.repeat(80));

    response.results.forEach(page => {
      const props = page.properties;

      // Try to extract common fields
      const extractField = (fieldNames) => {
        for (const name of fieldNames) {
          const prop = props[name];
          if (prop) {
            if (prop.title?.[0]?.plain_text) return prop.title[0].plain_text;
            if (prop.rich_text) return prop.rich_text.map(t => t.plain_text).join('');
            if (prop.url) return prop.url;
          }
        }
        return '';
      };

      const agentData = {
        name: extractField(['Name', 'Title', 'Agent Name']),
        tagline: extractField(['Tagline', 'Subtitle', 'One-liner']),
        description: extractField(['Description', 'Summary']),
        problemSolved: extractField(['Problem', 'Problem Solved', 'Pain Point']),
        howItWorks: extractField(['How It Works', 'Solution', 'How it works']),
        loomVideoUrl: extractField(['Loom Video', 'Video URL', 'Loom', 'Demo Video']),
      };

      console.log(JSON.stringify(agentData, null, 2));
      console.log(',');
    });

  } catch (error) {
    console.error('Error fetching from Notion:', error.message);
    console.error('\nMake sure you have:');
    console.error('1. Set NOTION_API_KEY environment variable');
    console.error('2. Given the integration access to the database');
    console.error('3. npm install @notionhq/client');
    process.exit(1);
  }
}

fetchAgents();
