import type { CabinetItem, Board, BoardPiece, UsedSpace } from "@/lib/types"

export function packPieces(
  pieces: CabinetItem[],
  boardSize: { width: number; length: number },
  kerfWidth: number,
  edgeOffset = 10,
): Board[] {
  const boards: Board[] = []
  const remainingPieces = [...pieces]

  // Function to check if a piece fits in a gap
  function pieceCanFit(
    piece: CabinetItem,
    gap: { x: number; y: number; width: number; height: number },
    canRotate: boolean,
  ): { fits: boolean; rotated: boolean } {
    const fits = (w1: number, h1: number, w2: number, h2: number) => w1 <= w2 && h1 <= h2

    // Check normal orientation
    if (fits(piece.width + kerfWidth, piece.length + kerfWidth, gap.width, gap.height)) {
      return { fits: true, rotated: false }
    }

    // Check rotated orientation if allowed
    if (canRotate && fits(piece.length + kerfWidth, piece.width + kerfWidth, gap.width, gap.height)) {
      return { fits: true, rotated: true }
    }

    return { fits: false, rotated: false }
  }

  // Function to find all gaps in a board
  function findGaps(board: Board): { x: number; y: number; width: number; height: number }[] {
    const gaps: { x: number; y: number; width: number; height: number }[] = []
    const usedSpaces = [...board.usedSpaces].sort((a, b) => a.y - b.y || a.x - b.x)

    // Initialize with full board as a gap
    let availableSpace: { x: number; y: number; width: number; height: number }[] = [
      {
        x: edgeOffset,
        y: edgeOffset,
        width: boardSize.width - 2 * edgeOffset,
        height: boardSize.length - 2 * edgeOffset,
      },
    ]

    // Process each used space to split available space into gaps
    usedSpaces.forEach((space) => {
      const newAvailableSpace: { x: number; y: number; width: number; height: number }[] = []

      availableSpace.forEach((area) => {
        if (intersects(area, space)) {
          // Split area into up to 4 new areas
          // Top
          if (area.y < space.y) {
            newAvailableSpace.push({
              x: area.x,
              y: area.y,
              width: area.width,
              height: space.y - area.y,
            })
          }
          // Bottom
          if (area.y + area.height > space.y + space.height) {
            newAvailableSpace.push({
              x: area.x,
              y: space.y + space.height,
              width: area.width,
              height: area.y + area.height - (space.y + space.height),
            })
          }
          // Left
          if (area.x < space.x) {
            newAvailableSpace.push({
              x: area.x,
              y: Math.max(area.y, space.y),
              width: space.x - area.x,
              height: Math.min(area.y + area.height, space.y + space.height) - Math.max(area.y, space.y),
            })
          }
          // Right
          if (area.x + area.width > space.x + space.width) {
            newAvailableSpace.push({
              x: space.x + space.width,
              y: Math.max(area.y, space.y),
              width: area.x + area.width - (space.x + space.width),
              height: Math.min(area.y + area.height, space.y + space.height) - Math.max(area.y, space.y),
            })
          }
        } else {
          newAvailableSpace.push(area)
        }
      })

      availableSpace = newAvailableSpace
    })

    // Filter out tiny gaps and sort by area
    return availableSpace
      .filter((gap) => gap.width >= kerfWidth && gap.height >= kerfWidth)
      .sort((a, b) => b.width * b.height - a.width * a.height)
  }

  function intersects(
    rect1: { x: number; y: number; width: number; height: number },
    rect2: { x: number; y: number; width: number; height: number },
  ): boolean {
    return !(
      rect1.x + rect1.width <= rect2.x ||
      rect1.x >= rect2.x + rect2.width ||
      rect1.y + rect1.height <= rect2.y ||
      rect1.y >= rect2.y + rect2.height
    )
        }

  // Try to place a piece in any available gap across all boards
  function tryPlacePieceInExistingBoards(piece: CabinetItem): boolean {
    for (let boardIndex = 0; boardIndex < boards.length; boardIndex++) {
      const board = boards[boardIndex]
      const gaps = findGaps(board)

      for (const gap of gaps) {
        const fitResult = pieceCanFit(piece, gap, true)
        if (fitResult.fits) {
          const placedPiece: BoardPiece = {
            name: piece.name,
            length: fitResult.rotated ? piece.width : piece.length,
            width: fitResult.rotated ? piece.length : piece.width,
            x: gap.x,
            y: gap.y,
            material: piece.material,
            edging: piece.edging,
            grooving: piece.grooving,
          }

          board.pieces.push(placedPiece)
          board.usedSpaces.push({
            x: gap.x,
            y: gap.y,
            width: placedPiece.width + kerfWidth,
            height: placedPiece.length + kerfWidth,
          })

          return true
        }
      }
    }
    return false
}

  function calculateOptimalLayout(
  piece: CabinetItem,
    count: number,
  boardSize: { width: number; length: number },
    edgeOffset: number = 10,
    kerfWidth: number = 4,
  ): { width: number; length: number; cols: number; rows: number; total: number } {
    const orientations = [
      { width: piece.width, length: piece.length },
      { width: piece.length, length: piece.width },
    ]

    let bestLayout = null
    let bestEfficiency = 0

    orientations.forEach((orientation) => {
      const cols = Math.floor((boardSize.width - 2 * edgeOffset) / (orientation.width + kerfWidth))
      const rows = Math.floor((boardSize.length - 2 * edgeOffset) / (orientation.length + kerfWidth))
      const total = Math.min(count, rows * cols)
      const efficiency = (total * orientation.width * orientation.length) / (boardSize.width * boardSize.length)

      if (efficiency > bestEfficiency) {
        bestEfficiency = efficiency
        bestLayout = {
          width: orientation.width,
          length: orientation.length,
          cols,
          rows,
          total,
        }
      }
    })

    return bestLayout || { width: piece.width, length: piece.length, cols: 1, rows: 1, total: 1 }
  }

  // Sort pieces by area (largest first)
  remainingPieces.sort((a, b) => b.width * b.length - a.width * a.length)

  while (remainingPieces.length > 0) {
    const piece = remainingPieces[0]

    // Try to place in existing boards first
    if (boards.length > 0 && tryPlacePieceInExistingBoards(piece)) {
      remainingPieces.shift()
      continue
    }

    // If we couldn't place in existing boards, start a new board
    const currentBoard: Board = {
      pieces: [],
      usedSpaces: [],
    }
    boards.push(currentBoard)

    // Calculate optimal grid layout for remaining similar pieces
    const similarPieces = remainingPieces.filter((p) => p.width === piece.width && p.length === piece.length)

    const layout = calculateOptimalLayout(piece, similarPieces.length, boardSize, edgeOffset, kerfWidth)
    const piecesToPlace = similarPieces.slice(0, layout.total)
    
    // Remove the pieces we're about to place from remaining pieces
    piecesToPlace.forEach((p) => {
      const index = remainingPieces.indexOf(p)
      if (index !== -1) {
        remainingPieces.splice(index, 1)
      }
    })

    // Place pieces in grid pattern
    piecesToPlace.forEach((p, index) => {
      const row = Math.floor(index / layout.cols)
      const col = index % layout.cols

      const placedPiece: BoardPiece = {
        ...p,
        x: edgeOffset + col * (layout.width + kerfWidth),
        y: edgeOffset + row * (layout.length + kerfWidth),
        width: layout.width,
        length: layout.length,
      }

      currentBoard.pieces.push(placedPiece)
      currentBoard.usedSpaces.push({
        x: placedPiece.x,
        y: placedPiece.y,
        width: placedPiece.width + kerfWidth,
        height: placedPiece.length + kerfWidth,
      })
    })
  }

  return boards
}

