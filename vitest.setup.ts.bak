import '@testing-library/jest-dom'
import { vi } from 'vitest'
import * as nodeCrypto from 'crypto'

// Mock window.crypto for Node.js environment
if (typeof globalThis.crypto === 'undefined') {
  Object.defineProperty(globalThis, 'crypto', {
    value: {
      randomUUID: () => nodeCrypto.randomUUID(),
      getRandomValues: (arr: Uint8Array) => nodeCrypto.getRandomValues(arr),
    },
  })
}

// Mock postMessage for widget tests
vi.stubGlobal('postMessage', vi.fn())

// Mock iframe sandbox for jsdom (it doesn't fully support DOMTokenList.add)
const originalCreateElement = document.createElement.bind(document)
document.createElement = function (tagName: string, options?: ElementCreationOptions) {
  const element = originalCreateElement(tagName, options)
  if (tagName.toLowerCase() === 'iframe') {
    // Mock the sandbox property with a working DOMTokenList-like object
    const sandboxValues = new Set<string>()
    Object.defineProperty(element, 'sandbox', {
      value: {
        add: (...tokens: string[]) => tokens.forEach(t => sandboxValues.add(t)),
        remove: (...tokens: string[]) => tokens.forEach(t => sandboxValues.delete(t)),
        contains: (token: string) => sandboxValues.has(token),
        toString: () => Array.from(sandboxValues).join(' '),
        get length() { return sandboxValues.size },
        item: (index: number) => Array.from(sandboxValues)[index] || null,
        [Symbol.iterator]: () => sandboxValues.values(),
      },
      writable: true,
      configurable: true,
    })
  }
  return element
}
