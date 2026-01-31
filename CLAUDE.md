# CLAUDE.md - Boston Bingo Buddy

## Project Overview

Boston Bingo Buddy is an interactive, multi-themed bingo game built as a single-page React application. Players receive a 5x5 bingo card with themed prompts (Boston trivia, general "people bingo", travel, etc.) and mark squares when they find someone matching the description. Completing a row, column, or diagonal triggers a win with confetti celebration.

## Tech Stack

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite 5 (with SWC transpilation via `@vitejs/plugin-react-swc`)
- **Styling**: Tailwind CSS 3 with CSS variables for theming
- **Component Library**: shadcn/ui (54 components in `src/components/ui/`)
- **Routing**: React Router DOM v6
- **State Management**: Local state via custom hooks (`useState`, `useCallback`, `useMemo`)
- **Testing**: Vitest + @testing-library/react + jsdom
- **Linting**: ESLint 9 with typescript-eslint

## Project Structure

```
src/
├── components/
│   ├── ui/                  # shadcn/ui primitives (do not edit directly)
│   ├── BingoGame.tsx        # Main game component (layout, header, stats, theme selector)
│   ├── BingoCard.tsx        # 5x5 grid with BINGO header letters
│   ├── BingoCell.tsx        # Individual clickable cell (4 visual states)
│   ├── Confetti.tsx         # Win celebration animation (50 pieces, 3.5s)
│   └── NavLink.tsx          # React Router NavLink wrapper
├── pages/
│   ├── Index.tsx            # Home route — renders BingoGame
│   └── NotFound.tsx         # 404 catch-all
├── hooks/
│   ├── useBingoGame.ts      # Core game state & logic (grid, marks, win detection, theme)
│   ├── use-mobile.tsx       # Responsive breakpoint detection
│   └── use-toast.ts         # Toast notification system
├── data/
│   └── bingoThemes.ts       # All bingo themes & prompts (Boston, People, Travel, etc.)
├── lib/
│   └── utils.ts             # `cn()` helper (clsx + tailwind-merge)
├── test/
│   ├── setup.ts             # Vitest setup (window.matchMedia mock)
│   └── example.test.ts      # Sample test
├── App.tsx                  # Root component with QueryClient + BrowserRouter
├── main.tsx                 # ReactDOM entry point
├── index.css                # Global styles, CSS variables, design tokens
└── App.css                  # App-level styles
```

## Commands

```bash
npm run dev          # Start dev server on port 8080
npm run build        # Production build
npm run build:dev    # Development build
npm run lint         # Run ESLint
npm run test         # Run tests once (vitest run)
npm run test:watch   # Run tests in watch mode
npm run preview      # Preview production build
```

## Architecture & Patterns

### Game Logic

- **Grid**: 5x5 (25 cells), center cell (index 12) is always FREE SPACE
- **Win Detection**: 12 patterns checked — 5 rows, 5 columns, 2 diagonals
- **Prompt Selection**: Fisher-Yates shuffle of theme prompts, take first 24
- **Theme System**: Multiple prompt themes stored in `src/data/bingoThemes.ts`, selectable at runtime

### State Management

All game state lives in the `useBingoGame` custom hook:
- `grid` — array of 25 prompts (or null for free space)
- `markedCells` — `Set<number>` of marked indices
- `hasWon` — boolean
- `winningCells` — computed `Set<number>` (memoized)
- `currentTheme` — active theme identifier

No global state store; React Query is configured but unused.

### Component Hierarchy

```
App (Router + QueryClient)
└── Index (page)
    └── BingoGame (layout + theme selector)
        ├── Confetti (conditional on win)
        └── BingoCard (grid)
            └── BingoCell × 25 (individual squares)
```

### Styling Conventions

- **Utility-first** via Tailwind CSS classes
- **Conditional classes** via `cn()` from `@/lib/utils`
- **Design tokens** as CSS variables in `index.css` (HSL format)
- **Custom colors**: `bingo-cell`, `bingo-marked`, `bingo-free`, `celebration`
- **Fonts**: Inter (body), Fredoka (display/headings)
- **Animations**: `pop-in`, `shake`, `confetti`, `pulse-glow` (defined in `tailwind.config.ts`)
- **Responsive**: Mobile-first with `sm:` breakpoint for tablet/desktop
- **Shadows**: Custom `bingo-shadow` and `bingo-shadow-hover` classes in `index.css`

### TypeScript Configuration

- Strict mode is **disabled** (`strict: false`)
- `noImplicitAny: false`, `strictNullChecks: false`
- Path alias: `@/*` maps to `./src/*`
- Target: ES2020, JSX: react-jsx

## Conventions

### File & Naming

- **Components**: PascalCase filenames and exports (`BingoGame.tsx`)
- **Hooks**: camelCase with `use` prefix (`useBingoGame.ts`)
- **Data files**: camelCase (`bingoThemes.ts`)
- **Interfaces**: PascalCase, defined above the component that uses them
- **Constants**: UPPER_SNAKE_CASE for true constants (`FREE_SPACE_INDEX`, `GRID_SIZE`)

### Code Style

- Functional components with hooks only (no class components)
- Props destructured in function signature
- `useCallback` for functions passed as props or used in dependencies
- `useMemo` for expensive computations (winning cell detection)
- Immutable state updates (new Set/Array copies, never mutate)
- shadcn/ui `Button`, `Select`, etc. for interactive elements
- Lucide React for icons

### Adding New Themes

To add a new bingo theme, edit `src/data/bingoThemes.ts`:
1. Add a new entry to the `bingoThemes` array with a unique `id`, `name`, `description`, and `emoji`
2. Provide at least 24 prompts (the grid needs 24 + 1 free space)
3. Each prompt needs `id`, `text`, and optionally `emoji`
4. The theme will automatically appear in the theme selector dropdown

### Testing

- Vitest with jsdom environment and global API (no imports needed for `describe`/`it`/`expect`)
- Test files: `src/**/*.{test,spec}.{ts,tsx}`
- Setup file mocks `window.matchMedia` for responsive hook testing
- Use `@testing-library/react` for component tests

## Key Files to Know

| File | Purpose |
|------|---------|
| `src/hooks/useBingoGame.ts` | All game state, logic, win detection, theme switching |
| `src/data/bingoThemes.ts` | Theme definitions and all bingo prompts |
| `src/components/BingoGame.tsx` | Main UI layout, header, stats bar, theme selector |
| `src/components/BingoCard.tsx` | 5x5 grid rendering |
| `src/components/BingoCell.tsx` | Individual cell with 4 visual states |
| `src/index.css` | Design tokens, CSS variables, custom utility classes |
| `tailwind.config.ts` | Custom colors, fonts, animations, keyframes |

## Common Tasks

- **Change game theme colors**: Edit CSS variables in `src/index.css`
- **Add animations**: Add keyframes in `tailwind.config.ts` under `theme.extend.keyframes`
- **Modify win conditions**: Edit `WINNING_PATTERNS` in `src/hooks/useBingoGame.ts`
- **Add new UI components**: Use `npx shadcn-ui@latest add <component>` (configured via `components.json`)
