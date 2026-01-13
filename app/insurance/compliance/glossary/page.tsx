"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import {
  BookOpen,
  Search,
  Shield,
  Lock,
  Users,
  FileText,
  Database,
  Scale,
  Award,
  Server,
  Globe,
  ArrowRight,
  ChevronDown,
  ChevronUp,
} from "lucide-react"

interface GlossaryTerm {
  term: string
  acronym?: string
  definition: string
  category: string
  relatedTerms?: string[]
}

// Comprehensive glossary
const glossaryTerms: GlossaryTerm[] = [
  // Regulatory Terms
  {
    term: "Anti-Money Laundering",
    acronym: "AML",
    definition: "Set of procedures, laws, and regulations designed to stop the practice of generating income through illegal actions. In insurance, AML programs prevent criminals from using insurance products to launder money.",
    category: "Regulatory",
    relatedTerms: ["KYC", "SAR", "BSA", "CIP"],
  },
  {
    term: "Bank Secrecy Act",
    acronym: "BSA",
    definition: "U.S. legislation requiring financial institutions to assist government agencies in detecting and preventing money laundering. Also known as the Currency and Foreign Transactions Reporting Act.",
    category: "Regulatory",
    relatedTerms: ["AML", "FinCEN", "SAR"],
  },
  {
    term: "California Consumer Privacy Act",
    acronym: "CCPA",
    definition: "State statute intended to enhance privacy rights and consumer protection for California residents. Gives consumers rights to know, delete, and opt-out of sale of personal information.",
    category: "Privacy",
    relatedTerms: ["CPRA", "GDPR", "Privacy"],
  },
  {
    term: "California Privacy Rights Act",
    acronym: "CPRA",
    definition: "Amendment to CCPA that expanded consumer privacy rights, added the right to correct and limit use of sensitive information, and created the California Privacy Protection Agency.",
    category: "Privacy",
    relatedTerms: ["CCPA", "GDPR", "Privacy"],
  },
  {
    term: "Customer Due Diligence",
    acronym: "CDD",
    definition: "Process of verifying customer identity and assessing risk level. Includes understanding the nature of customer relationships to develop a customer risk profile.",
    category: "Regulatory",
    relatedTerms: ["KYC", "EDD", "CIP"],
  },
  {
    term: "Customer Identification Program",
    acronym: "CIP",
    definition: "Minimum requirements for verifying the identity of customers per USA PATRIOT Act Section 326. Requires collection of name, DOB, address, and ID number.",
    category: "Regulatory",
    relatedTerms: ["KYC", "CDD", "AML"],
  },
  {
    term: "Enhanced Due Diligence",
    acronym: "EDD",
    definition: "Additional scrutiny applied to higher-risk customers beyond standard CDD. May include additional documentation, source of funds verification, and ongoing monitoring.",
    category: "Regulatory",
    relatedTerms: ["CDD", "KYC", "PEP"],
  },
  {
    term: "Financial Crimes Enforcement Network",
    acronym: "FinCEN",
    definition: "Bureau of the U.S. Treasury that collects and analyzes financial transaction information to combat domestic and international money laundering, terrorist financing, and other financial crimes.",
    category: "Regulatory",
    relatedTerms: ["BSA", "SAR", "AML"],
  },
  {
    term: "General Data Protection Regulation",
    acronym: "GDPR",
    definition: "European Union regulation on data protection and privacy. Provides data subjects with rights including access, rectification, erasure, and portability of personal data.",
    category: "Privacy",
    relatedTerms: ["CCPA", "Privacy", "DPA"],
  },
  {
    term: "Know Your Customer",
    acronym: "KYC",
    definition: "Process of verifying customer identity and assessing their suitability and potential risks. A critical component of AML compliance in financial and insurance services.",
    category: "Regulatory",
    relatedTerms: ["AML", "CIP", "CDD", "EDD"],
  },
  {
    term: "National Association of Insurance Commissioners",
    acronym: "NAIC",
    definition: "Standard-setting and regulatory support organization for U.S. state insurance regulators. Develops model laws and regulations that states may adopt.",
    category: "Regulatory",
    relatedTerms: ["State DOI", "Model Law"],
  },
  {
    term: "Office of Foreign Assets Control",
    acronym: "OFAC",
    definition: "U.S. Treasury department that administers and enforces economic sanctions programs. Maintains lists of sanctioned individuals, entities, and countries.",
    category: "Regulatory",
    relatedTerms: ["SDN", "Sanctions", "AML"],
  },
  {
    term: "Politically Exposed Person",
    acronym: "PEP",
    definition: "Individual who holds or has held a prominent public position. PEPs require enhanced due diligence due to higher risk of involvement in corruption or money laundering.",
    category: "Regulatory",
    relatedTerms: ["EDD", "AML", "KYC"],
  },
  {
    term: "Specially Designated Nationals",
    acronym: "SDN",
    definition: "OFAC list of individuals and entities with whom U.S. persons are prohibited from conducting business. Assets must be blocked and transactions reported.",
    category: "Regulatory",
    relatedTerms: ["OFAC", "Sanctions", "AML"],
  },
  {
    term: "Suspicious Activity Report",
    acronym: "SAR",
    definition: "Report filed with FinCEN when suspicious activity is detected that may indicate money laundering, terrorist financing, or other financial crimes. Filing is confidential.",
    category: "Regulatory",
    relatedTerms: ["AML", "FinCEN", "BSA"],
  },
  // Security Terms
  {
    term: "Advanced Encryption Standard",
    acronym: "AES",
    definition: "Symmetric encryption algorithm adopted by the U.S. government. AES-256 uses 256-bit keys and is considered secure for protecting classified information.",
    category: "Security",
    relatedTerms: ["Encryption", "TLS"],
  },
  {
    term: "Data Protection Impact Assessment",
    acronym: "DPIA",
    definition: "Process to identify and minimize data protection risks of a project. Required under GDPR for processing that is likely to result in high risk to individuals.",
    category: "Privacy",
    relatedTerms: ["GDPR", "Privacy"],
  },
  {
    term: "Hash-based Message Authentication Code",
    acronym: "HMAC",
    definition: "Specific type of message authentication code involving a cryptographic hash function and a secret key. Used for webhook signature verification.",
    category: "Security",
    relatedTerms: ["SHA-256", "Webhook", "API"],
  },
  {
    term: "Multi-Factor Authentication",
    acronym: "MFA",
    definition: "Authentication method requiring two or more verification factors: something you know, something you have, or something you are.",
    category: "Security",
    relatedTerms: ["Authentication", "2FA"],
  },
  {
    term: "OAuth 2.0",
    definition: "Industry-standard protocol for authorization. Enables third-party applications to obtain limited access to user accounts without exposing credentials.",
    category: "Security",
    relatedTerms: ["API", "Authentication"],
  },
  {
    term: "Payment Card Industry Data Security Standard",
    acronym: "PCI DSS",
    definition: "Security standard for organizations that handle branded credit cards. Mandates security controls for cardholder data protection.",
    category: "Security",
    relatedTerms: ["Compliance", "Payment"],
  },
  {
    term: "Role-Based Access Control",
    acronym: "RBAC",
    definition: "Method of restricting system access based on roles of individual users. Ensures users only access information necessary for their role.",
    category: "Security",
    relatedTerms: ["Access Control", "Authorization"],
  },
  {
    term: "Service Organization Control 2",
    acronym: "SOC 2",
    definition: "Auditing procedure ensuring service providers securely manage data. Based on Trust Services Criteria: security, availability, processing integrity, confidentiality, and privacy.",
    category: "Security",
    relatedTerms: ["Compliance", "Audit"],
  },
  {
    term: "Transport Layer Security",
    acronym: "TLS",
    definition: "Cryptographic protocol designed to provide secure communications over a network. TLS 1.3 is the current version offering improved security and performance.",
    category: "Security",
    relatedTerms: ["HTTPS", "Encryption", "SSL"],
  },
  // Insurance Terms
  {
    term: "Certificate of Insurance",
    acronym: "COI",
    definition: "Document issued by an insurance company verifying the existence of an insurance policy. Shows policy type, coverage limits, and policy period.",
    category: "Insurance",
    relatedTerms: ["Policy", "Coverage"],
  },
  {
    term: "Claims Adjuster",
    definition: "Professional who investigates insurance claims to determine the extent of the insuring company's liability. Evaluates coverage, damages, and settlement amounts.",
    category: "Insurance",
    relatedTerms: ["Claims", "Settlement"],
  },
  {
    term: "Coverage",
    definition: "Scope of protection provided under an insurance policy. Defines what events, property, or circumstances are protected against loss.",
    category: "Insurance",
    relatedTerms: ["Policy", "Exclusions", "Limits"],
  },
  {
    term: "Deductible",
    definition: "Amount the insured must pay out of pocket before insurance coverage begins. Higher deductibles generally result in lower premiums.",
    category: "Insurance",
    relatedTerms: ["Premium", "Coverage"],
  },
  {
    term: "Exclusion",
    definition: "Specific conditions, circumstances, or types of loss not covered by an insurance policy. Clearly defined in policy documents.",
    category: "Insurance",
    relatedTerms: ["Coverage", "Policy"],
  },
  {
    term: "General Liability",
    acronym: "GL",
    definition: "Insurance covering claims of bodily injury, property damage, and personal/advertising injury arising from business operations.",
    category: "Insurance",
    relatedTerms: ["Coverage", "Liability"],
  },
  {
    term: "Insurance Producer",
    definition: "Licensed individual or entity authorized to sell, solicit, or negotiate insurance. May be an agent (representing insurers) or broker (representing customers).",
    category: "Insurance",
    relatedTerms: ["Agent", "Broker", "Licensing"],
  },
  {
    term: "Managing General Agent",
    acronym: "MGA",
    definition: "Specialized insurance agent with authority to underwrite, bind coverage, and handle claims on behalf of an insurance carrier.",
    category: "Insurance",
    relatedTerms: ["MGU", "Producer", "Carrier"],
  },
  {
    term: "Premium",
    definition: "Amount paid for an insurance policy. Determined by factors including coverage type, limits, deductibles, and risk assessment.",
    category: "Insurance",
    relatedTerms: ["Coverage", "Deductible"],
  },
  {
    term: "Underwriting",
    definition: "Process of evaluating risk and determining terms, conditions, and pricing for insurance coverage. Includes risk assessment and policy pricing.",
    category: "Insurance",
    relatedTerms: ["Risk", "Premium", "Coverage"],
  },
  {
    term: "Unfair Claims Settlement Practices Act",
    acronym: "UCSPA",
    definition: "NAIC model act defining unfair claims practices. Prohibits misrepresentation, unreasonable delays, and failure to process claims in good faith.",
    category: "Insurance",
    relatedTerms: ["Claims", "Consumer Protection", "NAIC"],
  },
  // Technical Terms
  {
    term: "Application Programming Interface",
    acronym: "API",
    definition: "Set of protocols and tools for building software applications. Allows different systems to communicate and exchange data programmatically.",
    category: "Technical",
    relatedTerms: ["REST", "Webhook", "Integration"],
  },
  {
    term: "Recovery Point Objective",
    acronym: "RPO",
    definition: "Maximum acceptable amount of data loss measured in time. Determines how frequently data backups must occur.",
    category: "Technical",
    relatedTerms: ["RTO", "Disaster Recovery", "Backup"],
  },
  {
    term: "Recovery Time Objective",
    acronym: "RTO",
    definition: "Maximum acceptable length of time a system can be down after a failure or disaster. Determines disaster recovery planning.",
    category: "Technical",
    relatedTerms: ["RPO", "Disaster Recovery", "Business Continuity"],
  },
  {
    term: "Webhook",
    definition: "HTTP callback that occurs when something happens. Allows real-time notifications between systems when events occur.",
    category: "Technical",
    relatedTerms: ["API", "Integration", "HMAC"],
  },
]

const categories = ["All", "Regulatory", "Privacy", "Security", "Insurance", "Technical"]

export default function GlossaryPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [expandedTerms, setExpandedTerms] = useState<string[]>([])

  // Filter terms based on search and category
  const filteredTerms = useMemo(() => {
    return glossaryTerms.filter((term) => {
      const matchesSearch =
        !searchQuery ||
        term.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
        term.acronym?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        term.definition.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = selectedCategory === "All" || term.category === selectedCategory
      return matchesSearch && matchesCategory
    })
  }, [searchQuery, selectedCategory])

  // Group terms by first letter
  const groupedTerms = useMemo(() => {
    const groups: { [key: string]: GlossaryTerm[] } = {}
    filteredTerms.forEach((term) => {
      const letter = term.term[0].toUpperCase()
      if (!groups[letter]) groups[letter] = []
      groups[letter].push(term)
    })
    return groups
  }, [filteredTerms])

  const toggleTerm = (term: string) => {
    setExpandedTerms((prev) =>
      prev.includes(term) ? prev.filter((t) => t !== term) : [...prev, term]
    )
  }

  const categoryIcons: { [key: string]: React.ReactNode } = {
    Regulatory: <Scale className="w-4 h-4" />,
    Privacy: <Shield className="w-4 h-4" />,
    Security: <Lock className="w-4 h-4" />,
    Insurance: <FileText className="w-4 h-4" />,
    Technical: <Server className="w-4 h-4" />,
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-sm text-teal-600 font-medium mb-2">
          <BookOpen className="w-4 h-4" />
          Document ID: DOC-010
        </div>
        <h1 className="text-3xl font-bold text-slate-900 mb-4">
          Glossary & Definitions
        </h1>
        <p className="text-lg text-slate-600 max-w-3xl">
          Comprehensive glossary of compliance, regulatory, security, insurance, and technical
          terms used throughout the compliance documentation.
        </p>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-xl border border-slate-200 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search terms, acronyms, or definitions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? "bg-teal-500 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
        <div className="mt-4 text-sm text-slate-500">
          Showing {filteredTerms.length} of {glossaryTerms.length} terms
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {["Regulatory", "Privacy", "Security", "Insurance", "Technical"].map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`p-4 rounded-xl border transition-all ${
              selectedCategory === cat
                ? "bg-teal-50 border-teal-200"
                : "bg-white border-slate-200 hover:border-teal-200"
            }`}
          >
            <div className="flex items-center gap-2 mb-1">
              <span className={selectedCategory === cat ? "text-teal-600" : "text-slate-400"}>
                {categoryIcons[cat]}
              </span>
              <span className={`text-sm font-medium ${
                selectedCategory === cat ? "text-teal-700" : "text-slate-600"
              }`}>
                {cat}
              </span>
            </div>
            <div className="text-2xl font-bold text-slate-900">
              {glossaryTerms.filter((t) => t.category === cat).length}
            </div>
          </button>
        ))}
      </div>

      {/* Alphabetical Navigation */}
      <div className="flex flex-wrap gap-1">
        {Object.keys(groupedTerms).sort().map((letter) => (
          <a
            key={letter}
            href={`#letter-${letter}`}
            className="w-8 h-8 flex items-center justify-center bg-slate-100 hover:bg-teal-100 text-slate-600 hover:text-teal-700 rounded font-medium text-sm transition-colors"
          >
            {letter}
          </a>
        ))}
      </div>

      {/* Terms List */}
      <div className="space-y-8">
        {Object.keys(groupedTerms).sort().map((letter) => (
          <div key={letter} id={`letter-${letter}`}>
            <h2 className="text-2xl font-bold text-teal-600 mb-4 pb-2 border-b border-slate-200">
              {letter}
            </h2>
            <div className="space-y-3">
              {groupedTerms[letter].map((item) => (
                <div
                  key={item.term}
                  className="bg-white rounded-xl border border-slate-200 overflow-hidden"
                >
                  <button
                    onClick={() => toggleTerm(item.term)}
                    className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-slate-400">{categoryIcons[item.category]}</span>
                      <div>
                        <span className="font-semibold text-slate-900">{item.term}</span>
                        {item.acronym && (
                          <span className="ml-2 px-2 py-0.5 bg-teal-100 text-teal-700 text-xs font-mono rounded">
                            {item.acronym}
                          </span>
                        )}
                      </div>
                    </div>
                    {expandedTerms.includes(item.term) ? (
                      <ChevronUp className="w-5 h-5 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-slate-400" />
                    )}
                  </button>
                  {expandedTerms.includes(item.term) && (
                    <div className="px-5 pb-4 pt-0 border-t border-slate-100">
                      <p className="text-slate-600 mt-3">{item.definition}</p>
                      {item.relatedTerms && item.relatedTerms.length > 0 && (
                        <div className="mt-4">
                          <div className="text-xs font-medium text-slate-500 mb-2">Related Terms</div>
                          <div className="flex flex-wrap gap-2">
                            {item.relatedTerms.map((related) => (
                              <span
                                key={related}
                                className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded cursor-pointer hover:bg-teal-100 hover:text-teal-700"
                                onClick={() => setSearchQuery(related)}
                              >
                                {related}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      <div className="mt-3 flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                          item.category === "Regulatory" ? "bg-purple-100 text-purple-700" :
                          item.category === "Privacy" ? "bg-blue-100 text-blue-700" :
                          item.category === "Security" ? "bg-red-100 text-red-700" :
                          item.category === "Insurance" ? "bg-amber-100 text-amber-700" :
                          "bg-slate-100 text-slate-700"
                        }`}>
                          {item.category}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* No Results */}
      {filteredTerms.length === 0 && (
        <div className="text-center py-12">
          <Search className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-900 mb-2">No terms found</h3>
          <p className="text-slate-600">Try adjusting your search or filter criteria</p>
        </div>
      )}

      {/* Related Documents */}
      <div className="flex flex-wrap items-center gap-6 text-sm pt-8 border-t border-slate-200">
        <span className="text-slate-500">Related Documentation:</span>
        <Link
          href="/insurance/compliance"
          className="inline-flex items-center gap-1.5 text-teal-600 hover:text-teal-700 font-medium"
        >
          Compliance Overview
          <ArrowRight className="w-3 h-3" />
        </Link>
        <Link
          href="/insurance/compliance/technical-specifications"
          className="inline-flex items-center gap-1.5 text-teal-600 hover:text-teal-700 font-medium"
        >
          Technical Specifications
          <ArrowRight className="w-3 h-3" />
        </Link>
        <Link
          href="/insurance/compliance/aml-kyc"
          className="inline-flex items-center gap-1.5 text-teal-600 hover:text-teal-700 font-medium"
        >
          AML/KYC Program
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
    </div>
  )
}
