import type { CabinetItem, Board, BoardPiece } from "@/lib/types"

export function packPieces(
  pieces: CabinetItem[],
  boardSize: { width: number; length: number },
  kerfWidth: number,
  edgeOffset = 10,
): Board[] {
  const boards: Board[] = []
  const remainingPieces = [...pieces]

  // Sort pieces by area (largest first)
  remainingPieces.sort((a, b) => b.width * b.length - a.width * a.length)

  while (remainingPieces.length > 0) {
    // Create a new board
    const currentBoard: Board = {
      pieces: [],
      usedSpaces: [],
    }
    boards.push(currentBoard)

    // Try to place as many pieces as possible on the current board
    let placedPiece = true
    while (placedPiece && remainingPieces.length > 0) {
      placedPiece = false

      // Try to place each piece
      for (let i = 0; i < remainingPieces.length; i++) {
        const piece = remainingPieces[i]

        // Try to place the piece in its original orientation
        let placement = findPlacement(piece, currentBoard, boardSize, kerfWidth, edgeOffset, false)

        // If that doesn't work, try rotating the piece
        if (!placement.success) {
          placement = findPlacement(piece, currentBoard, boardSize, kerfWidth, edgeOffset, true)
        }

        // If we found a valid placement, add the piece to the board
        if (placement.success) {
          const placedBoardPiece: BoardPiece = {
            name: piece.name,
            length: placement.rotated ? piece.width : piece.length,
            width: placement.rotated ? piece.length : piece.width,
            x: placement.x,
            y: placement.y,
            material: piece.material,
            edging: piece.edging,
            grooving: piece.grooving,
          }

          currentBoard.pieces.push(placedBoardPiece)
          currentBoard.usedSpaces.push({
            x: placement.x,
            y: placement.y,
            width: placedBoardPiece.width + kerfWidth,
            height: placedBoardPiece.length + kerfWidth,
          })

          // Remove the piece from remaining pieces
          remainingPieces.splice(i, 1)
          placedPiece = true
          break
        }
      }
    }
  }

  return boards
}

function findPlacement(
  piece: CabinetItem,
  board: Board,
  boardSize: { width: number; length: number },
  kerfWidth: number,
  edgeOffset: number,
  allowRotation: boolean,
): { success: boolean; x: number; y: number; rotated: boolean } {
  // Default result
  const result = { success: false, x: 0, y: 0, rotated: false }

  // Get piece dimensions
  let pieceWidth = piece.width + kerfWidth
  let pieceLength = piece.length + kerfWidth

  // Try rotation if allowed
  if (allowRotation) {
    ;[pieceWidth, pieceLength] = [pieceLength, pieceWidth]
    result.rotated = true
  }

  // Check if piece fits on the board
  if (pieceWidth > boardSize.width - 2 * edgeOffset || pieceLength > boardSize.length - 2 * edgeOffset) {
    return result
  }

  // If this is the first piece on the board, place it at the top-left corner
  if (board.usedSpaces.length === 0) {
    result.x = edgeOffset
    result.y = edgeOffset
    result.success = true
    return result
  }

  // Find all possible placement positions
  const positions = findPossiblePositions(board, boardSize, edgeOffset)

  // Try each position
  for (const pos of positions) {
    // Check if piece fits at this position
    if (pos.x + pieceWidth <= boardSize.width - edgeOffset && pos.y + pieceLength <= boardSize.length - edgeOffset) {
      // Check if piece overlaps with any existing pieces
      let overlaps = false
      for (const space of board.usedSpaces) {
        if (
          pos.x < space.x + space.width &&
          pos.x + pieceWidth > space.x &&
          pos.y < space.y + space.height &&
          pos.y + pieceLength > space.y
        ) {
          overlaps = true
          break
        }
      }

      if (!overlaps) {
        result.x = pos.x
        result.y = pos.y
        result.success = true
        return result
      }
    }
  }

  return result
}

function findPossiblePositions(
  board: Board,
  boardSize: { width: number; length: number },
  edgeOffset: number,
): { x: number; y: number }[] {
  const positions: { x: number; y: number }[] = []

  // Always consider the top-left corner
  positions.push({ x: edgeOffset, y: edgeOffset })

  // For each used space, consider positions to the right and below
  for (const space of board.usedSpaces) {
    // Position to the right
    positions.push({ x: space.x + space.width, y: space.y })

    // Position below
    positions.push({ x: space.x, y: space.y + space.height })
  }

  // Sort positions by y first, then x (top-to-bottom, left-to-right)
  positions.sort((a, b) => {
    if (a.y !== b.y) return a.y - b.y
    return a.x - b.x
  })

  return positions
}

