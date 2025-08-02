# Yesveri - AI-Powered Content Verification Platform

Yesveri is an advanced content verification platform that helps users assess the credibility and trustworthiness of online content. Using AI-powered analysis, blockchain verification, and comprehensive source checking, Yesveri provides detailed trust scores and verification results for text content and URLs.

## 🚀 Features

### Core Verification Capabilities
- **Content Analysis**: Advanced AI-powered content classification and readability assessment
- **Sentiment Analysis**: Real-time sentiment detection using Google's Perspective API
- **Fact Checking**: Integration with Google Fact Check API for comprehensive verification
- **Source Credibility**: Domain authority assessment and source verification
- **Trust Score Calculation**: Weighted scoring system combining multiple verification factors
- **Blockchain Verification**: Immutable proof of verification results

### Advanced Features
- **Multi-language Support**: Content verification in multiple languages including Nigerian languages
- **URL Processing**: Full webpage content extraction and analysis
- **Historical Tracking**: Verification history and statistics tracking
- **Real-time Results**: Instant verification with detailed breakdowns
- **Responsive Design**: Modern, mobile-first UI built with Tailwind CSS

## 🛠 Technology Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with shadcn/ui components
- **Routing**: React Router DOM
- **State Management**: React Query for server state
- **UI Components**: Radix UI primitives with custom styling
- **Icons**: Lucide React
- **Backend Integration**: Supabase (enabled)

## 📋 Prerequisites

- Node.js (16.0 or higher)
- npm or yarn package manager

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone <YOUR_GIT_URL>
cd <YOUR_PROJECT_NAME>
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Setup
The project uses Supabase for backend functionality. Environment variables are automatically configured for the connected Supabase project.

### 4. Start Development Server
```bash
npm run dev
```

Your application will be available at `http://localhost:5173`

## 🏗 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── Header.tsx      # Navigation header
│   ├── Footer.tsx      # Site footer
│   └── ...
├── pages/              # Route components
│   ├── Index.tsx       # Homepage
│   ├── Verify.tsx      # Verification page
│   ├── About.tsx       # About page
│   └── ...
├── lib/                # Utility libraries
│   ├── verification-engine.ts        # Main verification logic
│   ├── source-verification-engine.ts # Source credibility engine
│   └── utils.ts        # General utilities
├── hooks/              # Custom React hooks
└── main.tsx           # Application entry point
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🌐 API Integrations

Yesveri integrates with several external APIs:

- **OpenAI API**: Content classification and preprocessing
- **Google Fact Check API**: Fact verification
- **Google Perspective API**: Sentiment analysis
- **Perplexity API**: Enhanced source verification

## 📊 Verification Process

1. **Content Preprocessing**: Extract and clean input content
2. **Sentiment Analysis**: Analyze emotional tone and bias
3. **Fact Checking**: Cross-reference claims with verified sources
4. **Source Verification**: Assess domain credibility and authority
5. **Content Classification**: Categorize content type and quality
6. **Trust Score Calculation**: Generate weighted trust score (0-100%)
7. **Blockchain Recording**: Store verification proof on blockchain

## 🎯 Usage

### Verifying Content
1. Navigate to the "Verify Content" page
2. Input text content or paste a URL
3. Click "Verify" to start the analysis
4. Review the comprehensive verification results including:
   - Overall trust score
   - Sentiment analysis
   - Fact-check results
   - Source credibility assessment
   - Detailed explanations

### Understanding Trust Scores
- **80-100%**: Highly trustworthy content
- **60-79%**: Generally reliable content
- **40-59%**: Mixed reliability, verify claims
- **20-39%**: Low trustworthiness, significant concerns
- **0-19%**: Highly unreliable or false content

## 🚀 Deployment

### Lovable Platform
1. Open your [Lovable Project](https://lovable.dev/projects/5b8bdfd1-c7ed-4eb8-a4ac-e5d6f113a3ae)
2. Click "Share" → "Publish"
3. Your app will be deployed with a Lovable subdomain

### Custom Domain
Navigate to Project → Settings → Domains in Lovable to connect your custom domain.

### Self-Hosting
The project generates standard web application code that can be deployed on any hosting platform:
- Vercel
- Netlify
- AWS S3 + CloudFront
- GitHub Pages
- Any static hosting service

## 🤝 Contributing

This project is built with Lovable's AI-powered development platform. You can contribute by:

1. **Using Lovable**: Visit the [project link](https://lovable.dev/projects/5b8bdfd1-c7ed-4eb8-a4ac-e5d6f113a3ae) and make changes via AI prompts
2. **Local Development**: Clone the repo, make changes, and push to the connected GitHub repository
3. **GitHub Codespaces**: Use the integrated development environment

## 📝 License

This project is developed using Lovable platform. Please refer to your Lovable subscription terms for usage rights.

## 🆘 Support

- **Lovable Documentation**: [https://docs.lovable.dev/](https://docs.lovable.dev/)
- **Lovable Discord**: [Community Support](https://discord.com/channels/1119885301872070706/1280461670979993613)
- **Project URL**: [https://lovable.dev/projects/5b8bdfd1-c7ed-4eb8-a4ac-e5d6f113a3ae](https://lovable.dev/projects/5b8bdfd1-c7ed-4eb8-a4ac-e5d6f113a3ae)

## 🔮 Roadmap

- Enhanced multi-language support
- Advanced bias detection
- Integration with more fact-checking APIs
- Real-time collaboration features
- Mobile application
- Browser extension

---

Built with ❤️ using [Lovable](https://lovable.dev) - The AI-powered web development platform