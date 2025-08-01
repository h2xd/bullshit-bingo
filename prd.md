# Product Requirements Document: Bullshit Bingo

**Version:** 1.0  
**Date:** August 2025  
**Status:** Active

---

## 1. Executive Summary

### 1.1 Product Vision
Bullshit Bingo is a client-side web application that enables users to create, share, and play customized bingo games. The application runs entirely in the browser, requires no backend infrastructure, and enables instant sharing through URL parameters.

### 1.2 Key Objectives
- Create an engaging, shareable bingo experience that works entirely client-side
- Enable quick game creation and distribution without user accounts
- Provide seamless gameplay across all modern devices
- Deploy as a static site on GitHub Pages with zero operational costs

### 1.3 Success Metrics
- Page load time < 2 seconds
- Game creation to sharing < 30 seconds
- 90% successful game loads from shared URLs
- Support for 100+ concurrent games in localStorage
- Zero backend dependencies

---

## 2. Product Overview

### 2.1 Target Users
- **Primary:** Office workers, meeting participants, conference attendees
- **Secondary:** Event organizers, team leaders, educators
- **Tertiary:** General entertainment seekers

### 2.2 Core Value Proposition
Create and share custom bingo games instantly without registration, installation, or payment. Perfect for meetings, conferences, or any situation requiring lighthearted engagement.

### 2.3 Product Scope
- **In Scope:** Game creation, sharing, playing, local persistence
- **Out of Scope:** User accounts, backend storage, multiplayer sync, monetization

---

## 3. Technical Architecture

### 3.1 Technology Stack
```
Frontend Framework: Next.js 14+ (App Router)
Deployment: GitHub Pages (Static Export)
Styling: Tailwind CSS + shadcn/ui
State Management: React useState/useEffect
Data Persistence: localStorage
URL Encoding: JSONCrush compression
Build Tool: Next.js with static optimization
CI/CD: GitHub Actions
```

### 3.2 Architecture Decisions

#### Static Deployment
- **Decision:** Use Next.js static export (`output: 'export'`)
- **Rationale:** GitHub Pages compatibility, zero hosting costs, optimal performance
- **Trade-offs:** No server-side features, limited to client-side functionality

#### Data Persistence
- **Decision:** localStorage over IndexedDB
- **Rationale:** 
  - 17x faster writes, 19x faster reads for small datasets
  - Simpler API, synchronous operations
  - Adequate 5-10MB storage for hundreds of games
- **Trade-offs:** No complex queries, size limitations

#### State Sharing
- **Decision:** URL parameters with JSONCrush compression
- **Rationale:** Instant sharing without backend, works across all platforms
- **Trade-offs:** URL length limitations, requires encoding/decoding

### 3.3 System Architecture Diagram
```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│                 │     │                  │     │                 │
│  GitHub Pages   │────▶│   Next.js App    │────▶│  localStorage   │
│  (Static Host)  │     │  (Client-Side)   │     │  (Persistence)  │
│                 │     │                  │     │                 │
└─────────────────┘     └──────────────────┘     └─────────────────┘
                               │
                               ▼
                        ┌──────────────────┐
                        │                  │
                        │  URL Parameters  │
                        │   (Sharing)      │
                        │                  │
                        └──────────────────┘
```

---

## 4. Functional Requirements

### 4.1 User Stories

#### Homepage - Saved Games List
**As a** returning user  
**I want to** see all my saved bingo games  
**So that I** can quickly access and play previous games

**Acceptance Criteria:**
- Display all games saved in localStorage on homepage
- Show game title, creation date, and last played date
- Provide quick actions: Play, Share, Delete
- Sort by: Most Recent, Alphabetical, Most Played
- Show empty state for new users with CTA to create first game

#### Game Creation
**As a** game creator  
**I want to** create a custom 25-item bingo card  
**So that I** can share it with others

**Acceptance Criteria:**
- Navigate to `/new` to create new game
- Input game title and 25 unique items
- Preview card before saving
- Generate shareable URL automatically
- Save to localStorage with unique ID

#### Game Playing
**As a** player  
**I want to** mark squares and track wins  
**So that I** can play bingo effectively

**Acceptance Criteria:**
- Click/tap squares to highlight with color
- Detect wins automatically (row/column/diagonal)
- Support multiple simultaneous wins
- Visual celebration on win
- Persist game state between sessions

#### Game Sharing
**As a** game creator  
**I want to** share my game via URL  
**So that** others can play without setup

**Acceptance Criteria:**
- One-click copy shareable URL
- URL contains compressed game configuration
- Recipients see identical game setup
- No registration required to play
- QR code generation for easy mobile sharing

### 4.2 Page Structure

#### 1. Homepage (`/`)
```
┌─────────────────────────────────────┐
│  🎯 Bullshit Bingo                  │
│  ─────────────────────────────────  │
│                                     │
│  [+ Create New Game]                │
│                                     │
│  Your Saved Games (3)               │
│  ┌─────────────┐ ┌─────────────┐   │
│  │ Meeting     │ │ Conference  │   │
│  │ Bingo       │ │ Buzzwords   │   │
│  │             │ │             │   │
│  │ Created:    │ │ Created:    │   │
│  │ 2 days ago  │ │ 1 week ago  │   │
│  │             │ │             │   │
│  │ [Play][Share│ │ [Play][Share│   │
│  │     [Delete]│ │     [Delete]│   │
│  └─────────────┘ └─────────────┘   │
└─────────────────────────────────────┘
```

#### 2. Game Creation (`/new`)
```
┌─────────────────────────────────────┐
│  Create New Bingo Game              │
│  ─────────────────────────────────  │
│                                     │
│  Game Title: [___________________] │
│                                     │
│  Enter 25 Bingo Items:              │
│  1. [_________________________]    │
│  2. [_________________________]    │
│  ...                                │
│  25. [________________________]    │
│                                     │
│  [Preview] [Save & Share]           │
└─────────────────────────────────────┘
```

#### 3. Game Play (`/play/[id]`)
```
┌─────────────────────────────────────┐
│  Meeting Bingo                      │
│  ─────────────────────────────────  │
│  ┌─────┬─────┬─────┬─────┬─────┐  │
│  │Synergy│ROI │Pivot│Scale│Agile│  │
│  ├─────┼─────┼─────┼─────┼─────┤  │
│  │Touch│Band-│FREE │Circle│Deep │  │
│  │Base │width│     │Back │Dive │  │
│  ├─────┼─────┼─────┼─────┼─────┤  │
│  │...  │...  │...  │...  │...  │  │
│  └─────┴─────┴─────┴─────┴─────┘  │
│                                     │
│  [Share Game] [New Game] [Reset]    │
└─────────────────────────────────────┘
```

### 4.3 Feature Specifications

#### Bingo Card Display
- 5x5 grid with FREE center square
- Responsive sizing (mobile/desktop)
- Click/tap to toggle highlight
- Visual feedback on interaction
- Persistent highlight state

#### Win Detection Algorithm
```javascript
// Winning patterns to check:
- 5 horizontal rows
- 5 vertical columns  
- 2 diagonals (top-left to bottom-right, top-right to bottom-left)
- Multiple wins highlighted simultaneously
- Real-time detection on each square toggle
```

#### URL Sharing Format
```
https://[domain]/play?data=[compressed-json]

Example:
https://mybingo.github.io/play?data=ᶅဩლ〦ぬ傘ⶑ...
```

---

## 5. Technical Specifications

### 5.1 Next.js Configuration

```javascript
// next.config.js
const nextConfig = {
  output: 'export',
  basePath: process.env.NODE_ENV === 'production' ? '/repository-name' : '',
  images: {
    unoptimized: true
  },
  trailingSlash: true
}
```

### 5.2 Data Models

#### Game Object Structure
```typescript
interface BingoGame {
  id: string;              // UUID v4
  title: string;           // Max 100 chars
  items: string[];         // Exactly 25 items
  createdAt: number;       // Unix timestamp
  lastPlayed: number;      // Unix timestamp
  playCount: number;       // Times played
}

interface GameState {
  gameId: string;
  markedSquares: number[]; // Indices of marked squares
  wonPatterns: string[];   // ['row-0', 'col-2', 'diag-1']
  startedAt: number;       // Unix timestamp
  completedAt?: number;    // Unix timestamp if won
}
```

### 5.3 localStorage Schema

```javascript
// localStorage keys
localStorage['bingo-games'] = {
  games: BingoGame[],
  version: 1
}

localStorage['bingo-state-{gameId}'] = GameState

localStorage['bingo-preferences'] = {
  theme: 'light' | 'dark',
  soundEnabled: boolean,
  highlightColor: string
}
```

### 5.4 URL Parameter Encoding

```javascript
// Encoding flow
Original: { title: "Meeting Bingo", items: [...] }
     ↓
JSON.stringify()
     ↓
JSONCrush.crush()
     ↓
encodeURIComponent()
     ↓
URL: ?data=ᶅဩლ〦ぬ傘ⶑ...
```

### 5.5 Component Architecture

```
src/
├── app/
│   ├── page.tsx              // Homepage with saved games
│   ├── new/
│   │   └── page.tsx          // Game creation
│   ├── play/
│   │   └── page.tsx          // Game play (reads URL params)
│   └── layout.tsx            // Root layout with providers
├── components/
│   ├── BingoCard.tsx         // 5x5 grid component
│   ├── GameList.tsx          // Saved games display
│   ├── ShareDialog.tsx       // Share URL + QR code
│   └── WinAnimation.tsx      // Celebration overlay
├── lib/
│   ├── storage.ts            // localStorage utilities
│   ├── gameLogic.ts          // Win detection algorithms
│   ├── urlEncoding.ts        // JSONCrush integration
│   └── utils.ts              // Helper functions
└── styles/
    └── globals.css           // Tailwind imports
```

---

## 6. Security & Accessibility

### 6.1 Security Requirements

#### Input Validation
- Sanitize all user inputs before storage
- Validate URL parameters before parsing
- Implement Zod schemas for type safety
- Maximum string lengths enforced

#### Content Security Policy
```html
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; 
               script-src 'self' 'unsafe-inline'; 
               style-src 'self' 'unsafe-inline';">
```

#### Data Protection
- No sensitive data in URLs
- No PII collection
- Clear data management (delete games)
- localStorage encryption for future consideration

### 6.2 Accessibility Standards

#### WCAG 2.1 AA Compliance
- Keyboard navigation for all interactions
- Focus indicators on all interactive elements
- Screen reader announcements for game state
- High contrast mode support

#### Specific Requirements
- Minimum contrast ratio: 4.5:1 (normal text), 3:1 (large text)
- Focus trap in modals
- Skip navigation links
- Semantic HTML structure
- ARIA labels for game squares

---

## 7. Testing Strategy

### 7.1 Unit Tests
```
- Game logic algorithms (win detection)
- URL encoding/decoding functions
- localStorage operations
- Data validation schemas
- Utility functions
Coverage target: 80%
```

### 7.2 Integration Tests
```
- Game creation flow
- URL sharing mechanism
- localStorage persistence
- Page navigation
- Component interactions
```

### 7.3 E2E Tests
```
- Complete game creation → share → play flow
- Cross-browser URL handling
- localStorage quota handling
- Mobile responsiveness
- Accessibility compliance
```

### 7.4 Performance Benchmarks
- First Contentful Paint: < 1.5s
- Time to Interactive: < 2s
- Win detection: < 1ms
- localStorage operations: < 5ms
- Bundle size: < 500KB

---

## 8. Deployment & Maintenance

### 8.1 GitHub Actions Workflow

```yaml
name: Deploy to GitHub Pages
on:
  push:
    branches: [main]
jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm test
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: ./out
      - uses: actions/deploy-pages@v4
```

### 8.2 Monitoring & Analytics
- Google Analytics 4 (privacy-compliant)
- Error tracking with Sentry
- Performance monitoring
- Custom event tracking:
  - Game creation
  - Game completion
  - Share actions
  - Win patterns

### 8.3 Maintenance Plan
- Monthly dependency updates
- Quarterly accessibility audits
- Security patch response: < 48 hours
- Feature requests via GitHub Issues
- Version control with semantic versioning

---

## 9. Implementation Timeline

### Phase 1: Core Functionality (Weeks 1-3)
- [x] Project setup with Next.js
- [ ] Homepage with saved games list
- [ ] Basic game creation (/new)
- [ ] localStorage integration
- [ ] Simple bingo card display

### Phase 2: Game Mechanics (Weeks 4-5)
- [ ] Square highlighting
- [ ] Win detection algorithm
- [ ] Game state persistence
- [ ] Basic sharing via URL

### Phase 3: Polish & Optimization (Weeks 6-7)
- [ ] shadcn/ui component integration
- [ ] Responsive design refinement
- [ ] URL compression with JSONCrush
- [ ] Share dialog with QR codes
- [ ] Win animations

### Phase 4: Production Ready (Week 8)
- [ ] Comprehensive testing
- [ ] Accessibility audit
- [ ] Performance optimization
- [ ] GitHub Actions setup
- [ ] Documentation

---

## 10. Risks & Mitigation

### Technical Risks
1. **URL Length Limitations**
   - Risk: Some browsers limit URLs to 2048 characters
   - Mitigation: Implement fallback to localStorage key sharing

2. **localStorage Quota**
   - Risk: 5-10MB limit could be reached
   - Mitigation: Implement cleanup for old games, compression

3. **Browser Compatibility**
   - Risk: Older browsers may not support features
   - Mitigation: Progressive enhancement, polyfills

### User Experience Risks
1. **Complex Sharing Process**
   - Risk: Users struggle with URL sharing
   - Mitigation: One-click copy, QR codes, clear instructions

2. **Lost Game States**
   - Risk: Clearing browser data loses games
   - Mitigation: Export/import functionality for backup

---

## Appendix A: API Documentation

### URL Parameter API
```
GET /play?data={compressed-game-data}

Decompression flow:
1. Extract 'data' parameter
2. decodeURIComponent()
3. JSONCrush.uncrush()
4. JSON.parse()
5. Validate with Zod schema
```

### localStorage API
```javascript
// Save game
saveGame(game: BingoGame): void

// Get all games
getGames(): BingoGame[]

// Delete game
deleteGame(gameId: string): void

// Save game state
saveGameState(gameId: string, state: GameState): void

// Get game state
getGameState(gameId: string): GameState | null
```

---

## Appendix B: Design System

### Color Palette
```css
--primary: #3B82F6;      /* Blue for CTAs */
--highlight: #FCD34D;    /* Yellow for marked squares */
--success: #10B981;      /* Green for wins */
--background: #FFFFFF;   /* White background */
--text: #111827;         /* Near-black text */
--border: #E5E7EB;       /* Light gray borders */
```

### Typography
- Font Family: System font stack
- Headings: Bold, 1.5-2.5rem
- Body: Regular, 1rem
- Buttons: Medium, 0.875rem

### Component Styling
- Border radius: 0.5rem (cards), 0.375rem (buttons)
- Shadows: Tailwind shadow-sm for cards
- Spacing: 8px grid system
- Transitions: 150ms ease-in-out