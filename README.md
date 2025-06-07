# FRAQTIV Landing Page

A modern, responsive landing page for FRAQTIV Advisory - an operator-led advisory firm that modernises mid-market companies' IT architecture, operations, and business model to make them buyer-ready and command higher multiples.

## 🚀 Features

- **Modern Design**: Clean, professional design with dark theme and brand colors
- **Responsive**: Fully responsive design that works on all devices
- **Interactive Elements**: Hover effects, smooth animations, and micro-interactions
- **Performance Optimized**: Built with Vite for fast development and optimized builds
- **Accessibility**: WCAG compliant with proper focus management and ARIA labels
- **SEO Ready**: Semantic HTML structure and meta tags

## 🛠️ Tech Stack

- **React 19** - Latest React with modern features
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework (via CDN)
- **Custom Components** - Modular, reusable React components

## 📦 Project Structure

```
fraqtiv-landing/
├── components/
│   ├── Navbar.tsx          # Navigation header
│   ├── Hero.tsx            # Hero section with main CTA
│   ├── Features.tsx        # Services showcase
│   ├── ValueProposition.tsx # Metrics and testimonial
│   ├── CallToAction.tsx    # Final CTA section
│   ├── Footer.tsx          # Footer with links
│   └── ScrollToTop.tsx     # Scroll to top button
├── App.tsx                 # Main app component
├── index.tsx              # React app entry point
├── index.html             # HTML template
├── index.css              # Base styles
├── types.ts               # TypeScript type definitions
└── package.json           # Dependencies and scripts
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

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

4. Open your browser and navigate to `http://localhost:5173`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## 🎨 Design System

### Colors
- **Primary**: Sky Blue (#0EA5E9)
- **Secondary**: Light Sky Blue (#38BDF8)
- **Background**: Dark Slate (#0F172A)
- **Cards**: Slate 800 (#1E293B)
- **Text**: Various shades of slate for hierarchy

### Typography
- **Headings**: Extrabold weights for impact
- **Body**: Regular weights for readability
- **Interactive**: Semibold for buttons and links

## 📧 Contact Integration

The site includes functional contact forms that open the user's default email client with pre-filled templates:

- **Readiness Call**: Opens email with structured inquiry
- **Newsletter Signup**: Pre-filled newsletter subscription request
- **General Contact**: Direct email link

## 🔧 Customization

### Updating Content
- Edit component files in the `components/` directory
- Update metadata in `metadata.json`
- Modify colors in the Tailwind config within `index.html`

### Adding New Sections
1. Create a new component in `components/`
2. Import and add to `App.tsx`
3. Update navigation links if needed

## 📱 Responsive Breakpoints

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## 🚀 Deployment

The site is ready for deployment to any static hosting service:

1. Build the project:
```bash
npm run build
```

2. Deploy the `dist/` folder to your hosting service

### Recommended Hosting
- Vercel
- Netlify
- GitHub Pages
- AWS S3 + CloudFront

## 📄 License

This project is proprietary to FRAQTIV Advisory.

## 🤝 Contributing

For internal development, please follow the established code style and component patterns.
