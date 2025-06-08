# FRAQTIV Landing Page

A responsive landing page for FRAQTIV Advisory - an operator-led advisory firm helping mid-market companies modernize their IT architecture, operations, and business model to increase company valuation.

## 🛠️ Tech Stack

- **React 19** with **TypeScript**
- **Vite** for fast builds and development
- **Tailwind CSS** for styling
- **React Router** for navigation
- **React Hook Form** for form handling
- **SendGrid** for email integration
- **Jest** for testing

## 📦 Project Structure

```
fraqtiv-landing/
├── components/         # Core UI components
├── src/
│   ├── api/            # API integrations
│   └── pages/          # Page components
├── public/             # Static assets
├── QA/                 # Testing resources
├── App.tsx             # Main app component
├── index.tsx           # Application entry point
└── types.ts            # TypeScript definitions
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd fraqtiv-landing
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser: `http://localhost:5173`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run test` - Run tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Generate test coverage
- `npm run security-check` - Check for security vulnerabilities

## 📧 Contact Integration

The site uses SendGrid for handling form submissions. See `EMAIL_SETUP.md` for configuration details.

## 🚀 Deployment

The project is configured for deployment to Vercel:

1. Build the project:
```bash
npm run build
```

2. Deploy using Vercel CLI or GitHub integration

## 📄 License

This project is proprietary to FRAQTIV Advisory.

## 🤝 Contributing

For internal development, please follow the established code style and refer to the QA documentation for testing requirements.
