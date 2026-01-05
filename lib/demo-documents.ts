// Demo document templates for partner onboarding
// These can be edited by admins at /admin/documents

export const DOCUMENT_TYPES = {
  PARTNER_AGREEMENT: "partner_agreement",
  JOINT_MARKETING_AGREEMENT: "joint_marketing_agreement",
  W9: "w9",
  DIRECT_DEPOSIT: "direct_deposit",
} as const

export type DocumentType = (typeof DOCUMENT_TYPES)[keyof typeof DOCUMENT_TYPES]

export interface DocumentTemplate {
  type: DocumentType
  title: string
  content: string
  version: string
}

export const demoDocuments: DocumentTemplate[] = [
  {
    type: DOCUMENT_TYPES.PARTNER_AGREEMENT,
    title: "Partner Agreement",
    version: "1.0",
    content: \`
# Partner Agreement

**Parties**

This Agreement (the "Agreement") is by and between {{BUSINESS_NAME}} ("Partner"), doing business at {{BUSINESS_ADDRESS}}, and HIQOR, Inc. ("HIQOR") doing business at 2596 Montgomery Avenue, Cardiff, CA 92007 (each a "Party" and together the "Parties").

**Recitals**

Whereas, Partner provides customer and member engagement programs to health clubs and other clients serving millions of customers (the "Clients"); And,

Whereas, HIQOR has a contractual relationship with Mutual of Omaha ("MOO"), which has developed an insurance product for athletes (the "Policy"); And

Whereas, Partner has clients, including sponsors of athletic events and owners of health clubs, who may be interested in offering the Policy or a derivative thereof to their participants and members (the "Customer" or "Customers"); and

Whereas, HIQOR and MOO wish to provide the Policy to Partner's clients and Customers and Partner wishes to make the Policy available to Clients and Customers;

Therefore, the Parties agree as follows.

**Responsibilities of the Parties**

**HIQOR responsibilities.** Under the Terms of this Agreement, HIQOR shall:

Execute an agreement with MOO for the development and operation of a program to market, sell and deliver the Policy to Customers (the "Program"), which shall, at a minimum, include the following provisions:

- Coverage of Customers during specified events or time periods against injury resulting from participation in those events or other activities provided, sponsored or facilitated by Clients;
- Payment by HIQOR to MOO of a premium for each Customer covered by the Policy (the "Premium"), as provided in Appendix A hereto, which may be changed from time to time as agreed between HIQOR and MOO, and approved by Partner.
- Payment by MOO to HIQOR of a fee, as provided in Appendix A hereto, for each Eligible Customer who receives the Policy (the "Marketing Fee") or whose information is provided to MOO by Clients (the "Insureds"). "Eligible Customer" shall be defined as any Customer who (a) has not previously received coverage under the Policy; (b) is not a current or past customer of MOO; (c) provided consent to be marketed to or (d) resides in a country or state that prohibits the sale of the Program.
- Payment by MOO of Marketing Fees to HIQOR within thirty (30) days of the close of the month for Eligible Customers.
- Provision of monthly reports containing information necessary to fulfill the Terms of this Agreement, including but not limited to total Eligible Customers; total Ineligible Customers; and any other information agreed by HIQOR and MOO, and approved by Partner. Such reports shall accompany the payment of Marketing Fees as set forth in Paragraph III. A. c. above.
- Indemnification of HIQOR and its agents, including Partner, for any liability to Clients or Customers resulting from actions by MOO in relation to the Policy or Program.
- Indemnification of HIQOR and its agents, including Partner, against potential violations of Federal and State insurance regulations resulting from any activity related to the agreement between HIQOR and MOO and by extension, this Agreement and its fulfillment.
- A non-circumvent provision prohibiting MOO from providing the Program to Clients or otherwise communicating with Clients without the express written consent of HIQOR or its agents during the term of the agreement and for two years thereafter.

- Develop the technical infrastructure necessary to support the program, for which it will be paid a fee by MOO, as provided in Appendix A hereto ("Technical Development Fee").
- Manage the relationship with MOO to ensure the efficient, timely and smooth operation of the Program.
- Convey in a timely manner marketing and operational issues raised by Partner to MOO for resolution or response, as appropriate.
- Provide Partner with the monthly reports provided by MOO as set forth in Paragraph A.i.(e) above within five (5) days of receipt of such reports.
- Remit to Partner its revenue share from Marketing Fees and Clients’ revenue shares as set forth herein within five (5) days of receipt from MOO.
- Respond in a timely manner to inquiries or issues raised by Partner regarding the operation of the Program or any provision of this Agreement.

**Partner responsibilities.** Under the Terms of this Agreement, Partner shall:

- Market the Program to Clients, including but not limited to emails, remote or on-site presentations and any other activity Partner determines at its sole discretion is necessary to maximize the participation of Clients.
- Facilitate the execution of agreements between MOO and Clients as and if needed.
- Negotiate and execute agreements between Partner and Clients for the implementation of the Program. Such agreements shall include at a minimum:
- The Client’s commitment to provide information on the program to Customers, including but not limited to information on the Policy’s coverage; customer service contacts; and any information required by Federal and State regulations.
- The amount and payment details of the revenue share to be provided by Partner.
- A non-circumvent provision prohibiting the Client from working directly with MOO on a similar Program or other programs without the written consent of Partner.
- The designation of HIQOR as the provider of the Program.
- A non-compete provision prohibiting the Client from working with a third party to market or offer insurance products or promote insurance products to Participants during the term of the agreement between Partner and the Client and for a two (2) year period following termination of that agreement.

- Provide account management services for each Client to ensure maximum participation by Clients and Customers and to otherwise facilitate the smooth operation of the Program.
- Respond in a timely manner to inquiries by HIQOR, Clients and Customers regarding issues related to the marketing and operation of the Program.
- Work with HIQOR to maximize sales of the Policy as mutually agreed by the Parties.
- Support for the marketing of the Program, including but not limited to the provision of marketing materials; development of informational and/or transactional websites or landing pages; training and briefings for Customers if requested by HIQOR; and any other reasonable assistance requested by HIQOR in maximizing the number of Clients and Customers participating in the Program.
- Customer support for Customers, with the exception of claims adjudication, which will be handled by MOO in accordance with state and Federal regulations.
- Timely responses to inquiries, issues or problems raised by HIQOR.

**Revenue Share and Expenses**

**Distribution of Marketing Fees.** The Marketing Fee as set forth herein shall be distributed as follows:
- HIQOR will pay Partner $15.00 per Eligible Customer
- HIQOR will pay Partner a distribution fee that will be paid to Clients or third parties for each Eligible Customer ("Distribution Fee"), as provided in Appendix A hereto. The Distribution Fee shall not exceed $8.00 per Eligible Customer. Any Client that requires less than $8.00 per Eligible Customer will create a revenue share between Partner and HIQOR of an equal split of the difference. In the event that HIQOR is able to increase the Marketing Fee greater than the current Marketing Fee for any Client of Partner or lower the Premium, then HIQOR and Partner agree to split the net equally.

**Disbursement of Marketing Fees.** Marketing Fees and other revenues shall be disbursed as follows:
- HIQOR shall remit to Partner the Marketing Fee and the Distribution Fee within five (5) days of receipt of the Marketing Fees paid by MOO.
- Partner shall remit Distribution Fee as agreed between Partner and each Client.

**Other Expenses.** Each Party shall be responsible for any other expenses it incurs in conjunction with this Agreement unless otherwise agreed.

**Term and Termination**

**Term and Renewal.** This Agreement shall remain in effect for five (5) years from the Date of Execution, defined as the date on which both Parties have signed below ("Initial Term"). Unless either Party notifies the other of its intention to cancel with ninety (90) days written notice, this Agreement shall automatically renew for a period of three (3) year and continue to renew annually thereafter.

**Effects of Termination.** Each Party shall be entitled to its revenue share for the Program for as long as MOO pays the applicable Marketing Fees or other revenues.

**Termination without Cause.** This Agreement may not be terminated by either Party without Cause. The foregoing notwithstanding, Partner may terminate this Agreement without further obligation if HIQOR or MOO adjusts the Premium or Marketing Fees without the approval of Partner or otherwise make material changes to the Program.

**Termination for Cause.** In the event of a default under this Agreement by either Party, the other Party may terminate this Agreement by giving written notice to such breaching Party of termination and the basis for such termination. Such notice of termination of this Agreement shall be effective thirty (30) days after receipt of such written notice by the offending Party unless such default is cured within such thirty (30) days period. The following shall constitute events of default hereunder:
- the failure of a Party to materially perform or comply with any one or more of its covenants, duties or obligations hereunder, including non‐payment of Fees; or
- if a Party (i) applies for consent to the appointment of a receiver, trustee or liquidator of all or a substantial part of its assets; or (ii) is unable or fails to pay or admits in writing its inability or failure to pay its debt as they mature; or (iii) makes a general assignment for the benefit of creditors; or (iv) is adjudicated as bankrupt or insolvent; or (v) is dissolved; or (vi) files a petition in bankruptcy or for reorganization or for any arrangement pursuant to bankruptcy act or any insolvency law providing for the relief of debtors now or hereafter in effect; or (vii) files an answer admitting the material allegation of, or consents to, or defaults in answering a petition filed against it, in any bankruptcy, reorganization or insolvency proceeding; or (viii) takes corporate action for the purpose of effecting any of the foregoing; or
- If an order, judgment or decree is entered against, and without the application, approval or consent of a Party, by any court of competent jurisdiction, approving a petition seeking either Party’s reorganization, or appointing a receiver, trustee or liquidator of such Party, of all, or a substantial part of, its assets.

**Wind‐down.** The wind‐down period shall be the 90‐day notice period prior to the expiration or early Termination of the Agreement. In the event of Termination or expiration of this Agreement, the Parties agree to wind down the Program in an orderly manner to minimize the disruption to their respective businesses, to Clients and to Customers.

**Miscellaneous Provisions**

**Additional Products and Services.** This Agreement shall cover any products or services provided by MOO or other additional ("additional" meaning secondary or tertiary monetization of marketing leads past the 1st monetization with MOO) monetization providers to Clients or Customers under this agreement for which Marketing Fees or other revenues are paid to HIQOR.

**Partner will be granted category sales exclusivity** for the Program for a period of one hundred and twenty (120) days following the Effective Date of this Agreement. Exclusivity will continue thereafter provided that Partner maintains a minimum monthly threshold of an average of 30,000 Insureds per month for the previous six (6) months of the Program. For the purposes of this Agreement, "category exclusivity" shall mean exclusivity within the following sectors: fun runs, race aggregation partners, golf reservation systems, races, health clubs, gyms, athletic competitions, and other managed athletic events. Any leads in these categories will be directed to Partner. If an agreement is executed with HIQOR with a client in this category, Partner will receive the revenue outlined in Appendix A.

**Non-circumvent.** HIQOR may not market any program that partially or substantially competes with the Program to Clients or Customers for a period of two (2) years following Termination of this Agreement.

**Partner Indemnification.** Partner shall indemnify, defend and hold harmless HIQOR’s officers, directors, agents and employees from and against all liabilities, damages, claims, costs, fees and expenses (including reasonable attorney's fees), that HIQOR may incur as a result of any third‐party claim, suit or proceeding made or brought against HIQOR for claims pertaining to Partner's activities in conjunction with this Agreement.

**HIQOR Indemnification.** HIQOR shall indemnify, defend and hold harmless Partner, Clients, officers, directors, agents and employees from and against all liabilities, damages, claims, costs, fees and expenses (including reasonable attorney's fees), that Partner or its clients may incur as a result of any third‐party claim, suit or proceeding made or brought against Partner or its clients for claims pertaining to HIQOR’s activities in conjunction with this Agreement.

**Confidentiality.** Any technical, financial, business or other information provided by one Party (the "Disclosing Party") to the other Party (the "Receiving Party") and designated as confidential or proprietary or that reasonably should be understood to be confidential given the nature of the information and the circumstances of disclosure, including, but not limited to, proprietary, technical, business plans, Client lists, pricing information, operating plans, marketing, operating, performance, cost, know‐how, business pricing policies, programs, data systems, inventions, discoveries, trade secrets, techniques, process, computer programming techniques and all record‐bearing media containing or disclosing such information and techniques ("Confidential Information") shall be held in confidence and not disclosed and shall not be used except to the extent necessary to carry out the Receiving Party’s obligations or express rights hereunder, except as otherwise authorized by the Disclosing Party in writing.

**Force Majeure.** Each Party hereby agrees to excuse the other’s performance and each Party shall not be liable for delay, or for the destruction, loss or damage to either Party occasioned by such delay caused by any of the following: an Act of God, Act of War, act of public enemies, law, enactment, rule, order, act of government or government instrumentalities, perils of the sea, third party pilot error, failure of civil commotions, seizure or arrest of any vessel, robbers, riots, thieves, barratry, collision, or explosions or other cause of a similar or dissimilar nature not within such Party’s control (collectively a "Force Majeure"). Upon the occurrence of a Force Majeure, the Party so affected shall continue to make all reasonable efforts in good faith to comply with the terms of this Agreement and shall be in full compliance hereof as soon as is reasonably practicable.

**Third party Beneficiaries.** Except as expressly provided to the contrary herein, nothing in this Agreement is intended, nor shall be deemed, to confer upon any person or legal entity other than Partner or HIQOR any rights or remedies under or by reason of this Agreement.

**Status of Parties.** This Agreement is not intended to create, and shall not be interpreted or construed as creating, a partnership, joint venture, agency, employment, master and servant or similar relationship between Partner and HIQOR.

**Entire Agreement.** This Agreement constitutes the entire understanding of the Parties with respect to the subject matter contained in this Agreement and supersedes and terminates any prior agreement or understanding between the parties. The Parties may modify, vary, or alter the provisions of this Agreement only by the instrument in writing duly executed by authorized representatives of both Parties.

**Governing Law; Jurisdiction.** This Agreement shall be governed, interpreted and construed in accordance with the laws of the State of Arizona.

**Severability.** If any term, clause, or provision of this Agreement shall be judged invalid for any reason whatsoever, the invalidity thereof shall not affect the validity or operation of any other term, clause, or provision of this Agreement, and such invalid terms, clauses, or provisions shall be deemed deleted from this Agreement.

**Waiver.** The failure of either Party at any time to require performance by the other Party of any provision of this Agreement shall in no way affect the full right to require such performance at any time thereafter. The waiver by either Party of a breach of any provision of this Agreement shall not constitute a waiver of any succeeding breach of the same or any other provision or constitute a waiver of the provision itself.

**Notices.** Any notice or demand desired or required to be given hereunder shall be in writing and shall be delivered by hand, by electronic means such as DocuSign, by Federal Express, or by deposit with United States mail by Registered or Certified Mail, Return Receipt Requested, postage prepaid, in each case addressed as respectively set forth below or to such other address or physical address as any Party shall have previously designated by such a notice. All notices and demands shall be deemed so delivered upon receipt.

**Notices to Partner:**
{{BUSINESS_NAME}}
{{CONTACT_NAME}}
{{BUSINESS_ADDRESS}}

**Notices to HIQOR:**

Aaron Drew
CEO
HIQOR, Inc.
2596 Montgomery Avenue
Cardiff, CA 92007
Telephone: 301-787-0430
Email: aaron@hiqor.com

**Counterparts.** This Agreement may be executed in two or more counterparts, and each such counterpart shall be deemed an original hereof. Counterparts may be delivered via facsimile, electronic mail (including pdf or any electronic signature complying with the U.S. federal ESIGN Act of 2000, e.g., www.docusign.com) or other transmission method and any counterpart so delivered shall be deemed to have been duly and validly delivered and be valid and effective for all purposes.

**Headings.** The headings in this Agreement are for the convenience of reference only and have no legal effect.

**Assignment.** This Agreement may not be assigned without the prior written consent of both parties.

WITNESS WHEREOF, intending to be bound hereby, the undersigned parties have executed this Agreement as of the date first written below.

Understood and agreed:

**{{BUSINESS_NAME}}**

_____________________________________
[Digital Signature]
{{CONTACT_NAME}}
Title: [Partner Title]

Date: {{DATE}}

**HIQOR, INC.**

_____________________________________
[Digital Signature]
Aaron Drew
Title: Founder & CEO

Date: {{DATE}}

---

# Appendix A
## Fee Schedule

The following Fee Schedule is valid at the Time of Execution. It may be subject to change from time to time with the approval of HIQOR and Partner.

| Description | Fee |
|-------------|-----|
| Marketing Fee Paid by MOO to HIQOR | $40.00 |
| Premium Paid by HIQOR to MOO | $2.00 |
| Distribution Fee for Clients and Third Parties | Up to $8.00 |
| Marketing Fee HIQOR | $15.00 |
| Marketing Fee to Partner | $15.00 |
| Technology Fee (paid by MOO to HIQOR, not shared) | $8.00 |
\`,
  },
  {
    type: DOCUMENT_TYPES.JOINT_MARKETING_AGREEMENT,
    title: "Joint Marketing Agreement",
    version: "1.0",
    content: \`
# Joint Marketing Agreement

**Effective Date:** Upon Digital Signature

**Parties**

This Agreement (the "Agreement") is by and between {{BUSINESS_NAME}} ("Partner"), doing business at {{BUSINESS_ADDRESS}}, and HIQOR, Inc. ("HIQOR") doing business at 2596 Montgomery Avenue, Cardiff, CA 92007 (each a "Party" and together the "Parties").

**Recitals**

Whereas, Partner provides customer and member engagement programs to health clubs and other clients (the "Clients") serving millions of customers; and,

Whereas, HIQOR has a contractual relationship with Mutual of Omaha ("MOO"), which has developed an insurance product for athletes (the "Policy"); and

Whereas, HIQOR and MOO wish to provide the Policy to Clients and their customers (the "Customer" or "Customers"), and Partner wishes to make the Policy available to Clients and Customers;

Therefore, the Parties agree as follows.

**Responsibilities of the Parties**

**HIQOR responsibilities.** Under the Terms of this Agreement, HIQOR shall:

Execute an agreement with MOO for the development and operation of a program to market, sell and deliver the Policy to Customers (the "Program"), which shall, at a minimum, include the following provisions:

- Coverage of Customers during specified events or time periods against injury resulting from participation in those events or other activities provided, sponsored or facilitated by Clients;
- Payment by HIQOR to MOO for each Customer covered by the Policy (the "Premium"), which may be changed from time to time as agreed between HIQOR and MOO, and approved by Partner.
- Payment by MOO to HIQOR for each Eligible Customer who receives the Policy (the "Marketing Fee") or whose information is provided to MOO by Clients (the "Insureds"). "Eligible Customer" shall be defined as any Customer who (a) has not previously received coverage under the Policy; b) is not a current or past customer of MOO; or c) resides outside the United States or in a state that prohibits the sale of the Program.
- Payment by MOO of Marketing Fees to HIQOR within fifteen (15) days of the close of the month in which Eligible Customers were insured by MOO.
- Provision of monthly reports containing information necessary to fulfill the Terms of this Agreement, including but not limited to total Eligible Customers; total Ineligible Customers; and any other information agreed by HIQOR and MOO, and approved by Partner. Such reports shall accompany the payment of Marketing Fees as set forth in Paragraph III. A. c. above.
- Indemnification of HIQOR and its agents, including Partner, against potential violations of Federal and State insurance regulations resulting from any activity related to the agreement between HIQOR and MOO and by extension, this Agreement and its fulfillment.
- Support for the marketing of the Program, including but not limited to the provision of marketing materials; development of informational and/or transactional websites or landing pages; training and briefings for Customers if requested by HIQOR; and any other reasonable assistance requested by HIQOR in maximizing the number of Clients and Customers participating in the Program.
- A non-circumvent provision prohibiting MOO from providing the Program to Clients or otherwise communicating with Clients without the express written consent of HIQOR or its agents during the term of the agreement and for two years thereafter.
- Customer support for Customers.
- Timely responses to inquiries, issues or problems raised by HIQOR.
- Ensure all workflows, disclosures, and enrollment/waiver flows provided to Partner meet all MOO compliance requirements and are updated within ten (10) days of any MOO-mandated changes.

- Manage the relationship with MOO to ensure the efficient, timely and smooth operation of the Program.
- Convey in a timely manner marketing and operational issues raised by Partner to MOO for resolution or response, as appropriate.
- Provide Partner with the monthly reports provided by MOO as set forth in Paragraph A.i.(e) above within five (5) days of receipt of such reports.
- Remit to Partner its Revenue Share from Marketing Fees as set forth herein within fifteen (15) days of receipt from MOO.
- Respond in a timely manner to inquiries or issues raised by Partner regarding the operation of the Program or any provision of this Agreement.

**Partner responsibilities.** Under the Terms of this Agreement, Partner shall:

- Market the Program to Clients, including but not limited to emails, remote or on-site presentations and any other activity Partner determines at its sole discretion is necessary to maximize the participation of Clients.
- Make single- or multiple-day accident, medical, and accidental death and dismemberment (AD&D) policies available to all members, guests, buddy-pass users, or other participants through the standard waiver and new-member onboarding workflow. This includes (i) the digital waiver flow, (ii) in-club waiver kiosks/tablets (where applicable), and (iii) any additional sign-up workflows mutually agreed upon by the Parties to ensure compliance with carrier requirements.
- Not enter into agreements, contracts, or other arrangements for biometric face scan and other digital health assessments with any provider other than HIQOR.
- Facilitate the execution of agreements between HIQOR and Clients as needed.
- Negotiate and execute agreements between Partner and Clients for the implementation of the Program. Such agreements, which shall be subject to the approval of HIQOR, shall include at a minimum:
- The Client's commitment to provide information on the program to Customers, including but not limited to information on the Policy's coverage; customer service contacts; and any information required by Federal and State regulations.
- The amount and payment details of the revenue share to be provided by Partner.
- A non-circumvent provision prohibiting the Client from working directly with MOO on a similar Program or other programs without the written consent of Partner.
- A non-compete provision prohibiting the Client from working with another insurance company to provide an alternative to the Program for a two-year period following the termination of the agreement between the Client and Partner.
- Implement and maintain the mutually-approved insurance disclosure language, opt-in checkboxes, and data-capture elements within its waiver, guest pass, and new-member workflows. HIQOR shall provide any carrier-required language to Partner with at least ten (10) business days' notice before such changes are required to go live. Any changes to the waiver flow that materially impact data collection, eligibility, or customer experience shall require the written approval of both parties.
- Provide account management services for each Client to ensure maximum participation by Clients and Customers and to otherwise facilitate the smooth operation of the Program.
- Respond in a timely manner to inquiries by HIQOR, Clients and Customers regarding issues related to the marketing and operation of the Program.
- Work with HIQOR to maximize sales of the Policy as mutually agreed by the Parties.

**Revenue Share and Expenses**

**Distribution of Marketing Fees.** The Marketing Fee as set forth herein shall be distributed as follows:
- HIQOR will pay Partner fifty percent (50%) of the Marketing Fee it receives from MOO ("Revenue Share") as compensation for each monetized lead.
- The Parties acknowledge the commercial model in effect as of the Effective Date: $50 payable per monetized customer lead ("Per-Lead Fee"). These payments shall be included within and not in addition to the Revenue Share structure unless otherwise agreed in writing.
- The definition of a monetized lead is a unique customer that consents to be contacted for marketing purposes by MOO for Life Insurance and is accepted by MOO as an eligible customer.

**Disbursement of Marketing Fees.** Marketing Fees shall be disbursed as follows:
- HIQOR shall receive the Marketing Fees from MOO as set forth herein.
- HIQOR shall pay the Revenue Share to Partner specified above within 15 days after receipt of the fees from MOO.

**Other Expenses.** Each Party shall be responsible for any other expenses it incurs in conjunction with this Agreement unless otherwise agreed.

**Term and Termination. Dispute Resolution**

**Pilot/Initial Trial Period.** The Parties agree to conduct a 90-day pilot period beginning on the Program Launch Date ("Pilot Period"). During this Pilot Period:
- Partner shall enroll initial test locations and implement the full waiver-flow integration described in Section III(B);
- HIQOR shall ensure MOO reporting, Marketing Fee validation, and compliance workflows function as intended;
- The Parties shall meet weekly to evaluate Program performance, waiver conversion rates, report accuracy, and operational or compliance issues ("Pilot Evaluations").
At the end of the Pilot Period, both Parties must mutually confirm in writing (email acceptable) that the Program is ready for full implementation ("Pilot Approval"). If either Party determines the Program is not viable or materially non-compliant during the Pilot Period, this Agreement may be terminated without penalty.

**Term and Renewal.** Following the Pilot Approval, this Agreement shall remain in effect for an initial term of one (1) year ("Initial Term"). This Agreement shall automatically renew at the end of the Initial Term for a period of one (1) year and continue to renew annually thereafter (each a "Renewal Term") unless either Party notifies the other of its intention to terminate this Agreement ninety (90) days prior to the end of the Initial Term or the Renewal Term then in effect.

**Effects of Termination.** Each Party shall be entitled to its Revenue Share for the Program for as long as MOO pays the applicable Marketing Fees.

**Termination without Cause.** This Agreement may not be terminated by either Party without Cause. The foregoing notwithstanding, Partner may terminate this Agreement without further obligation if HIQOR or MOO adjust the Premium, Marketing Fees, or eligibility rules in a manner that materially change the commercial structure of this Agreement, or create carrier-compliance risk for Partner.

**Termination for Cause.** In the event of a default under this Agreement by either Party, the other Party may terminate this Agreement by giving written notice to such breaching Party of termination and the basis for such termination. Such notice of termination of this Agreement shall be effective thirty (30) days after receipt of such written notice by the offending Party unless such default is cured within such thirty (30) days period. The following shall constitute events of default hereunder:
- the failure of a Party to materially perform or comply with any one or more of its covenants, duties or obligations hereunder, including non‐payment of Fees; or
- if a Party (i) applies for consent to the appointment of a receiver, trustee or liquidator of all or a substantial part of its assets; or (ii) is unable or fails to pay or admits in writing its inability or failure to pay its debt as they mature; or (iii) makes a general assignment for the benefit of creditors; or (iv) is adjudicated as bankrupt or insolvent; or (v) is dissolved; or (vi) files a petition in bankruptcy or for reorganization or for any arrangement pursuant to bankruptcy act or any insolvency law providing for the relief of debtors now or hereafter in effect; or (vii) files an answer admitting the material allegation of, or consents to, or defaults in answering a petition filed against it, in any bankruptcy, reorganization or insolvency proceeding; or (viii) takes corporate action for the purpose of effecting any of the foregoing; or
- If an order, judgment or decree is entered against, and without the application, approval or consent of a Party, by any court of competent jurisdiction, approving a petition seeking either Party’s reorganization, or appointing a receiver, trustee or liquidator of such Party, of all, or a substantial part of, its assets.

**Wind‐down.** The wind‐down period shall be the 90‐day notice period prior to the expiration or early Termination of the Agreement. In the event of Termination or expiration of this Agreement, the Parties agree to wind down the Program in an orderly manner to minimize the disruption to their respective businesses, to Clients and to Customers.

**Dispute Resolution.** Should a dispute, controversy, or claim (each, a "Dispute") develop between the parties under this agreement (including without limitation, one respecting the validity, material breach, suspension, or termination hereof), the procedures set forth below shall apply (collectively, the "Procedures"). The Procedures shall be the exclusive mechanism available to the parties for resolving Disputes hereunder.
- Negotiation. In the event of a Dispute, the parties must first attempt to informally negotiate and resolve their conflict at the operational level; i.e., through meeting(s) between each party's representative(s) with decision-making authority. Once all reasonable good faith efforts to do so have been made, an unresolved Dispute must be submitted to upper management for another opportunity to negotiate and resolve the conflict by each party's key executives. Such executives shall promptly use all good faith efforts to seek a resolution. If, after twenty-one (21) days following the commencement of negotiations, upper management has failed to resolve the Dispute, the parties may seek resolution by arbitration as more fully set forth below. All negotiations commence upon the provision of written notice from one party to the other party identifying the Dispute and requesting the opportunity to negotiate a resolution. Either party may seek equitable relief, such as an injunction, prior to or during the negotiations in order to preserve the status quo and protect its interests during the process. All communications, whether oral or written, are confidential and will be treated by the parties as compromise & settlement negotiations for the purposes of the Federal Rules of Evidence as well as any applicable, corresponding state rules. Notwithstanding the foregoing, evidence that is otherwise admissible or discoverable shall not be rendered inadmissible or non-discoverable as a result of its use in negotiations
- Arbitration. Following Section a. above, either party may commence neutral, binding arbitration, which shall be conducted on a confidential basis and shall take place before the American Arbitration Association under their Commercial Arbitration Rules in California. The version of the rules that should apply are those currently in effect as of the date of this agreement/then in effect at the time of the Dispute. Each party shall cooperate with the arbitrator in all reasonable respects and participate in good faith wherever required. Final and binding judgment upon any award rendered by an arbitrator may be entered in any court having jurisdiction thereof. The prevailing party in any arbitration or litigation shall be entitled to recover its reasonable, outside attorneys' fees and related costs. Either party may seek equitable relief, such as an injunction, prior to or during an arbitration or litigation in order to preserve the status quo and protect its interests during the process.

**Miscellaneous Provisions**

**Non-circumvent.** Partner may not market any program that partially or substantially competes with the Program to Clients or Customers for a period of two (2) years following Termination of this Agreement.

**Partner Indemnification.** Partner shall indemnify, defend and hold harmless HIQOR’s officers, directors, agents and employees from and against all liabilities, damages, claims, costs, fees and expenses (including reasonable attorney's fees), that HIQOR may incur as a result of any third‐party claim, suit or proceeding made or brought against HIQOR for claims pertaining to Partner 's activities in conjunction with this Agreement.

**HIQOR Indemnification.** HIQOR shall indemnify, defend and hold harmless Partner, Clients, officers, directors, agents and employees from and against all liabilities, damages, claims, costs, fees and expenses (including reasonable attorney's fees), that Partner or its clients may incur as a result of any third‐party claim, suit or proceeding made or brought against Partner or its clients for claims pertaining to HIQOR’s activities in conjunction with this Agreement.

**Limitation on Liability.** IN NO EVENT WILL EITHER PARTY BE LIABLE TO THE OTHER PARTY FOR ANY SPECIAL, INCIDENTAL, EXEMPLARY, PUNITIVE, LOST PROFIT, LOST REVENUE, CONSEQUENTIAL, OR OTHER SIMILAR INDIRECT DAMAGES EVEN IF SUCH PARTY HAS BEEN ADVISED OF THE SAME. THE AGGREGATE LIABILITY OF EITHER PARTY FOR ANY AND ALL CLAIMS AND CAUSES OF ACTION, IN CONTRACT, TORT OR OTHERWISE, ARISING FROM OR RELATING TO THIS AGREEMENT OR THE SUBJECT MATTER HEREOF, WILL NOT EXCEED THE FEES PAID UNDER THIS AGREEMENT IN THE TWELVE MONTHS IMMEDIATELY PRECEDING THE EVENT(S) GIVING RISE TO SUCH LIABILITY. THE FOREGOING LIMITATIONS IN THIS WILL NOT APPLY TO EITHER PARTY’S INDEMNITY OBLIGATIONS, BREACH OF CONFIDENTIALITY, GROSS NEGLIGENCE OR WILLFUL MISCONDUCT. ANY CAUSE OF ACTION A PARTY HAS AGAINST THE OTHER PARTY IN CONNECTION WITH THIS AGREEMENT MUST BE COMMENCED WITHIN SIX (6) MONTHS AFTER THE COMPLETION OF THE EVENT OR IT WILL BE DEEMED TO HAVE BEEN RELEASED AND WILL BE BARRED, NOTWITHSTANDING ANY STATUTE OF LIMITATIONS TO THE CONTRARY.

**Confidentiality.** Any technical, financial, business or other information provided by one Party (the "Disclosing Party") to the other Party (the "Receiving Party") and designated as confidential or proprietary or that reasonably should be understood to be confidential given the nature of the information and the circumstances of disclosure, including, but not limited to, proprietary, technical, business plans, Client lists, pricing information, operating plans, marketing, operating, performance, cost, know‐how, business pricing policies, programs, data systems, inventions, discoveries, trade secrets, techniques, process, computer programming techniques and all record‐bearing media containing or disclosing such information and techniques ("Confidential Information") shall be held in confidence and not disclosed and shall not be used except to the extent necessary to carry out the Receiving Party’s obligations or express rights hereunder, except as otherwise authorized by the Disclosing Party in writing.

**Force Majeure.** Each Party hereby agrees to excuse the other’s performance and each Party shall not be liable for delay, or for the destruction, loss or damage to either Party occasioned by such delay caused by any of the following: an Act of God, Act of War, act of public enemies, law, enactment, rule, order, act of government or government instrumentalities, perils of the sea, third party pilot error, failure of civil commotions, seizure or arrest of any vessel, robbers, riots, thieves, barratry, collision, or explosions or other cause of a similar or dissimilar nature not within such Party’s control (collectively a "Force Majeure"). Upon the occurrence of a Force Majeure, the Party so affected shall continue to make all reasonable efforts in good faith to comply with the terms of this Agreement and shall be in full compliance hereof as soon as is reasonably practicable.

**Third party Beneficiaries.** Except as expressly provided to the contrary herein, nothing in this Agreement is intended, nor shall be deemed, to confer upon any person or legal entity other than Partner or HIQOR any rights or remedies under or by reason of this Agreement.

**Status of Parties.** This Agreement is not intended to create, and shall not be interpreted or construed as creating, a partnership, joint venture, agency, employment, master and servant or similar relationship between Partner and HIQOR.

**Entire Agreement.** This Agreement constitutes the entire understanding of the Parties with respect to the subject matter contained in this Agreement and supersedes and terminates any prior agreement or understanding between the parties. The Parties may modify, vary, or alter the provisions of this Agreement only by the instrument in writing duly executed by authorized representatives of both Parties.

**Governing Law; Jurisdiction.** This Agreement shall be governed, interpreted and construed in accordance with the laws of the State of California.

**Severability.** If any term, clause, or provision of this Agreement shall be judged invalid for any reason whatsoever, the invalidity thereof shall not affect the validity or operation of any other term, clause, or provision of this Agreement, and such invalid terms, clauses, or provisions shall be deemed deleted from this Agreement.

**Waiver.** The failure of either Party at any time to require performance by the other Party of any provision of this Agreement shall in no way affect the full right to require such performance at any time thereafter. The waiver by either Party of a breach of any provision of this Agreement shall not constitute a waiver of any succeeding breach of the same or any other provision or constitute a waiver of the provision itself.

**Notices.** Any notice or demand desired or required to be given hereunder shall be in writing and shall be delivered by hand, by electronic means such as DocuSign, by Federal Express, or by deposit with United States mail by Registered or Certified Mail, Return Receipt Requested, postage prepaid, in each case addressed as respectively set forth below or to such other address or physical address as any Party shall have previously designated by such a notice. All notices and demands shall be deemed so delivered upon receipt.

**Notices to Partner:**
{{BUSINESS_NAME}}
{{CONTACT_NAME}}
{{BUSINESS_ADDRESS}}

**Notices to HIQOR:**

Aaron Drew
Founder & CEO
HIQOR, Inc.
2596 Montgomery Ave.
Cardiff, CA 92007
Telephone: 301-787-0430
Email: aaron@hiqor.com

**Counterparts.** This Agreement may be executed in two or more counterparts, and each such counterpart shall be deemed an original hereof. Counterparts may be delivered via facsimile, electronic mail (including pdf or any electronic signature complying with the U.S. federal ESIGN Act of 2000, e.g., www.docusign.com) or other transmission method and any counterpart so delivered shall be deemed to have been duly and validly delivered and be valid and effective for all purposes.

**Headings.** The headings in this Agreement are for the convenience of reference only and have no legal effect.

**Assignment.** This Agreement may not be assigned without the prior written consent of both parties.

**Representations and Warranties.** Each Party represents and warrants that: (a) it is duly organized, validly existing and in good standing under its jurisdiction of organization and has the right to enter into this Agreement; and (b) the execution, delivery and performance of this Agreement and the consummation of the transactions contemplated hereby are within the corporate powers of such Party and have been duly authorized by all necessary corporate action on the part of such Party, and constitute a valid and binding agreement of such Party; it is authorized to execute, deliver, and perform the obligations set forth in this Agreement. OTHER THAN AS EXPRESSLY PROVIDED IN THIS AGREEMENT, EACH PARTY MAKES NO WARRANTY TO THE OTHER PARTY REGARDING THE SUBJECT MATTER OF THIS AGREEMENT, WHETHER ARISING BY LAW, COURSE OF DEALING, COURSE OF PERFORMANCE, USAGE OF TRADE, OR OTHERWISE, AND DISCLAIMS ALL WARRANTIES NOT EXPRESSLY MADE IN THIS AGREEMENT.

WITNESS WHEREOF, intending to be bound hereby, the undersigned parties have executed this Agreement as of the date first written below.

Understood and agreed:

**{{BUSINESS_NAME}}**

_____________________________________
[Digital Signature]
{{CONTACT_NAME}}
Title: [Partner Title]

Date: {{DATE}}

**HIQOR, INC.**

_____________________________________
[Digital Signature]
Aaron Drew
Title: Founder & CEO

Date: {{DATE}}
\`,
  },
  {
    type: DOCUMENT_TYPES.W9,
    title: "W-9 Tax Information",
    version: "1.0",
    content: `
# W - 9 Request for Taxpayer Identification Number

  ** Purpose:** To provide your tax identification information for commission payments.

> ** Important:** This is a simplified collection form.For complete IRS W - 9, visit[irs.gov](https://www.irs.gov/forms-pubs/about-form-w-9).

    ---

## Part I: Identification

Please provide the following information for tax reporting purposes:

### Business Information
  - ** Legal Business Name:** (as shown on your tax return)
- ** Business Name / DBA:** (if different from above)
- ** Federal Tax Classification:**
  -[] Individual / Sole Proprietor
    - [] C Corporation
      - [] S Corporation
        - [] Partnership
          - [] LLC(specify classification)
            - [] Other

### Tax Identification
  - ** Taxpayer Identification Number(TIN):**
    - Social Security Number(SSN): XXX - XX - XXXX
      - OR Employer Identification Number(EIN): XX - XXXXXXX

### Address
  - ** Street Address:**
- ** City, State, ZIP:**

  ---

## Part II: Certification

Under penalties of perjury, I certify that:

1. The number shown on this form is my correct taxpayer identification number
2. I am not subject to backup withholding
3. I am a U.S.citizen or other U.S.person
4. The FATCA code(s) entered on this form(if any) is correct

---

** The IRS does not require your consent to any provision of this document other than the certifications required to avoid backup withholding.**

  By signing below, you certify that the information provided is accurate and complete.
`,
  },
  {
    type: DOCUMENT_TYPES.DIRECT_DEPOSIT,
    title: "Direct Deposit Authorization",
    version: "1.0",
    content: `
# Direct Deposit Authorization Form

  ** Purpose:** To authorize Daily Event Insurance to initiate commission payments directly to your bank account.

---

## Authorization

I hereby authorize Daily Event Insurance to initiate credit entries(deposits) to my account at the financial institution named below.I also authorize the financial institution to credit the same to such account.

## Bank Account Information

### Account Holder
  - ** Name on Account:**
- ** Account Type:**
  -[] Checking
    - [] Savings

### Bank Details
  - ** Bank Name:**
- ** Routing Number:** (9 digits)
- ** Account Number:**

### Verification
Please attach a voided check or bank statement showing your account and routing numbers.

---

## Terms and Conditions

1. ** Effective Date **: This authorization will remain in effect until I notify Daily Event Insurance in writing to cancel it.

2. ** Processing Time **: Please allow up to 15 business days for initial setup.Standard commission payments are processed within 15 business days of month - end.

3. ** Changes **: To change bank information, I must submit a new authorization form at least 10 business days before the next payment date.

4. ** Errors **: If an erroneous deposit is made, I authorize Daily Event Insurance to debit my account to correct the error.

5. ** Account Closure **: I will notify Daily Event Insurance immediately if I close the designated account.

---

## Signature

By signing below, I authorize Direct Deposit payments and confirm that:
- I am the account holder or authorized signer
  - The bank information provided is accurate
    - I understand and agree to the terms above
      `,
  },
]

// Helper to get document by type
export function getDocumentByType(type: DocumentType): DocumentTemplate | undefined {
  return demoDocuments.find((doc) => doc.type === type)
}

// Helper to get all document types with their titles
export function getDocumentTypesWithTitles(): { type: DocumentType; title: string }[] {
  return demoDocuments.map((doc) => ({
    type: doc.type,
    title: doc.title,
  }))
}
