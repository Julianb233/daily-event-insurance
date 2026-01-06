
import fs from 'fs';
import path from 'path';
import { glob } from 'glob';

const DOCS_DIR = path.join(process.cwd(), 'docs');
const OUTPUT_FILE = path.join(process.cwd(), 'lib/rag/knowledge-base.json');

async function updateKnowledgeBase() {
    console.log('🔍 Scanning documentation...');

    // Find all markdown files in docs
    const files = await glob('**/*.md', { cwd: DOCS_DIR });

    console.log(`Found ${files.length} documents.`);

    const knowledgeBase = [];

    for (const file of files) {
        const filePath = path.join(DOCS_DIR, file);
        const content = fs.readFileSync(filePath, 'utf-8');

        // Simple parsing - just take the whole file for now
        // In the future, we could split by headers
        knowledgeBase.push({
            id: file,
            content: content,
            metadata: {
                source: `docs/${file}`,
                type: 'documentation'
            }
        });
    }

    // Also scan for 'page.tsx' files that might contain static text key info
    // For now, let's stick to docs as they seem to contain the "Training" info

    console.log(`💾 Writing ${knowledgeBase.length} entries to knowledge base...`);

    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(knowledgeBase, null, 2));

    console.log('✅ Knowledge base updated successfully!');
}

updateKnowledgeBase().catch(console.error);
