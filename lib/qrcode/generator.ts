/**
 * QR Code Generator
 * Generates QR codes for microsite URLs
 */

import QRCode from 'qrcode'

export interface QRCodeOptions {
  width?: number
  margin?: number
  color?: {
    dark?: string
    light?: string
  }
}

/**
 * Generate QR code as data URL
 */
export async function generateQRCode(
  url: string,
  options: QRCodeOptions = {}
): Promise<string> {
  const {
    width = 300,
    margin = 2,
    color = {
      dark: '#000000',
      light: '#FFFFFF'
    }
  } = options

  try {
    const dataUrl = await QRCode.toDataURL(url, {
      width,
      margin,
      color,
      errorCorrectionLevel: 'M'
    })

    return dataUrl
  } catch (error) {
    console.error('Error generating QR code:', error)
    throw new Error('Failed to generate QR code')
  }
}

/**
 * Generate QR code and save to file system
 * Returns the file path
 */
export async function generateQRCodeFile(
  url: string,
  filePath: string,
  options: QRCodeOptions = {}
): Promise<string> {
  const {
    width = 300,
    margin = 2,
    color = {
      dark: '#000000',
      light: '#FFFFFF'
    }
  } = options

  try {
    await QRCode.toFile(filePath, url, {
      width,
      margin,
      color,
      errorCorrectionLevel: 'M'
    })

    return filePath
  } catch (error) {
    console.error('Error generating QR code file:', error)
    throw new Error('Failed to generate QR code file')
  }
}

/**
 * Generate QR code as SVG string
 */
export async function generateQRCodeSVG(
  url: string,
  options: QRCodeOptions = {}
): Promise<string> {
  const {
    width = 300,
    margin = 2,
    color = {
      dark: '#000000',
      light: '#FFFFFF'
    }
  } = options

  try {
    const svg = await QRCode.toString(url, {
      type: 'svg',
      width,
      margin,
      color,
      errorCorrectionLevel: 'M'
    })

    return svg
  } catch (error) {
    console.error('Error generating QR code SVG:', error)
    throw new Error('Failed to generate QR code SVG')
  }
}

