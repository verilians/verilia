# Bible Counsellor AI Chatbot

A modern, responsive Bible counselling chatbot built with Next.js 15, React 19, and Tailwind CSS v4.

## Features

- **Fixed Vertical Sidebar**: Icon-based navigation with New Chat, History, and Settings
- **Chat Interface**: Real-time messaging with bot and user message bubbles
- **Responsive Design**: Optimized for desktop and tablet screens
- **Smooth Animations**: CSS transitions and animations for enhanced UX
- **Dark Mode Support**: Automatic theme switching based on system preferences
- **Modern UI**: Clean, minimal design with purple accent colors

## Project Structure

```
verilia/
├── app/
│   ├── layout.js         # Root layout with sidebar and main chat panel
│   ├── page.js           # Main chat page with message handling
│   ├── favicon.ico       # Site favicon
│   └── globals.css       # Legacy global styles (replaced)
├── components/
│   ├── Sidebar.js        # Left vertical icon bar with navigation
│   ├── ChatHeader.js     # Chat title + version badge
│   ├── ChatBubble.js     # Chat message bubble (bot/user)
│   └── ChatInput.js      # Bottom input box with send functionality
├── hooks/
│   └── useChat.js        # Chat state management and API simulation
├── styles/
│   └── globals.css       # Enhanced Tailwind CSS with custom animations
├── utils/
│   └── icons.js          # Centralized SVG icon components
├── public/               # Static assets
├── package.json          # Dependencies and scripts
├── next.config.mjs       # Next.js configuration
├── jsconfig.json         # JavaScript path mapping
└── README.md             # Project documentation
```

## Components

### Sidebar.js
- Fixed vertical sidebar with icon buttons
- Hover tooltips for better UX
- Active state highlighting
- Smooth transitions

### ChatHeader.js
- Displays chat title "Bible Counsellor"
- Version badge showing "v3.2"
- Online status indicator
- Clean, minimal design

### ChatBubble.js
- Different styles for bot (white) and user (purple) messages
- Avatar icons for bot and user
- Timestamp display
- Smooth entrance animations
- Responsive message width

### ChatInput.js
- Textarea with auto-resize
- Send button with disabled state
- Enter key support (Shift+Enter for new line)
- Focus ring and hover effects

### useChat.js
- Message state management
- Loading states
- Chat history tracking
- Simulated bot responses
- Error handling

## Styling

- **Tailwind CSS v4**: Latest version with inline theme configuration
- **Custom Animations**: Fade-in, slide-in effects for chat bubbles
- **Purple Theme**: Consistent purple accent colors throughout
- **Responsive**: Mobile-first design approach
- **Dark Mode**: Automatic theme switching

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Technologies Used

- **Next.js 15.4.1** - React framework with App Router
- **React 19.1.0** - Latest React version
- **Tailwind CSS v4** - Utility-first CSS framework
- **Geist Fonts** - Modern typography from Vercel
- **JavaScript** - ES6+ features and modern syntax

## Future Enhancements

- Real AI integration for Bible counselling
- Chat history persistence
- User authentication
- Voice input/output
- Bible verse integration
- Prayer request tracking
- Community features
