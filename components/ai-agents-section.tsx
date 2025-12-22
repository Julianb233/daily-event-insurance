"use client"

import { useState, useRef } from "react"
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion"
import Image from "next/image"

const GALLERY_IMAGES = {
  img1: "/lead-gen-machine.png",
  img2: "/24-hour-support-bot.png",
  img3: "/content-factory.png",
  img4: "/workflow-wizard.png",
  img5: "/ai-accountant.png",
  img6: "/appointment-setter.png",
}

const categories = [
  { id: "all", name: "All Agents" },
  { id: "sales", name: "Sales & Marketing" },
  { id: "support", name: "Customer Support" },
  { id: "operations", name: "Operations" },
  { id: "content", name: "Content & Media" },
  { id: "data", name: "Data & Analytics" },
]

const agentsData = [
  {
    id: 1,
    number: "01",
    name: "LEAD GEN MACHINE",
    category: "sales",
    tagline: "Never miss a lead again",
    problem: "Spending hours manually finding and qualifying leads",
    solution: "AI-powered lead identification, scoring, and automated outreach",
    capabilities: ["LinkedIn Scraping", "Lead Scoring", "Auto Follow-up", "CRM Sync"],
    image: GALLERY_IMAGES.img1,
  },
  {
    id: 2,
    number: "02",
    name: "24/7 SUPPORT BOT",
    category: "support",
    tagline: "Your customers never wait",
    problem: "Missing customer inquiries outside business hours",
    solution: "Intelligent chatbot with human-like responses and escalation logic",
    capabilities: ["Multi-language", "Sentiment Analysis", "Smart Escalation", "Knowledge Base"],
    image: GALLERY_IMAGES.img2,
  },
  {
    id: 3,
    number: "03",
    name: "CONTENT FACTORY",
    category: "content",
    tagline: "Create content at scale",
    problem: "Can't keep up with content demands across platforms",
    solution: "AI content generation maintaining your brand voice",
    capabilities: ["Blog Writing", "Social Posts", "Video Scripts", "SEO Optimized"],
    image: GALLERY_IMAGES.img3,
  },
  {
    id: 4,
    number: "04",
    name: "WORKFLOW WIZARD",
    category: "operations",
    tagline: "Automate the mundane",
    problem: "Wasting time on repetitive manual tasks",
    solution: "N8N-powered automation connecting all your tools",
    capabilities: ["N8N Integration", "API Connections", "Custom Triggers", "Error Handling"],
    image: GALLERY_IMAGES.img4,
  },
  {
    id: 5,
    number: "05",
    name: "DATA DECODER",
    category: "data",
    tagline: "Turn data into decisions",
    problem: "Data scattered across platforms, no clear insights",
    solution: "Automated data collection, analysis, and actionable reports",
    capabilities: ["Real-time Dashboards", "Predictive Analytics", "Custom Reports", "Alerts"],
    image: GALLERY_IMAGES.img5,
  },
  {
    id: 6,
    number: "06",
    name: "APPOINTMENT SETTER",
    category: "sales",
    tagline: "Fill your calendar automatically",
    problem: "Endless back-and-forth scheduling emails",
    solution: "AI assistant that books qualified meetings while you sleep",
    capabilities: ["Calendar Sync", "Time Zone Smart", "Qualification Questions", "Reminders"],
    image: GALLERY_IMAGES.img6,
  },
]

export function AIAgentsSection() {
  const [activeCategory, setActiveCategory] = useState("all")
  const [hoveredAgent, setHoveredAgent] = useState<number | null>(null)
  const [expandedAgent, setExpandedAgent] = useState<number | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  })

  const headerY = useTransform(scrollYProgress, [0, 0.3], [50, 0])
  const headerOpacity = useTransform(scrollYProgress, [0, 0.2], [0, 1])

  const filteredAgents =
    activeCategory === "all" ? agentsData : agentsData.filter((agent) => agent.category === activeCategory)

  return (
    <div ref={containerRef} className="w-full bg-[#0A4D3C] py-24 md:py-32 relative overflow-hidden">
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#D4A84B]/10 rounded-full blur-[100px]" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#1A8B6B]/10 rounded-full blur-[100px]" />

      <div className="container mx-auto px-4 relative z-10 max-w-7xl">
        {/* Section Header */}
        <motion.div
          className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6"
          style={{ y: headerY, opacity: headerOpacity }}
        >
          <div className="flex flex-col">
            <span className="text-[#D4A84B] text-sm font-semibold tracking-[0.3em] uppercase mb-2">
              Solutions Catalog
            </span>
            <h2 className="font-[family-name:var(--font-oswald)] text-4xl md:text-6xl font-bold uppercase leading-none text-white tracking-tighter">
              AI AGENTS
            </h2>
            <p className="text-white/60 mt-3 max-w-md">
              Custom-built AI solutions that solve real business problems. Each agent is designed to save you time,
              money, and create new opportunities.
            </p>
          </div>

          <motion.a
            href="#apply"
            className="group flex items-center gap-2 bg-gradient-to-r from-[#D4A84B] to-[#E8C55A] px-6 py-3 rounded-full text-[#0A4D3C] font-bold hover:shadow-lg hover:shadow-[#D4A84B]/30 transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Book a Consultation
            <svg
              className="w-5 h-5 group-hover:translate-x-1 transition-transform"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </motion.a>
        </motion.div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-10">
          {categories.map((cat) => (
            <motion.button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeCategory === cat.id
                  ? "bg-[#D4A84B] text-[#0A4D3C]"
                  : "bg-white/5 text-white/70 hover:bg-white/10 hover:text-white"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {cat.name}
            </motion.button>
          ))}
        </div>

        {/* Agents Grid */}
        <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" layout>
          <AnimatePresence mode="popLayout">
            {filteredAgents.map((agent, index) => (
              <motion.div
                key={agent.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.1 }}
                onMouseEnter={() => setHoveredAgent(agent.id)}
                onMouseLeave={() => setHoveredAgent(null)}
                onClick={() => setExpandedAgent(expandedAgent === agent.id ? null : agent.id)}
                className="group relative bg-white/5 rounded-2xl overflow-hidden cursor-pointer border border-white/10 hover:border-[#D4A84B]/50 transition-all"
              >
                {/* Agent Image */}
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={agent.image || "/placeholder.svg"}
                    alt={agent.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A4D3C] via-transparent to-transparent" />

                  {/* Number badge */}
                  <div className="absolute top-4 left-4 bg-[#0A4D3C]/80 backdrop-blur-sm px-3 py-1 rounded-full">
                    <span className="text-[#D4A84B] font-bold text-sm">{agent.number}</span>
                  </div>

                  {/* Category badge */}
                  <div className="absolute top-4 right-4 bg-[#D4A84B]/20 backdrop-blur-sm px-3 py-1 rounded-full">
                    <span className="text-[#D4A84B] text-xs font-medium uppercase tracking-wider">
                      {categories.find((c) => c.id === agent.category)?.name}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="font-[family-name:var(--font-oswald)] text-xl md:text-2xl font-bold text-white uppercase tracking-tight mb-1">
                    {agent.name}
                  </h3>
                  <p className="text-[#E8C55A] font-medium text-sm mb-3">{agent.tagline}</p>

                  {/* Problem/Solution - shown on expand */}
                  <AnimatePresence>
                    {expandedAgent === agent.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="py-4 border-t border-white/10 mt-3">
                          <div className="mb-3">
                            <span className="text-[#E07A5F] text-xs font-semibold uppercase tracking-wider">
                              The Problem
                            </span>
                            <p className="text-white/70 text-sm mt-1">{agent.problem}</p>
                          </div>
                          <div>
                            <span className="text-[#2AAD8A] text-xs font-semibold uppercase tracking-wider">
                              The Solution
                            </span>
                            <p className="text-white/70 text-sm mt-1">{agent.solution}</p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Capabilities */}
                  <div className="flex flex-wrap gap-2 mt-4">
                    {agent.capabilities.slice(0, 3).map((cap, idx) => (
                      <span key={idx} className="text-xs px-2 py-1 rounded-full bg-white/10 text-white/70">
                        {cap}
                      </span>
                    ))}
                    {agent.capabilities.length > 3 && (
                      <span className="text-xs px-2 py-1 rounded-full bg-white/10 text-white/70">
                        +{agent.capabilities.length - 3} more
                      </span>
                    )}
                  </div>

                  {/* Expand indicator */}
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/10">
                    <span className="text-white/50 text-xs">
                      {expandedAgent === agent.id ? "Click to collapse" : "Click to learn more"}
                    </span>
                    <motion.div animate={{ rotate: expandedAgent === agent.id ? 180 : 0 }}>
                      <svg className="w-5 h-5 text-[#D4A84B]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p className="text-white/60 mb-4">Explore our solutions, learn how they work, or connect with us to build something custom</p>
          <a
            href="#apply"
            className="inline-flex items-center gap-2 text-[#D4A84B] font-semibold hover:text-[#E8C55A] transition-colors"
          >
            Book a Consultation
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </motion.div>
      </div>
    </div>
  )
}
