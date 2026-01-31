import { cn } from "@/lib/utils";
import { BingoPrompt, FREE_SPACE_TEXT } from "@/data/bingoThemes";

interface BingoCellProps {
  prompt: BingoPrompt | null;
  isMarked: boolean;
  isFreeSpace: boolean;
  onClick: () => void;
  isWinningCell?: boolean;
}

export const BingoCell = ({ 
  prompt, 
  isMarked, 
  isFreeSpace, 
  onClick,
  isWinningCell = false 
}: BingoCellProps) => {
  const handleClick = () => {
    if (!isFreeSpace) {
      onClick();
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={isFreeSpace}
      className={cn(
        "relative aspect-square p-2 sm:p-3 rounded-lg border-2 transition-all duration-200",
        "flex flex-col items-center justify-center text-center",
        "font-medium text-xs sm:text-sm leading-tight",
        "focus:outline-none focus:ring-2 focus:ring-primary/50",
        // Default state
        !isMarked && !isFreeSpace && [
          "bg-bingo-cell border-border hover:border-primary/50",
          "hover:bingo-shadow-hover hover:scale-[1.02] cursor-pointer",
          "active:scale-[0.98]"
        ],
        // Marked state
        isMarked && !isFreeSpace && [
          "bg-bingo-marked border-primary text-primary-foreground",
          "animate-pop-in cursor-pointer",
          isWinningCell && "animate-pulse-glow"
        ],
        // Free space
        isFreeSpace && [
          "bg-bingo-free border-bingo-free text-primary-foreground",
          "cursor-default font-display font-bold text-base sm:text-lg"
        ]
      )}
    >
      {isFreeSpace ? (
        <span className="drop-shadow-sm">{FREE_SPACE_TEXT}</span>
      ) : (
        <>
          {prompt?.emoji && (
            <span className="text-lg sm:text-2xl mb-1">{prompt.emoji}</span>
          )}
          <span className={cn(
            "line-clamp-3",
            isMarked && "drop-shadow-sm"
          )}>
            {prompt?.text}
          </span>
          {isMarked && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <svg 
                className="w-full h-full text-primary-foreground/20" 
                viewBox="0 0 100 100"
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
                strokeLinecap="round"
              >
                <path d="M20,50 L40,70 L80,30" />
              </svg>
            </div>
          )}
        </>
      )}
    </button>
  );
};
