# User Experience Stories - Onboarding System

This document contains user experience stories for testing and validation of the Daily Event Insurance partner onboarding system.

---

## M1: Partner Registration Flow

### F1.1 Multi-Step Registration Form

**UX-1.1.1: First-time partner starts onboarding**
```
AS A potential partner visiting the onboarding page
WHEN I land on /onboarding
THEN I should see a clear welcome message and progress stepper showing 3 steps
AND the first step (Customize Coverage) should be highlighted
AND I should see estimated earnings preview based on default values
```

**UX-1.1.2: Partner selects coverage products**
```
AS A partner in step 1 (Customize Coverage)
WHEN I select different insurance products (accident, medical, equipment)
THEN the earnings preview should update in real-time
AND selected products should be visually highlighted
AND I should see pricing for each product type
```

**UX-1.1.3: Partner customizes brand colors**
```
AS A partner in step 1
WHEN I use the color picker to select my brand color
THEN the preview elements should update to show my brand color
AND the color should be saved when I proceed to the next step
```

**UX-1.1.4: Partner enters business information**
```
AS A partner in step 2 (Business Info)
WHEN I fill out the required fields (business name, contact info, type)
THEN I should see clear validation feedback for each field
AND invalid fields should show specific error messages
AND I should not be able to proceed until all required fields are valid
```

**UX-1.1.5: Partner uses website auto-fill**
```
AS A partner in step 2
WHEN I enter my business website URL and click "Auto-fill"
THEN the system should attempt to extract my business info
AND if successful, the form fields should be pre-populated
AND I should see a success message indicating what was found
```

**UX-1.1.6: Partner selects integration method**
```
AS A partner in step 3 (Integration)
WHEN I view the integration options (Widget, API, Manual)
THEN I should see clear descriptions of each option
AND I should be able to select my preferred method
AND the AI assistant should be available to help with questions
```

**UX-1.1.7: Partner completes registration successfully**
```
AS A partner who has completed all 3 steps
WHEN I submit the registration form
THEN I should see a success celebration screen
AND I should receive a confirmation email
AND I should be redirected to the document signing flow
```

---

### F1.2 AI Integration Assistant

**UX-1.2.1: Partner opens AI assistant**
```
AS A partner on any onboarding step
WHEN I click the floating AI assistant button
THEN a chat panel should expand smoothly
AND I should see suggested prompts for common questions
AND I should see quick-select buttons for popular platforms
```

**UX-1.2.2: Partner asks about specific platform**
```
AS A partner using the AI assistant
WHEN I click "Mindbody" or type "How do I integrate with Mindbody?"
THEN I should receive platform-specific integration guidance
AND code snippets should be properly formatted with copy buttons
AND the response should include step-by-step instructions
```

**UX-1.2.3: Partner copies code snippet**
```
AS A partner viewing a code snippet in the AI chat
WHEN I click the copy button
THEN the code should be copied to my clipboard
AND I should see visual feedback confirming the copy
```

**UX-1.2.4: Partner asks follow-up questions**
```
AS A partner in an AI conversation
WHEN I ask follow-up questions
THEN the assistant should maintain context from previous messages
AND responses should be relevant to my specific situation
```

**UX-1.2.5: AI assistant handles unavailable API**
```
AS A partner when the AI API is unavailable
WHEN I send a message
THEN I should receive a helpful fallback response
AND the system should not crash or show technical errors
```

---

## M2: Document Signing Flow

### F2.1 Document Templates System

**UX-2.1.1: Partner views document list**
```
AS A partner on the documents page
WHEN the page loads
THEN I should see all 6 document types listed
AND required documents (4) should be clearly marked
AND optional documents (2) should show "Optional" badge
AND my signing progress should be visible
```

**UX-2.1.2: Partner sees personalized documents**
```
AS A partner viewing a document
WHEN I open any document for signing
THEN my business name should be populated in the content
AND my contact information should be filled in
AND the effective date should be current
```

**UX-2.1.3: Partner distinguishes required vs optional**
```
AS A partner viewing the document list
WHEN I look at the documents
THEN required documents should have a different visual indicator
AND I should understand which documents must be signed before activation
AND optional documents should be clearly labeled as "can complete later"
```

---

### F2.2 Digital Signature Capture

**UX-2.2.1: Partner draws signature**
```
AS A partner signing a document
WHEN I use the signature pad
THEN I should be able to draw my signature with mouse or touch
AND the drawing should be smooth and responsive
AND I should see a clear signature line guide
```

**UX-2.2.2: Partner clears signature**
```
AS A partner who made a mistake in my signature
WHEN I click "Clear"
THEN the signature pad should be completely cleared
AND I should be able to draw again
```

**UX-2.2.3: Partner types signature**
```
AS A partner who prefers typing
WHEN I switch to "Type" signature mode
THEN I should be able to type my name
AND the typed name should appear in a signature-style font
```

**UX-2.2.4: Partner signs on mobile device**
```
AS A partner using a mobile device
WHEN I sign a document
THEN the signature pad should be touch-responsive
AND the pad should be appropriately sized for mobile
AND I should be able to draw with my finger smoothly
```

---

### F2.3 Document Viewer & Signing

**UX-2.3.1: Partner opens document for review**
```
AS A partner clicking on a document
WHEN the document viewer modal opens
THEN I should see the full document content
AND my partner data should be populated
AND the signature area should be at the bottom
```

**UX-2.3.2: Partner reviews before signing**
```
AS A partner reviewing a document
WHEN I scroll through the content
THEN I should be able to read the entire document
AND important sections should be clearly formatted
AND I should not be able to sign without scrolling to the end
```

**UX-2.3.3: Partner signs and submits**
```
AS A partner ready to sign
WHEN I provide my signature and click "Sign Document"
THEN I should see a loading indicator
AND upon success, the document should be marked as signed
AND I should be auto-advanced to the next unsigned document
```

**UX-2.3.4: Partner navigates between documents**
```
AS A partner with multiple documents
WHEN I use the progress indicator
THEN I should be able to click on any document to view it
AND signed documents should show checkmarks
AND I should see my overall progress
```

---

### F2.4 Signing Confirmation

**UX-2.4.1: Partner completes all required documents**
```
AS A partner who just signed the last required document
WHEN the signing is complete
THEN I should see a celebration confirmation modal
AND the modal should list all signed documents
AND I should see next steps clearly
```

**UX-2.4.2: Partner proceeds to dashboard**
```
AS A partner viewing the confirmation modal
WHEN I click "Go to Dashboard"
THEN I should be redirected to my partner dashboard
AND my account status should show as "under_review"
```

**UX-2.4.3: Partner receives confirmation email**
```
AS A partner who completed signing
WHEN the confirmation is shown
THEN I should receive an email confirmation
AND the email should list all signed documents with timestamps
AND the email should include a dashboard link
```

---

### F2.5 PDF Generation

**UX-2.5.1: Partner downloads signed documents**
```
AS A partner who has signed documents
WHEN I click "Download PDF" for any signed document
THEN a PDF file should be downloaded
AND the PDF should include the full document content
AND my signature should be embedded in the PDF
```

**UX-2.5.2: Partner downloads all documents**
```
AS A partner requesting all signed documents
WHEN I download multiple documents
THEN each document should be properly formatted
AND all documents should include timestamps
AND the PDFs should be professional quality
```

---

## M3: Change Request Workflow

### F3.1 Partner Change Request Modal

**UX-3.1.1: Partner initiates change request**
```
AS A partner in my dashboard
WHEN I click "Request Changes"
THEN I should see a modal with change request options
AND I should be able to choose between branding and content changes
AND current values should be displayed for reference
```

**UX-3.1.2: Partner requests branding changes**
```
AS A partner requesting branding changes
WHEN I update logo URL or brand colors
THEN I should see a preview of the new branding
AND I should be able to add notes explaining the change
AND validation should prevent invalid color values
```

**UX-3.1.3: Partner submits change request**
```
AS A partner submitting a change request
WHEN I click "Submit Request"
THEN I should see a confirmation message
AND the request should appear in my pending requests list
AND I should receive a confirmation email
```

**UX-3.1.4: Partner views request status**
```
AS A partner with pending requests
WHEN I view my dashboard
THEN I should see all my change requests with current status
AND status should be clearly indicated (pending, in_review, approved, rejected)
AND I should see when each request was submitted
```

---

### F3.2 Email Notifications (E3)

**UX-3.2.1: Partner receives approval notification**
```
AS A partner whose change request was approved
WHEN the admin approves my request
THEN I should receive an email notification
AND the email should clearly show "APPROVED" status
AND the email should include admin review notes if any
AND the email should link to my dashboard
```

**UX-3.2.2: Partner receives rejection notification**
```
AS A partner whose change request was rejected
WHEN the admin rejects my request
THEN I should receive an email notification
AND the email should clearly show "REJECTED" status
AND the email should include the rejection reason
AND the email should provide guidance on next steps
```

**UX-3.2.3: Partner reviews notification details**
```
AS A partner reading a notification email
WHEN I review the email content
THEN I should see my request number
AND I should see the request type (branding/content)
AND the email should be properly branded with company colors
```

---

## M4: Admin Approval System

### F4.1 Admin Change Requests Page

**UX-4.1.1: Admin views pending requests**
```
AS AN admin on the change requests page
WHEN I load the page
THEN I should see all pending requests sorted by date
AND I should see request counts per status
AND I should be able to filter by status tabs
```

**UX-4.1.2: Admin reviews request details**
```
AS AN admin clicking on a request
WHEN the detail modal opens
THEN I should see current vs requested values side-by-side
AND I should see the partner's notes
AND I should have approve/reject action buttons
```

**UX-4.1.3: Admin approves request**
```
AS AN admin approving a request
WHEN I click "Approve" and confirm
THEN the request status should update to "approved"
AND the partner should receive an email notification
AND I should be able to add review notes
```

**UX-4.1.4: Admin rejects request**
```
AS AN admin rejecting a request
WHEN I click "Reject"
THEN I should be required to provide a rejection reason
AND the request status should update to "rejected"
AND the partner should receive an email with the reason
```

---

## E4: Document Template Editor

### Enhanced Editor Features

**UX-E4.1: Admin opens template editor**
```
AS AN admin editing a document template
WHEN I click "Edit" on any template
THEN I should see a split-view editor
AND the left side should show the markdown content
AND the right side should show a live preview
```

**UX-E4.2: Admin uses variable insertion**
```
AS AN admin editing a template
WHEN I click "Variables" to show the insertion panel
THEN I should see all 8 available template variables
AND each variable should show its name and example value
AND clicking a variable should insert it at cursor position
```

**UX-E4.3: Admin sees live preview**
```
AS AN admin typing in the editor
WHEN I make changes to the content
THEN the preview should update in real-time
AND template variables should be replaced with sample data
AND markdown formatting should be rendered properly
```

**UX-E4.4: Admin toggles split view**
```
AS AN admin who wants more editing space
WHEN I toggle off the split view
THEN the editor should expand to full width
AND I should be able to toggle it back on
```

**UX-E4.5: Admin saves template changes**
```
AS AN admin saving template changes
WHEN I click "Save Changes"
THEN the template should be saved with an incremented version
AND I should see a success confirmation
AND existing signed documents should remain unaffected
```

**UX-E4.6: Admin previews with different variables**
```
AS AN admin reviewing the preview
WHEN I look at the rendered preview
THEN all {{VARIABLE}} placeholders should show sample values
AND the preview should look exactly like what partners will see
AND I should understand how variables will be replaced
```

---

## Test Scenarios Summary

| Feature | Stories | Priority |
|---------|---------|----------|
| Registration Form | 7 | Critical |
| AI Assistant | 5 | High |
| Document Templates | 3 | Critical |
| Signature Capture | 4 | Critical |
| Document Viewer | 4 | Critical |
| Signing Confirmation | 3 | High |
| PDF Generation | 2 | High |
| Change Request Modal | 4 | High |
| Email Notifications (E3) | 3 | High |
| Admin Approvals | 4 | High |
| Template Editor (E4) | 6 | Medium |

**Total: 45 User Experience Stories**

---

## Acceptance Test Checklist

### Registration Flow
- [ ] Partner can complete all 3 steps
- [ ] Validation prevents invalid data
- [ ] Website auto-fill works correctly
- [ ] AI assistant provides helpful responses
- [ ] Success state shows properly

### Document Signing
- [ ] All 6 document types display correctly
- [ ] Signature pad works on desktop and mobile
- [ ] Documents populate with partner data
- [ ] Progress tracking updates correctly
- [ ] Confirmation modal shows after completion
- [ ] Confirmation email is sent

### Change Requests
- [ ] Partners can submit requests
- [ ] Admins can approve/reject
- [ ] Email notifications are sent
- [ ] Status updates correctly

### Template Editor
- [ ] Split view toggles correctly
- [ ] Variables insert at cursor
- [ ] Live preview updates in real-time
- [ ] Version increments on save
