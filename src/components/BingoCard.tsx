import { BingoCell } from "./BingoCell";
import { BingoPrompt } from "@/data/bingoThemes";

interface BingoCardProps {
  grid: (BingoPrompt | null)[];
  markedCells: Set<number>;
  winningCells: Set<number>;
  onCellClick: (index: number) => void;
}

export const BingoCard = ({ 
  grid, 
  markedCells, 
  winningCells,
  onCellClick 
}: BingoCardProps) => {
  const FREE_SPACE_INDEX = 12; // Center of 5x5 grid

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* BINGO Header */}
      <div className="grid grid-cols-5 gap-1 sm:gap-2 mb-2 sm:mb-3">
        {['B', 'I', 'N', 'G', 'O'].map((letter, i) => (
          <div 
            key={letter + i}
            className="aspect-square flex items-center justify-center bg-primary text-primary-foreground font-display font-bold text-2xl sm:text-4xl rounded-lg bingo-shadow"
          >
            {letter}
          </div>
        ))}
      </div>

      {/* Bingo Grid */}
      <div className="grid grid-cols-5 gap-1 sm:gap-2 bg-border/50 p-1 sm:p-2 rounded-xl bingo-shadow">
        {grid.map((prompt, index) => (
          <BingoCell
            key={index}
            prompt={prompt}
            isMarked={markedCells.has(index) || index === FREE_SPACE_INDEX}
            isFreeSpace={index === FREE_SPACE_INDEX}
            isWinningCell={winningCells.has(index)}
            onClick={() => onCellClick(index)}
          />
        ))}
      </div>
    </div>
  );
};
