/**
 * Widget SDK Build Script
 *
 * Bundles the vanilla JS widget SDK into a single standalone file
 * that can be loaded via CDN or script tag.
 */

import * as esbuild from "esbuild"
import * as fs from "fs"
import * as path from "path"

const DIST_DIR = path.join(process.cwd(), "dist/widget")
const SRC_FILE = path.join(process.cwd(), "lib/widget-sdk/vanilla/embed.ts")

// Ensure dist directory exists
if (!fs.existsSync(DIST_DIR)) {
  fs.mkdirSync(DIST_DIR, { recursive: true })
}

async function build() {
  console.log("🔨 Building widget SDK...")

  try {
    // Build minified production bundle
    await esbuild.build({
      entryPoints: [SRC_FILE],
      bundle: true,
      minify: true,
      sourcemap: true,
      target: ["es2018"],
      format: "iife",
      globalName: "DailyEventWidget",
      outfile: path.join(DIST_DIR, "widget.min.js"),
      define: {
        "process.env.NODE_ENV": '"production"',
      },
      banner: {
        js: `/**
 * Daily Event Insurance Widget SDK v1.0.0
 * https://dailyevent.com
 * (c) ${new Date().getFullYear()} Daily Event Insurance
 */`,
      },
    })
    console.log("✅ Built widget.min.js")

    // Build unminified development bundle
    await esbuild.build({
      entryPoints: [SRC_FILE],
      bundle: true,
      minify: false,
      sourcemap: true,
      target: ["es2018"],
      format: "iife",
      globalName: "DailyEventWidget",
      outfile: path.join(DIST_DIR, "widget.js"),
      define: {
        "process.env.NODE_ENV": '"development"',
      },
      banner: {
        js: `/**
 * Daily Event Insurance Widget SDK v1.0.0 (Development Build)
 * https://dailyevent.com
 * (c) ${new Date().getFullYear()} Daily Event Insurance
 */`,
      },
    })
    console.log("✅ Built widget.js")

    // Build ESM module
    await esbuild.build({
      entryPoints: [SRC_FILE],
      bundle: true,
      minify: true,
      sourcemap: true,
      target: ["es2018"],
      format: "esm",
      outfile: path.join(DIST_DIR, "widget.esm.js"),
      define: {
        "process.env.NODE_ENV": '"production"',
      },
    })
    console.log("✅ Built widget.esm.js")

    // Build CommonJS module
    await esbuild.build({
      entryPoints: [SRC_FILE],
      bundle: true,
      minify: true,
      sourcemap: true,
      target: ["es2018"],
      format: "cjs",
      outfile: path.join(DIST_DIR, "widget.cjs.js"),
      define: {
        "process.env.NODE_ENV": '"production"',
      },
    })
    console.log("✅ Built widget.cjs.js")

    // Generate loader script
    const loaderScript = `
/**
 * Daily Event Insurance Widget Loader
 *
 * Async script loader for the widget SDK.
 * Usage: Add this script to your page, then call DailyEventWidget.init()
 */
(function(w, d, s, id, src) {
  var js, fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) return;
  js = d.createElement(s); js.id = id;
  js.src = src;
  js.async = true;
  fjs.parentNode.insertBefore(js, fjs);
}(window, document, 'script', 'dei-widget-sdk', 'https://cdn.dailyevent.com/widget/v1/widget.min.js'));
`.trim()

    fs.writeFileSync(path.join(DIST_DIR, "loader.js"), loaderScript)
    console.log("✅ Built loader.js")

    // Generate TypeScript declaration file
    const dtsContent = `
/**
 * Daily Event Insurance Widget SDK Type Definitions
 */

export type WidgetPosition = 'bottom-right' | 'bottom-left';
export type WidgetMode = 'floating' | 'inline' | 'modal';
export type CoverageType = 'liability' | 'equipment' | 'cancellation';

export interface WidgetTheme {
  primaryColor?: string;
  primaryHover?: string;
  textColor?: string;
  secondaryText?: string;
  backgroundColor?: string;
  borderColor?: string;
  successColor?: string;
  errorColor?: string;
  borderRadius?: string;
  fontFamily?: string;
}

export interface WidgetConfig {
  partnerId: string;
  primaryColor?: string;
  position?: WidgetPosition;
  mode?: WidgetMode;
  autoOpen?: boolean;
  container?: string | null;
  products?: CoverageType[];
  locale?: string;
  testMode?: boolean;
  testCards?: boolean;
  zIndex?: number;
  customButton?: boolean;
  theme?: WidgetTheme;
}

export interface Customer {
  email?: string;
  name?: string;
  phone?: string;
}

export interface EventDetails {
  eventType?: string;
  eventDate?: string;
  participants?: number;
  location?: string;
  duration?: number;
  metadata?: Record<string, unknown>;
}

export interface Quote {
  id: string;
  quoteNumber: string;
  eventType: string;
  eventDate: string;
  participants: number;
  coverageType: CoverageType;
  premium: string;
  currency: string;
  expiresAt: string;
}

export interface Policy {
  id: string;
  policyNumber: string;
  certificateUrl: string;
}

export interface WidgetError {
  code: string;
  message: string;
  details?: unknown;
}

export interface WidgetCallbacks {
  onReady?: (data: { widgetId: string }) => void;
  onOpen?: () => void;
  onClose?: () => void;
  onQuoteStart?: (data: { eventDetails: EventDetails }) => void;
  onQuoteComplete?: (quote: Quote) => void;
  onQuoteError?: (error: WidgetError) => void;
  onPaymentStart?: (data: { quoteId: string }) => void;
  onPolicyPurchased?: (policy: Policy) => void;
  onPaymentError?: (error: WidgetError) => void;
  onError?: (error: WidgetError) => void;
}

export interface WidgetOptions extends WidgetConfig, WidgetCallbacks {}

export interface OpenOptions {
  customer?: Customer;
  event?: EventDetails;
}

export interface WidgetInstance {
  open(options?: OpenOptions): void;
  close(): void;
  toggle(): void;
  setCustomer(customer: Customer): void;
  setEventDetails(details: EventDetails): void;
  setBulkEvents(events: Array<{ type: string; date: string; participants: number }>): void;
  destroy(): void;
  isOpen(): boolean;
  getConfig(): WidgetConfig;
}

export interface DailyEventWidgetAPI {
  init(options: WidgetOptions): WidgetInstance;
  open(options?: OpenOptions): void;
  close(): void;
  toggle(): void;
  setCustomer(customer: Customer): void;
  setEventDetails(details: EventDetails): void;
  setBulkEvents(events: Array<{ type: string; date: string; participants: number }>): void;
  destroy(): void;
  isOpen(): boolean;
  getInstance(): WidgetInstance | null;
}

declare global {
  interface Window {
    DailyEventWidget: DailyEventWidgetAPI;
  }
}

export default DailyEventWidgetAPI;
`.trim()

    fs.writeFileSync(path.join(DIST_DIR, "widget.d.ts"), dtsContent)
    console.log("✅ Built widget.d.ts")

    // Get file sizes
    const minSize = fs.statSync(path.join(DIST_DIR, "widget.min.js")).size
    const devSize = fs.statSync(path.join(DIST_DIR, "widget.js")).size

    console.log("\n📦 Bundle sizes:")
    console.log(`   widget.min.js: ${(minSize / 1024).toFixed(2)} KB`)
    console.log(`   widget.js: ${(devSize / 1024).toFixed(2)} KB`)
    console.log(`\n✨ Widget SDK built successfully!`)
    console.log(`   Output directory: ${DIST_DIR}`)

  } catch (error) {
    console.error("❌ Build failed:", error)
    process.exit(1)
  }
}

build()
