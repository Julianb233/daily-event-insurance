import { NextRequest, NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

// GET - Fetch knowledge base entries
export async function GET(request: NextRequest) {
  try {
    if (!process.env.DATABASE_URL) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
    }

    const sql = neon(process.env.DATABASE_URL);
    const { searchParams } = new URL(request.url);
    const configId = searchParams.get('config_id');
    const category = searchParams.get('category');
    const entryType = searchParams.get('entry_type');

    // Build query with optional filters
    let result;
    if (configId && category && entryType) {
      result = await sql`
        SELECT * FROM knowledge_base
        WHERE is_active = true
          AND config_id = ${configId}
          AND category = ${category}
          AND entry_type = ${entryType}
        ORDER BY priority DESC, created_at DESC
      `;
    } else if (configId && category) {
      result = await sql`
        SELECT * FROM knowledge_base
        WHERE is_active = true
          AND config_id = ${configId}
          AND category = ${category}
        ORDER BY priority DESC, created_at DESC
      `;
    } else if (configId && entryType) {
      result = await sql`
        SELECT * FROM knowledge_base
        WHERE is_active = true
          AND config_id = ${configId}
          AND entry_type = ${entryType}
        ORDER BY priority DESC, created_at DESC
      `;
    } else if (configId) {
      result = await sql`
        SELECT * FROM knowledge_base
        WHERE is_active = true
          AND config_id = ${configId}
        ORDER BY priority DESC, created_at DESC
      `;
    } else if (category) {
      result = await sql`
        SELECT * FROM knowledge_base
        WHERE is_active = true
          AND category = ${category}
        ORDER BY priority DESC, created_at DESC
      `;
    } else if (entryType) {
      result = await sql`
        SELECT * FROM knowledge_base
        WHERE is_active = true
          AND entry_type = ${entryType}
        ORDER BY priority DESC, created_at DESC
      `;
    } else {
      result = await sql`
        SELECT * FROM knowledge_base
        WHERE is_active = true
        ORDER BY priority DESC, created_at DESC
      `;
    }

    return NextResponse.json(result || []);
  } catch (error) {
    console.error('Error fetching knowledge base:', error);
    return NextResponse.json(
      { error: 'Failed to fetch knowledge base' },
      { status: 500 }
    );
  }
}

// POST - Create new knowledge base entry
export async function POST(request: NextRequest) {
  try {
    if (!process.env.DATABASE_URL) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
    }

    const sql = neon(process.env.DATABASE_URL);
    const body = await request.json();

    const {
      config_id,
      entry_type = 'faq',
      question,
      answer,
      document_title,
      document_content,
      document_url,
      product_name,
      product_description,
      product_price,
      product_features,
      category,
      tags,
      search_keywords,
      priority = 0,
      created_by
    } = body;

    if (!config_id) {
      return NextResponse.json({ error: 'config_id is required' }, { status: 400 });
    }

    const result = await sql`
      INSERT INTO knowledge_base (
        config_id, entry_type, question, answer, document_title,
        document_content, document_url, product_name, product_description,
        product_price, product_features, category, tags, search_keywords,
        priority, created_by
      ) VALUES (
        ${config_id},
        ${entry_type},
        ${question || null},
        ${answer || null},
        ${document_title || null},
        ${document_content || null},
        ${document_url || null},
        ${product_name || null},
        ${product_description || null},
        ${product_price || null},
        ${product_features || null},
        ${category || null},
        ${tags || null},
        ${search_keywords || null},
        ${priority},
        ${created_by || null}
      )
      RETURNING *
    `;

    return NextResponse.json(result[0], { status: 201 });
  } catch (error) {
    console.error('Error creating knowledge base entry:', error);
    return NextResponse.json(
      { error: 'Failed to create knowledge base entry' },
      { status: 500 }
    );
  }
}

// PUT - Update knowledge base entry
export async function PUT(request: NextRequest) {
  try {
    if (!process.env.DATABASE_URL) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
    }

    const sql = neon(process.env.DATABASE_URL);
    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json({ error: 'Entry ID required' }, { status: 400 });
    }

    const result = await sql`
      UPDATE knowledge_base SET
        entry_type = COALESCE(${body.entry_type || null}, entry_type),
        question = ${body.question || null},
        answer = ${body.answer || null},
        document_title = ${body.document_title || null},
        document_content = ${body.document_content || null},
        document_url = ${body.document_url || null},
        product_name = ${body.product_name || null},
        product_description = ${body.product_description || null},
        product_price = ${body.product_price || null},
        product_features = ${body.product_features || null},
        category = ${body.category || null},
        tags = ${body.tags || null},
        search_keywords = ${body.search_keywords || null},
        priority = COALESCE(${body.priority}, priority),
        is_active = COALESCE(${body.is_active}, is_active),
        updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `;

    if (result.length === 0) {
      return NextResponse.json({ error: 'Entry not found' }, { status: 404 });
    }

    return NextResponse.json(result[0]);
  } catch (error) {
    console.error('Error updating knowledge base entry:', error);
    return NextResponse.json(
      { error: 'Failed to update knowledge base entry' },
      { status: 500 }
    );
  }
}

// DELETE - Delete knowledge base entry
export async function DELETE(request: NextRequest) {
  try {
    if (!process.env.DATABASE_URL) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
    }

    const sql = neon(process.env.DATABASE_URL);
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Entry ID required' }, { status: 400 });
    }

    await sql`DELETE FROM knowledge_base WHERE id = ${id}`;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting knowledge base entry:', error);
    return NextResponse.json(
      { error: 'Failed to delete knowledge base entry' },
      { status: 500 }
    );
  }
}
