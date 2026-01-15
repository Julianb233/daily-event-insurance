"use client"

import { motion } from "framer-motion"
import { GlassCard } from "@/components/support-hub/GlassCard"
import { Breadcrumbs } from "@/components/support-hub/Breadcrumbs"
import { Bug, Monitor, Smartphone, Palette, CheckCircle, XCircle, Code } from "lucide-react"

const widgetIssues = [
  {
    issue: "Widget Not Loading",
    icon: Monitor,
    symptoms: ["Blank space where widget should be", "Console errors", "Infinite loading spinner"],
    solutions: [
      "Verify script tag is in <head> or before closing </body>",
      "Check API key is valid and for correct environment",
      "Ensure domain is whitelisted in dashboard",
      "Clear browser cache and hard reload (Ctrl+Shift+R)",
      "Check browser console for JavaScript errors",
      "Verify no ad blockers are interfering"
    ],
    code: `<!-- Correct widget installation -->
<script src="https://widget.dailyevent.com/v1/widget.js"></script>
<script>
  DailyEventWidget.init({
    apiKey: 'YOUR_PUBLIC_KEY',
    containerId: 'insurance-widget'
  });
</script>
<div id="insurance-widget"></div>`
  },
  {
    issue: "Styling Conflicts",
    icon: Palette,
    symptoms: ["Widget looks broken or misaligned", "Colors don't match site theme", "Buttons or text overlapping"],
    solutions: [
      "Use custom CSS to override widget styles",
      "Apply CSS isolation with iframe mode",
      "Check for !important rules conflicting",
      "Use widget theming API for brand colors",
      "Verify z-index values don't conflict",
      "Test with default browser styles"
    ],
    code: `// Custom widget styling
DailyEventWidget.init({
  apiKey: 'YOUR_KEY',
  theme: {
    primaryColor: '#14B8A6',
    fontFamily: 'Inter, sans-serif',
    borderRadius: '12px'
  },
  customCSS: '.dei-button { /* your styles */ }'
});`
  },
  {
    issue: "Mobile Display Problems",
    icon: Smartphone,
    symptoms: ["Widget cut off on mobile", "Buttons too small to tap", "Horizontal scrolling"],
    solutions: [
      "Enable responsive mode in widget config",
      "Set viewport meta tag in <head>",
      "Use mobile-optimized layout option",
      "Test on actual devices, not just browser resize",
      "Check touch target sizes (minimum 44x44px)",
      "Verify no fixed widths preventing scaling"
    ],
    code: `<!-- Add viewport meta tag -->
<meta name="viewport" content="width=device-width, initial-scale=1">

<script>
DailyEventWidget.init({
  apiKey: 'YOUR_KEY',
  responsive: true,
  mobileLayout: 'compact'
});
</script>`
  },
  {
    issue: "Browser Compatibility",
    icon: Code,
    symptoms: ["Works in Chrome but not Safari", "IE11 showing errors", "Features missing in Firefox"],
    solutions: [
      "Check browser version meets minimum requirements",
      "Include polyfills for older browsers",
      "Test in all major browsers before deploying",
      "Use feature detection, not browser detection",
      "Verify CORS headers for cross-origin requests",
      "Check console for browser-specific errors"
    ],
    code: `// Browser support check
if (!DailyEventWidget.isSupported()) {
  // Show fallback form or message
  document.getElementById('widget').innerHTML =
    '<p>Please use a modern browser or contact us directly.</p>';
} else {
  DailyEventWidget.init({ /* config */ });
}`
  }
]

const browserRequirements = [
  { browser: "Chrome", version: "90+", support: "Full" },
  { browser: "Firefox", version: "88+", support: "Full" },
  { browser: "Safari", version: "14+", support: "Full" },
  { browser: "Edge", version: "90+", support: "Full" },
  { browser: "Safari iOS", version: "14+", support: "Full" },
  { browser: "Chrome Android", version: "90+", support: "Full" },
  { browser: "IE 11", version: "11", support: "Limited (polyfills required)" }
]

export default function WidgetIssuesPage() {
  return (
    <div className="space-y-12">
      <Breadcrumbs items={[{ label: "Troubleshooting", href: "/support-hub/troubleshooting" }, { label: "Widget Issues" }]} />

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 text-purple-600 font-semibold text-sm mb-6">
          <Bug className="w-4 h-4" />
          Widget Troubleshooting
        </div>
        <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight">
          Widget Issues
          <span className="block mt-2 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Display & Integration Problems</span>
        </h1>
        <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
          Fix widget loading issues, styling conflicts, mobile display problems, and browser compatibility
        </p>
      </motion.div>

      <section className="space-y-6">
        {widgetIssues.map((item, index) => (
          <motion.div key={index} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }}>
            <GlassCard>
              <div className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                    <item.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900">{item.issue}</h3>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div className="p-4 bg-red-50/50 rounded-xl border border-red-100">
                    <h4 className="flex items-center gap-2 font-bold text-red-800 mb-3">
                      <XCircle className="w-5 h-5" />Symptoms
                    </h4>
                    <ul className="space-y-2">
                      {item.symptoms.map((symptom, i) => (
                        <li key={i} className="flex items-start gap-2 text-red-700 text-sm">
                          <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2" />{symptom}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-4 bg-green-50/50 rounded-xl border border-green-100">
                    <h4 className="flex items-center gap-2 font-bold text-green-800 mb-3">
                      <CheckCircle className="w-5 h-5" />Solutions
                    </h4>
                    <ul className="space-y-2">
                      {item.solutions.map((solution, i) => (
                        <li key={i} className="flex items-start gap-2 text-green-700 text-sm">
                          <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />{solution}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-slate-900 mb-3">Code Example</h4>
                  <pre className="p-4 bg-slate-900 text-green-400 rounded-xl overflow-x-auto text-sm">
                    <code>{item.code}</code>
                  </pre>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </section>

      <GlassCard variant="featured">
        <div className="p-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">Browser Support Matrix</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-slate-200">
                  <th className="text-left py-3 px-4 font-bold text-slate-900">Browser</th>
                  <th className="text-left py-3 px-4 font-bold text-slate-900">Minimum Version</th>
                  <th className="text-left py-3 px-4 font-bold text-slate-900">Support Level</th>
                </tr>
              </thead>
              <tbody>
                {browserRequirements.map((req, index) => (
                  <tr key={index} className="border-b border-slate-100">
                    <td className="py-3 px-4 font-semibold text-slate-900">{req.browser}</td>
                    <td className="py-3 px-4 text-slate-700">{req.version}</td>
                    <td className="py-3 px-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        req.support === "Full" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                      }`}>
                        {req.support}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </GlassCard>
    </div>
  )
}
