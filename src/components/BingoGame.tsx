import { BingoCard } from "./BingoCard";
import { Confetti } from "./Confetti";
import { useBingoGame } from "@/hooks/useBingoGame";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Shuffle, RotateCcw, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";

export const BingoGame = () => {
  const {
    grid,
    markedCells,
    winningCells,
    hasWon,
    toggleCell,
    resetGame,
    markedCount,
    currentTheme,
    themes,
    changeTheme,
  } = useBingoGame();

  return (
    <div className="min-h-screen bg-background py-6 px-4 sm:py-10">
      <Confetti isActive={hasWon} />

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="text-center mb-6 sm:mb-10">
          <h1 className="font-display text-4xl sm:text-6xl font-bold text-foreground mb-2 tracking-tight">
            {currentTheme.emoji} {currentTheme.name} <span className="text-primary">BINGO</span>
          </h1>
          <p className="text-muted-foreground text-base sm:text-lg max-w-md mx-auto mb-4">
            {currentTheme.description}. Find someone who matches each square!
          </p>

          {/* Theme Selector */}
          <div className="flex items-center justify-center gap-2">
            <span className="text-sm text-muted-foreground">Theme:</span>
            <Select value={currentTheme.id} onValueChange={changeTheme}>
              <SelectTrigger className="w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {themes.map((theme) => (
                  <SelectItem key={theme.id} value={theme.id}>
                    {theme.emoji} {theme.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </header>

        {/* Win Banner */}
        {hasWon && (
          <div className="mb-6 bg-primary text-primary-foreground rounded-xl p-4 sm:p-6 text-center animate-pop-in bingo-shadow">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Trophy className="w-6 h-6 sm:w-8 sm:h-8" />
              <span className="font-display text-2xl sm:text-3xl font-bold">BINGO!</span>
              <Trophy className="w-6 h-6 sm:w-8 sm:h-8" />
            </div>
            <p className="text-primary-foreground/90">
              Congratulations! You've made some great connections!
            </p>
          </div>
        )}

        {/* Stats Bar */}
        <div className="flex items-center justify-between mb-4 sm:mb-6 bg-card rounded-lg p-3 sm:p-4 bingo-shadow">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-primary animate-pulse" />
            <span className="text-sm sm:text-base text-muted-foreground">
              <span className="font-bold text-foreground">{markedCount}</span> / 24 squares marked
            </span>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={resetGame}
              className={cn(
                "gap-1.5 text-xs sm:text-sm",
                hasWon ? "border-primary text-primary hover:bg-primary/10" : ""
              )}
            >
              {hasWon ? <RotateCcw className="w-4 h-4" /> : <Shuffle className="w-4 h-4" />}
              <span className="hidden sm:inline">{hasWon ? "Play Again" : "New Card"}</span>
            </Button>
          </div>
        </div>

        {/* Bingo Card */}
        <BingoCard
          grid={grid}
          markedCells={markedCells}
          winningCells={winningCells}
          onCellClick={toggleCell}
        />

        {/* Instructions */}
        <footer className="mt-6 sm:mt-10 text-center">
          <div className="inline-flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-bingo-cell border border-border" />
              <span>Available</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-bingo-marked" />
              <span>Marked</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-bingo-free" />
              <span>Free Space</span>
            </div>
          </div>
          <p className="mt-4 text-xs text-muted-foreground/70">
            Tap a square when you find someone who matches. Get 5 in a row to win!
          </p>
        </footer>
      </div>
    </div>
  );
};
