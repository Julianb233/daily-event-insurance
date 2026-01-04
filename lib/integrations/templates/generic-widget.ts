/**
 * Generic Widget Embed Template
 *
 * Universal embed code that works with any website platform.
 * Provides iframe, JavaScript snippet, and popup options.
 */

export const genericWidgetTemplate = {
  name: "Website Widget",
  slug: "generic-widget",
  category: "embed",
  description: "Universal embed code for any website",
  supportedFeatures: [
    "Iframe embed",
    "JavaScript widget",
    "Popup/modal integration",
    "Custom styling support",
    "Mobile responsive",
    "Analytics tracking"
  ],

  setupSteps: [
    {
      step: 1,
      title: "Choose Your Integration Method",
      instructions: `Select the best option for your website:

**Option A: Iframe Embed** (Easiest)
- Works everywhere HTML is supported
- Simple copy-paste integration
- Fully responsive

**Option B: JavaScript Widget** (More Control)
- Dynamic loading
- Can be triggered on events
- Smaller initial footprint

**Option C: Popup/Modal** (Best for UX)
- Opens in overlay
- Great for checkout flows
- Doesn't leave your site`,
      screenshot: "/images/integrations/widget-options.png"
    },
    {
      step: 2,
      title: "Copy and Paste the Code",
      instructions: `1. Copy the embed code for your chosen method
2. Paste it into your website where you want the insurance option to appear
3. Common locations:
   - Checkout page
   - Booking confirmation
   - Product pages
   - Footer or sidebar`,
      requiresInput: false
    },
    {
      step: 3,
      title: "Customize the Appearance",
      instructions: `The widget automatically adapts to your site, but you can customize:
- Button text and colors
- Widget size and position
- Popup behavior
- Pre-filled customer information`
    }
  ],

  webhookEndpoint: (partnerId: string) =>
    `https://dailyeventinsurance.com/api/webhooks/widget/${partnerId}`,

  codeSnippets: {
    iframeEmbed: (partnerId: string, options?: { width?: string; height?: string; theme?: string }) => `
<!-- Daily Event Insurance Widget - Iframe Embed -->
<iframe
  src="https://dailyeventinsurance.com/embed/${partnerId}${options?.theme ? `?theme=${options.theme}` : ''}"
  width="${options?.width || '100%'}"
  height="${options?.height || '300'}"
  frameborder="0"
  scrolling="no"
  style="border: none; border-radius: 12px; max-width: 500px;"
  title="Daily Event Insurance"
></iframe>`,

    javascriptWidget: (partnerId: string) => `
<!-- Daily Event Insurance Widget - JavaScript -->
<div id="dei-insurance-widget"></div>
<script>
(function() {
  var script = document.createElement('script');
  script.src = 'https://dailyeventinsurance.com/widget.js';
  script.async = true;
  script.onload = function() {
    DailyEventInsurance.init({
      partnerId: '${partnerId}',
      container: '#dei-insurance-widget',
      theme: 'auto', // 'light', 'dark', or 'auto'
      onPurchase: function(policy) {
        console.log('Insurance purchased:', policy);
        // Handle successful purchase
      },
      onClose: function() {
        console.log('Widget closed');
      }
    });
  };
  document.body.appendChild(script);
})();
</script>`,

    popupWidget: (partnerId: string) => `
<!-- Daily Event Insurance Widget - Popup Trigger -->
<button
  onclick="openDailyEventInsurance()"
  style="
    background: linear-gradient(135deg, #14b8a6 0%, #0d9488 100%);
    color: white;
    border: none;
    padding: 12px 24px;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 8px;
  "
>
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
  Get Event Insurance
</button>

<script>
function openDailyEventInsurance() {
  var width = 500;
  var height = 700;
  var left = (screen.width - width) / 2;
  var top = (screen.height - height) / 2;

  window.open(
    'https://dailyeventinsurance.com/embed/${partnerId}?popup=true',
    'DailyEventInsurance',
    'width=' + width + ',height=' + height + ',left=' + left + ',top=' + top + ',scrollbars=yes'
  );
}
</script>`,

    reactComponent: (partnerId: string) => `
// Daily Event Insurance React Component
import { useEffect, useRef, useState } from 'react';

interface InsuranceWidgetProps {
  partnerId?: string;
  customerEmail?: string;
  eventDate?: string;
  onPurchase?: (policy: any) => void;
}

export function InsuranceWidget({
  partnerId = '${partnerId}',
  customerEmail,
  eventDate,
  onPurchase
}: InsuranceWidgetProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Listen for messages from iframe
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== 'https://dailyeventinsurance.com') return;

      if (event.data.type === 'DEI_PURCHASE_COMPLETE' && onPurchase) {
        onPurchase(event.data.policy);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [onPurchase]);

  // Build URL with pre-filled data
  const params = new URLSearchParams();
  if (customerEmail) params.set('email', customerEmail);
  if (eventDate) params.set('date', eventDate);

  const src = \`https://dailyeventinsurance.com/embed/\${partnerId}?\${params.toString()}\`;

  return (
    <div className="dei-widget-container" style={{ position: 'relative' }}>
      {!loaded && (
        <div style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#f9fafb',
          borderRadius: '12px'
        }}>
          Loading...
        </div>
      )}
      <iframe
        ref={iframeRef}
        src={src}
        width="100%"
        height="300"
        frameBorder="0"
        onLoad={() => setLoaded(true)}
        style={{
          border: 'none',
          borderRadius: '12px',
          opacity: loaded ? 1 : 0,
          transition: 'opacity 0.3s'
        }}
        title="Daily Event Insurance"
      />
    </div>
  );
}`,

    vueComponent: (partnerId: string) => `
<!-- Daily Event Insurance Vue Component -->
<template>
  <div class="dei-widget-container">
    <div v-if="!loaded" class="loading-state">
      Loading insurance options...
    </div>
    <iframe
      :src="iframeSrc"
      width="100%"
      height="300"
      frameborder="0"
      @load="loaded = true"
      :style="{ opacity: loaded ? 1 : 0 }"
      title="Daily Event Insurance"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';

const props = defineProps({
  partnerId: { type: String, default: '${partnerId}' },
  customerEmail: String,
  eventDate: String
});

const emit = defineEmits(['purchase']);

const loaded = ref(false);

const iframeSrc = computed(() => {
  const params = new URLSearchParams();
  if (props.customerEmail) params.set('email', props.customerEmail);
  if (props.eventDate) params.set('date', props.eventDate);
  return \`https://dailyeventinsurance.com/embed/\${props.partnerId}?\${params.toString()}\`;
});

const handleMessage = (event) => {
  if (event.origin !== 'https://dailyeventinsurance.com') return;
  if (event.data.type === 'DEI_PURCHASE_COMPLETE') {
    emit('purchase', event.data.policy);
  }
};

onMounted(() => window.addEventListener('message', handleMessage));
onUnmounted(() => window.removeEventListener('message', handleMessage));
</script>

<style scoped>
.dei-widget-container {
  position: relative;
}
.loading-state {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f9fafb;
  border-radius: 12px;
}
iframe {
  border: none;
  border-radius: 12px;
  transition: opacity 0.3s;
}
</style>`,

    htmlLinkButton: (partnerId: string) => `
<!-- Simple Link Button - Works Anywhere -->
<a
  href="https://dailyeventinsurance.com/p/${partnerId}"
  target="_blank"
  rel="noopener noreferrer"
  style="
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: linear-gradient(135deg, #14b8a6, #0d9488);
    color: white;
    padding: 12px 24px;
    border-radius: 8px;
    text-decoration: none;
    font-weight: 600;
    box-shadow: 0 2px 8px rgba(20, 184, 166, 0.3);
    transition: transform 0.2s, box-shadow 0.2s;
  "
  onmouseover="this.style.transform='translateY(-2px)';this.style.boxShadow='0 4px 12px rgba(20, 184, 166, 0.4)'"
  onmouseout="this.style.transform='none';this.style.boxShadow='0 2px 8px rgba(20, 184, 166, 0.3)'"
>
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
  Get Event Insurance - $15
</a>`
  },

  customization: {
    themes: ["light", "dark", "auto"],
    colors: {
      primary: "#14b8a6",
      background: "#ffffff",
      text: "#111827"
    },
    sizes: {
      small: { width: "300px", height: "200px" },
      medium: { width: "400px", height: "280px" },
      large: { width: "100%", height: "350px" }
    }
  },

  apiReference: {
    baseUrl: "https://dailyeventinsurance.com",
    authentication: "Partner ID in embed URL or data attribute",
    documentation: "https://dailyeventinsurance.com/docs/widget",
    requiredScopes: []
  },

  troubleshooting: [
    {
      issue: "Widget not loading",
      solution: "Check that your website allows iframes from dailyeventinsurance.com. Some security headers (CSP) may block embedded content."
    },
    {
      issue: "Widget too small or cut off",
      solution: "Remove any container constraints. The widget is responsive but needs at least 300px width. Check for CSS overflow: hidden on parent elements."
    },
    {
      issue: "Popup blocked by browser",
      solution: "Popups must be triggered by direct user interaction (click). Move the window.open() call inside a click handler, not on page load."
    },
    {
      issue: "Styling conflicts with my site",
      solution: "The iframe embed is fully isolated. For JavaScript widget, use the 'isolated' option to prevent CSS leakage. Custom themes can be configured via options."
    }
  ]
}

export type GenericWidgetTemplate = typeof genericWidgetTemplate

// Helper function to generate embed code
export function generateEmbedCode(
  partnerId: string,
  method: "iframe" | "javascript" | "popup" | "react" | "vue" | "link",
  options?: {
    width?: string
    height?: string
    theme?: "light" | "dark" | "auto"
  }
): string {
  switch (method) {
    case "iframe":
      return genericWidgetTemplate.codeSnippets.iframeEmbed(partnerId, options)
    case "javascript":
      return genericWidgetTemplate.codeSnippets.javascriptWidget(partnerId)
    case "popup":
      return genericWidgetTemplate.codeSnippets.popupWidget(partnerId)
    case "react":
      return genericWidgetTemplate.codeSnippets.reactComponent(partnerId)
    case "vue":
      return genericWidgetTemplate.codeSnippets.vueComponent(partnerId)
    case "link":
      return genericWidgetTemplate.codeSnippets.htmlLinkButton(partnerId)
    default:
      return genericWidgetTemplate.codeSnippets.iframeEmbed(partnerId, options)
  }
}
