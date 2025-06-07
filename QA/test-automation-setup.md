# FRAQTIV Test Automation Setup

## Overview
This document outlines the setup and structure for creating user-focused test automation scripts that simulate real user interactions with the FRAQTIV landing page.

## Testing Framework Architecture

### Technology Stack
- **Testing Framework**: Jest + React Testing Library
- **Integration Testing**: Cypress
- **API Mocking**: MSW (Mock Service Worker)
- **Accessibility**: @axe-core/react
- **Coverage**: Istanbul/nyc

### Project Structure
```
QA/
├── __tests__/
│   ├── unit/
│   │   ├── components/
│   │   │   ├── MultiStepForm.test.tsx
│   │   │   ├── PhoneInput.test.tsx
│   │   │   └── ProgressBar.test.tsx
│   │   ├── utils/
│   │   │   ├── validation.test.ts
│   │   │   └── formatting.test.ts
│   │   └── api/
│   │       └── intake.test.ts
│   ├── integration/
│   │   ├── user-journeys/
│   │   │   ├── complete-form-flow.test.ts
│   │   │   ├── form-validation.test.ts
│   │   │   └── error-handling.test.ts
│   │   └── api-integration/
│   │       └── email-delivery.test.ts
│   └── e2e/
│       ├── cypress/
│       │   ├── integration/
│       │   ├── fixtures/
│       │   └── support/
│       └── playwright/
├── mocks/
│   ├── api/
│   │   └── handlers.ts
│   ├── data/
│   │   └── test-data.ts
│   └── server.ts
├── utils/
│   ├── test-helpers.ts
│   ├── user-scenarios.ts
│   └── assertions.ts
├── config/
│   ├── jest.config.js
│   ├── cypress.config.js
│   └── setup-tests.ts
└── reports/
    ├── coverage/
    └── test-results/
```

## User-Focused Testing Scenarios

### 1. Happy Path User Journeys
**Scenario: Successful Form Completion**
```typescript
// User persona: Tech startup CEO looking to exit in 3-5 years
const successfulUserJourney = {
  fullName: "Sarah Johnson",
  businessEmail: "sarah@techstartup.com",
  phoneNumber: "(555) 123-4567",
  companyName: "TechInnovate Inc",
  industry: "Technology",
  revenueRange: "$5M - $10M",
  exitTimeline: "3-5 years",
  painPoints: ["Scaling operations", "Financial optimization"],
  additionalNotes: "Looking for strategic advice on preparing for Series C"
};
```

### 2. Validation Error Scenarios
**Scenario: User Makes Common Mistakes**
```typescript
const validationErrorScenarios = [
  {
    name: "Invalid email format",
    input: { businessEmail: "invalid-email" },
    expectedError: "Please enter a valid business email"
  },
  {
    name: "Incomplete phone number",
    input: { phoneNumber: "(555) 123" },
    expectedError: "Please enter a valid 10-digit phone number"
  },
  {
    name: "No pain points selected",
    input: { painPoints: [] },
    expectedError: "Please select at least one pain point"
  }
];
```

### 3. Edge Case User Behaviors
**Scenario: Power User Interactions**
```typescript
const edgeCaseScenarios = [
  "User navigates back and forth between steps",
  "User uses keyboard shortcuts extensively",
  "User copies/pastes formatted phone numbers",
  "User selects 'Other' for multiple fields",
  "User submits form multiple times quickly"
];
```

## Test Implementation Examples

### 1. Component Unit Test Template
```typescript
// QA/__tests__/unit/components/MultiStepForm.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MultiStepForm } from '../../../components/MultiStepForm';

describe('MultiStepForm - User Interactions', () => {
  test('user can complete entire form flow', async () => {
    const user = userEvent.setup();
    render(<MultiStepForm />);
    
    // Step 1: Full Name
    await user.type(screen.getByPlaceholderText('John Smith'), 'Sarah Johnson');
    await user.click(screen.getByText('Next'));
    
    // Step 2: Business Email
    await user.type(screen.getByPlaceholderText('john@company.com'), 'sarah@techstartup.com');
    await user.click(screen.getByText('Next'));
    
    // Continue through all steps...
    // Assertions for successful completion
  });
});
```

### 2. Integration Test Template
```typescript
// QA/__tests__/integration/user-journeys/complete-form-flow.test.ts
import { render, screen } from '@testing-library/react';
import { server } from '../../mocks/server';
import { successfulSubmissionHandler } from '../../mocks/api/handlers';

describe('Complete Form Flow Integration', () => {
  beforeEach(() => {
    server.use(successfulSubmissionHandler);
  });

  test('user receives confirmation after successful submission', async () => {
    // Simulate complete user journey
    // Verify API calls
    // Check email notifications
  });
});
```

### 3. Cypress E2E Test Template
```typescript
// QA/__tests__/e2e/cypress/integration/form-submission.cy.ts
describe('FRAQTIV Form Submission', () => {
  it('allows user to complete intake form', () => {
    cy.visit('/');
    
    // Fill out form step by step
    cy.get('[data-testid="fullName"]').type('Sarah Johnson');
    cy.get('[data-testid="next-button"]').click();
    
    // Verify form submission
    cy.get('[data-testid="thank-you-message"]').should('be.visible');
  });
});
```

## User Simulation Patterns

### 1. Realistic Data Entry
- **Typing Speed**: Simulate human typing delays
- **Corrections**: Include backspace/correction behaviors  
- **Tab Navigation**: Test keyboard-only users
- **Copy/Paste**: Test clipboard operations

### 2. Mobile User Behaviors
- **Touch Interactions**: Tap, swipe, pinch-to-zoom
- **Keyboard Pop-ups**: Screen space reduction
- **Portrait/Landscape**: Orientation changes
- **Slow Networks**: Connection interruptions

### 3. Accessibility User Patterns
- **Screen Reader Navigation**: Tab order, ARIA labels
- **Keyboard Only**: No mouse interactions
- **High Contrast**: Visual impairment scenarios
- **Motor Impairments**: Slower interactions, precision issues

## Test Data Management

### 1. User Personas
```typescript
export const userPersonas = {
  techCEO: {
    profile: "Tech startup CEO, 35-45, venture-backed",
    formData: { /* realistic data */ }
  },
  manufacturingOwner: {
    profile: "Family business owner, 50-60, traditional industry",
    formData: { /* realistic data */ }
  },
  serviceProvider: {
    profile: "Professional services firm partner, 40-50",
    formData: { /* realistic data */ }
  }
};
```

### 2. Realistic Test Data
- **Names**: Common business names, various ethnicities
- **Emails**: Realistic business domains
- **Phone Numbers**: Various country codes and formats
- **Companies**: Industry-appropriate company names
- **Revenue Ranges**: Realistic for each industry

## Continuous Integration Setup

### 1. GitHub Actions Workflow
```yaml
name: Test Automation
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Run Unit Tests
        run: npm run test:unit
      - name: Run Integration Tests  
        run: npm run test:integration
      - name: Run E2E Tests
        run: npm run test:e2e
```

### 2. Test Reporting
- **Coverage Reports**: Istanbul/nyc integration
- **Test Results**: JUnit XML for CI/CD
- **Screenshots**: Failure documentation
- **Performance Metrics**: Load time tracking

## Quality Gates

### Definition of Done for Tests
- [ ] Test covers realistic user scenario
- [ ] Includes positive and negative test cases
- [ ] Validates user-facing behavior, not implementation
- [ ] Runs consistently across environments
- [ ] Provides clear failure diagnostics
- [ ] Executes within acceptable time limits

### Acceptance Criteria
- **Unit Tests**: 90%+ code coverage
- **Integration Tests**: All critical user flows covered
- **E2E Tests**: All major user journeys automated
- **Performance**: All tests complete in <5 minutes
- **Reliability**: <1% flaky test rate 