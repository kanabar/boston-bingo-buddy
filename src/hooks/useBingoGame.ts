import { useState, useCallback, useMemo } from "react";
import { bostonBingoPrompts, BingoPrompt } from "@/data/bostonBingoPrompts";

const GRID_SIZE = 25;
const FREE_SPACE_INDEX = 12;

// Winning combinations (rows, columns, diagonals)
const WINNING_PATTERNS = [
  // Rows
  [0, 1, 2, 3, 4],
  [5, 6, 7, 8, 9],
  [10, 11, 12, 13, 14],
  [15, 16, 17, 18, 19],
  [20, 21, 22, 23, 24],
  // Columns
  [0, 5, 10, 15, 20],
  [1, 6, 11, 16, 21],
  [2, 7, 12, 17, 22],
  [3, 8, 13, 18, 23],
  [4, 9, 14, 19, 24],
  // Diagonals
  [0, 6, 12, 18, 24],
  [4, 8, 12, 16, 20],
];

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function generateGrid(): (BingoPrompt | null)[] {
  const shuffled = shuffleArray(bostonBingoPrompts);
  const selected = shuffled.slice(0, GRID_SIZE - 1); // -1 for free space
  
  const grid: (BingoPrompt | null)[] = [];
  let promptIndex = 0;
  
  for (let i = 0; i < GRID_SIZE; i++) {
    if (i === FREE_SPACE_INDEX) {
      grid.push(null); // Free space
    } else {
      grid.push(selected[promptIndex]);
      promptIndex++;
    }
  }
  
  return grid;
}

export function useBingoGame() {
  const [grid, setGrid] = useState<(BingoPrompt | null)[]>(() => generateGrid());
  const [markedCells, setMarkedCells] = useState<Set<number>>(new Set([FREE_SPACE_INDEX]));
  const [hasWon, setHasWon] = useState(false);

  const winningCells = useMemo(() => {
    const winCells = new Set<number>();
    
    for (const pattern of WINNING_PATTERNS) {
      const isWinning = pattern.every(index => 
        markedCells.has(index) || index === FREE_SPACE_INDEX
      );
      
      if (isWinning) {
        pattern.forEach(index => winCells.add(index));
      }
    }
    
    return winCells;
  }, [markedCells]);

  const checkForWin = useCallback((cells: Set<number>): boolean => {
    return WINNING_PATTERNS.some(pattern =>
      pattern.every(index => cells.has(index) || index === FREE_SPACE_INDEX)
    );
  }, []);

  const toggleCell = useCallback((index: number) => {
    if (index === FREE_SPACE_INDEX) return;
    
    setMarkedCells(prev => {
      const newMarked = new Set(prev);
      if (newMarked.has(index)) {
        newMarked.delete(index);
      } else {
        newMarked.add(index);
      }
      
      const won = checkForWin(newMarked);
      if (won && !hasWon) {
        setHasWon(true);
      }
      
      return newMarked;
    });
  }, [hasWon, checkForWin]);

  const resetGame = useCallback(() => {
    setGrid(generateGrid());
    setMarkedCells(new Set([FREE_SPACE_INDEX]));
    setHasWon(false);
  }, []);

  const markedCount = markedCells.size - 1; // Subtract free space

  return {
    grid,
    markedCells,
    winningCells,
    hasWon,
    toggleCell,
    resetGame,
    markedCount,
  };
}
