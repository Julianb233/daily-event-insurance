import { describe, it, expect } from 'vitest'
import {
  DOCUMENT_TYPES,
  DocumentType,
  DocumentTemplate,
  demoDocuments,
  getDocumentByType,
  getDocumentTypesWithTitles,
} from '@/lib/demo-documents'

describe('Demo Documents', () => {
  describe('DOCUMENT_TYPES constant', () => {
    it('defines partner_agreement type', () => {
      expect(DOCUMENT_TYPES.PARTNER_AGREEMENT).toBe('partner_agreement')
    })

    it('defines w9 type', () => {
      expect(DOCUMENT_TYPES.W9).toBe('w9')
    })

    it('defines direct_deposit type', () => {
      expect(DOCUMENT_TYPES.DIRECT_DEPOSIT).toBe('direct_deposit')
    })

    it('has exactly 3 document types', () => {
      const types = Object.keys(DOCUMENT_TYPES)
      expect(types).toHaveLength(3)
      expect(types).toContain('PARTNER_AGREEMENT')
      expect(types).toContain('W9')
      expect(types).toContain('DIRECT_DEPOSIT')
    })

    it('values are readonly strings', () => {
      // TypeScript ensures these are readonly, but we verify the values are strings
      expect(typeof DOCUMENT_TYPES.PARTNER_AGREEMENT).toBe('string')
      expect(typeof DOCUMENT_TYPES.W9).toBe('string')
      expect(typeof DOCUMENT_TYPES.DIRECT_DEPOSIT).toBe('string')
    })
  })

  describe('demoDocuments array', () => {
    it('contains 3 documents', () => {
      expect(demoDocuments).toHaveLength(3)
    })

    it('each document has required properties', () => {
      demoDocuments.forEach((doc) => {
        expect(doc).toHaveProperty('type')
        expect(doc).toHaveProperty('title')
        expect(doc).toHaveProperty('content')
        expect(doc).toHaveProperty('version')
      })
    })

    it('each document has non-empty content', () => {
      demoDocuments.forEach((doc) => {
        expect(doc.content.length).toBeGreaterThan(0)
        expect(doc.title.length).toBeGreaterThan(0)
        expect(doc.version.length).toBeGreaterThan(0)
      })
    })

    it('contains Partner Agreement document', () => {
      const partnerDoc = demoDocuments.find(
        (doc) => doc.type === DOCUMENT_TYPES.PARTNER_AGREEMENT
      )
      expect(partnerDoc).toBeDefined()
      expect(partnerDoc?.title).toBe('Partner Agreement')
      expect(partnerDoc?.version).toBe('1.0')
    })

    it('contains W-9 document', () => {
      const w9Doc = demoDocuments.find(
        (doc) => doc.type === DOCUMENT_TYPES.W9
      )
      expect(w9Doc).toBeDefined()
      expect(w9Doc?.title).toBe('W-9 Tax Information')
      expect(w9Doc?.version).toBe('1.0')
    })

    it('contains Direct Deposit document', () => {
      const ddDoc = demoDocuments.find(
        (doc) => doc.type === DOCUMENT_TYPES.DIRECT_DEPOSIT
      )
      expect(ddDoc).toBeDefined()
      expect(ddDoc?.title).toBe('Direct Deposit Authorization')
      expect(ddDoc?.version).toBe('1.0')
    })

    it('Partner Agreement contains key sections', () => {
      const partnerDoc = demoDocuments.find(
        (doc) => doc.type === DOCUMENT_TYPES.PARTNER_AGREEMENT
      )
      expect(partnerDoc?.content).toContain('Partner Agreement')
      expect(partnerDoc?.content).toContain('Commission Structure')
      expect(partnerDoc?.content).toContain('Term and Termination')
      expect(partnerDoc?.content).toContain('Confidentiality')
    })

    it('W-9 document contains required tax form elements', () => {
      const w9Doc = demoDocuments.find(
        (doc) => doc.type === DOCUMENT_TYPES.W9
      )
      expect(w9Doc?.content).toContain('Taxpayer Identification Number')
      expect(w9Doc?.content).toContain('Certification')
      expect(w9Doc?.content).toContain('Social Security Number')
      expect(w9Doc?.content).toContain('Employer Identification Number')
    })

    it('Direct Deposit contains bank account fields', () => {
      const ddDoc = demoDocuments.find(
        (doc) => doc.type === DOCUMENT_TYPES.DIRECT_DEPOSIT
      )
      expect(ddDoc?.content).toContain('Bank Account Information')
      expect(ddDoc?.content).toContain('Routing Number')
      expect(ddDoc?.content).toContain('Account Number')
      expect(ddDoc?.content).toContain('Checking')
      expect(ddDoc?.content).toContain('Savings')
    })
  })

  describe('getDocumentByType', () => {
    it('returns Partner Agreement for partner_agreement type', () => {
      const doc = getDocumentByType(DOCUMENT_TYPES.PARTNER_AGREEMENT)
      expect(doc).toBeDefined()
      expect(doc?.type).toBe('partner_agreement')
      expect(doc?.title).toBe('Partner Agreement')
    })

    it('returns W-9 for w9 type', () => {
      const doc = getDocumentByType(DOCUMENT_TYPES.W9)
      expect(doc).toBeDefined()
      expect(doc?.type).toBe('w9')
      expect(doc?.title).toBe('W-9 Tax Information')
    })

    it('returns Direct Deposit for direct_deposit type', () => {
      const doc = getDocumentByType(DOCUMENT_TYPES.DIRECT_DEPOSIT)
      expect(doc).toBeDefined()
      expect(doc?.type).toBe('direct_deposit')
      expect(doc?.title).toBe('Direct Deposit Authorization')
    })

    it('returns undefined for unknown type', () => {
      const doc = getDocumentByType('unknown_type' as DocumentType)
      expect(doc).toBeUndefined()
    })

    it('returns undefined for empty string type', () => {
      const doc = getDocumentByType('' as DocumentType)
      expect(doc).toBeUndefined()
    })

    it('returns complete DocumentTemplate object', () => {
      const doc = getDocumentByType(DOCUMENT_TYPES.PARTNER_AGREEMENT)
      expect(doc).toMatchObject({
        type: 'partner_agreement',
        title: 'Partner Agreement',
        version: '1.0',
      })
      expect(doc?.content).toBeDefined()
      expect(typeof doc?.content).toBe('string')
    })
  })

  describe('getDocumentTypesWithTitles', () => {
    it('returns array with 3 items', () => {
      const result = getDocumentTypesWithTitles()
      expect(result).toHaveLength(3)
    })

    it('each item has type and title properties', () => {
      const result = getDocumentTypesWithTitles()
      result.forEach((item) => {
        expect(item).toHaveProperty('type')
        expect(item).toHaveProperty('title')
        expect(typeof item.type).toBe('string')
        expect(typeof item.title).toBe('string')
      })
    })

    it('includes Partner Agreement', () => {
      const result = getDocumentTypesWithTitles()
      const partnerItem = result.find(
        (item) => item.type === DOCUMENT_TYPES.PARTNER_AGREEMENT
      )
      expect(partnerItem).toBeDefined()
      expect(partnerItem?.title).toBe('Partner Agreement')
    })

    it('includes W-9', () => {
      const result = getDocumentTypesWithTitles()
      const w9Item = result.find((item) => item.type === DOCUMENT_TYPES.W9)
      expect(w9Item).toBeDefined()
      expect(w9Item?.title).toBe('W-9 Tax Information')
    })

    it('includes Direct Deposit', () => {
      const result = getDocumentTypesWithTitles()
      const ddItem = result.find(
        (item) => item.type === DOCUMENT_TYPES.DIRECT_DEPOSIT
      )
      expect(ddItem).toBeDefined()
      expect(ddItem?.title).toBe('Direct Deposit Authorization')
    })

    it('does not include content property', () => {
      const result = getDocumentTypesWithTitles()
      result.forEach((item) => {
        expect(item).not.toHaveProperty('content')
        expect(item).not.toHaveProperty('version')
      })
    })

    it('returns new array each call (not reference)', () => {
      const result1 = getDocumentTypesWithTitles()
      const result2 = getDocumentTypesWithTitles()
      expect(result1).not.toBe(result2)
      expect(result1).toEqual(result2)
    })

    it('maintains correct order from demoDocuments', () => {
      const result = getDocumentTypesWithTitles()
      expect(result[0].type).toBe(DOCUMENT_TYPES.PARTNER_AGREEMENT)
      expect(result[1].type).toBe(DOCUMENT_TYPES.W9)
      expect(result[2].type).toBe(DOCUMENT_TYPES.DIRECT_DEPOSIT)
    })
  })

  describe('Type Safety', () => {
    it('DocumentType union includes all types', () => {
      const validTypes: DocumentType[] = [
        'partner_agreement',
        'w9',
        'direct_deposit',
      ]
      validTypes.forEach((type) => {
        expect(typeof type).toBe('string')
      })
    })

    it('DocumentTemplate interface structure', () => {
      const template: DocumentTemplate = {
        type: 'partner_agreement',
        title: 'Test Title',
        content: 'Test Content',
        version: '1.0',
      }
      expect(template.type).toBeDefined()
      expect(template.title).toBeDefined()
      expect(template.content).toBeDefined()
      expect(template.version).toBeDefined()
    })
  })

  describe('Document Content Validation', () => {
    it('all documents use markdown formatting', () => {
      demoDocuments.forEach((doc) => {
        // Check for markdown headers
        expect(doc.content).toMatch(/^#/m)
      })
    })

    it('Partner Agreement has commission table', () => {
      const doc = getDocumentByType(DOCUMENT_TYPES.PARTNER_AGREEMENT)
      expect(doc?.content).toContain('| Monthly Volume | Commission Rate |')
      expect(doc?.content).toContain('40%')
      expect(doc?.content).toContain('55%')
    })

    it('documents contain signature sections', () => {
      demoDocuments.forEach((doc) => {
        expect(doc.content.toLowerCase()).toContain('sign')
      })
    })

    it('W-9 mentions IRS requirements', () => {
      const doc = getDocumentByType(DOCUMENT_TYPES.W9)
      expect(doc?.content).toContain('IRS')
      expect(doc?.content).toContain('irs.gov')
    })

    it('Direct Deposit specifies processing time', () => {
      const doc = getDocumentByType(DOCUMENT_TYPES.DIRECT_DEPOSIT)
      expect(doc?.content).toContain('15 business days')
    })
  })
})
