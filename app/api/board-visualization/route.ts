import { type NextRequest, NextResponse } from "next/server"
import type { CuttingListItem } from "@/lib/types"

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const { cuttingList, materialType } = data as {
      cuttingList: CuttingListItem[]
      materialType: "particle" | "mdf" | "backply"
    }

    // Filter pieces by material and expand quantities
    const pieces = []
    cuttingList
      .filter((item) => {
        switch (materialType) {
          case "particle":
            return item.material === "18mm Particle Board"
          case "mdf":
            return item.material === "18mm MDF board"
          case "backply":
            return item.material === "3mm MDF Backply"
          default:
            return false
        }
      })
      .forEach((item) => {
        for (let i = 0; i < item.quantity; i++) {
          pieces.push({
            name: item.name,
            length: Number.parseInt(item.length.toString()),
            width: Number.parseInt(item.width.toString()),
            quantity: 1,
            material: item.material,
            edging: item.edging,
            grooving: item.grooving,
          })
        }
      })

    const standardBoard = { width: 2440, length: 1220 }
    const kerfWidth = 4
    const edgeOffset = 10

    // Pack pieces onto boards
    const boards = packPieces(pieces, standardBoard, kerfWidth, edgeOffset)

    // Calculate statistics
    const totalPieceArea = pieces.reduce((sum, piece) => sum + piece.length * piece.width, 0)
    const boardSize = 2440 * 1220
    const totalBoardArea = boards.length * boardSize
    const efficiency = ((totalPieceArea / totalBoardArea) * 100).toFixed(2)

    return NextResponse.json({
      boards,
      statistics: {
        boardCount: boards.length,
        efficiency: Number.parseFloat(efficiency),
        totalArea: (totalPieceArea / 1000000).toFixed(2), // in square meters
      },
    })
  } catch (error) {
    console.error("Error generating board visualization:", error)
    return NextResponse.json({ error: "Failed to generate board visualization" }, { status: 500 })
  }
}

function packPieces(pieces, boardSize, kerfWidth, edgeOffset) {
  // This is a simplified version of the packing algorithm
  // In a real implementation, you would use a more sophisticated algorithm

  // Sort pieces by area (largest first)
  pieces.sort((a, b) => b.width * b.length - a.width * a.length)

  const boards = []
  let currentBoard = { pieces: [] }
  boards.push(currentBoard)

  // Simple packing algorithm (not optimal)
  pieces.forEach((piece) => {
    // Add piece to current board
    currentBoard.pieces.push({
      ...piece,
      x: edgeOffset,
      y: edgeOffset + currentBoard.pieces.length * (piece.length + kerfWidth),
    })

    // If we've filled the board, start a new one
    if (currentBoard.pieces.length >= 10) {
      currentBoard = { pieces: [] }
      boards.push(currentBoard)
    }
  })

  return boards
}

