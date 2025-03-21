import type { CabinetItem } from "@/lib/types"
import { packPieces } from "@/lib/board-packer"

export function calculateBoardRequirements(cuttingList: CabinetItem[]) {
  let particleBoardArea = 0
  let mdfBoardArea = 0
  let mdfBackplyArea = 0
  let particleBoardEdgingLength = 0
  let mdfBoardEdgingLength = 0
  let particleBoardGroovingLength = 0
  let mdfBoardGroovingLength = 0

  // Calculate areas and lengths
  cuttingList.forEach((item) => {
    const quantity = item.quantity || 1
    if (item.material === "18mm Particle Board") {
      particleBoardArea += item.length * item.width * quantity

      if (item.edging) {
        // Calculate total edging length
        if (item.edging.includes("L1")) particleBoardEdgingLength += item.length * quantity
        if (item.edging.includes("L2")) particleBoardEdgingLength += item.length * quantity
        if (item.edging.includes("W1")) particleBoardEdgingLength += item.width * quantity
        if (item.edging.includes("W2")) particleBoardEdgingLength += item.width * quantity
      }

      if (item.grooving && item.grooving.includes("G1")) {
        particleBoardGroovingLength += item.length * quantity
      }
    } else if (item.material === "18mm MDF board") {
      mdfBoardArea += item.length * item.width * quantity

      if (item.edging) {
        // Calculate total edging length for MDF board
        if (item.edging.includes("L1")) mdfBoardEdgingLength += item.length * quantity
        if (item.edging.includes("L2")) mdfBoardEdgingLength += item.length * quantity
        if (item.edging.includes("W1")) mdfBoardEdgingLength += item.width * quantity
        if (item.edging.includes("W2")) mdfBoardEdgingLength += item.width * quantity
      }

      if (item.grooving && item.grooving.includes("G1")) {
        mdfBoardGroovingLength += item.length * quantity
      }
    } else if (item.material === "3mm MDF Backply") {
      mdfBackplyArea += item.length * item.width * quantity
    }
  })

  // Calculate board requirements using the packing algorithm
  const standardBoard = { width: 2440, length: 1220 }
  const kerfWidth = 4
  const edgeOffset = 10

  // Group pieces by material
  const particleBoards = calculateBoardsForMaterial(
    cuttingList,
    "18mm Particle Board",
    standardBoard,
    kerfWidth,
    edgeOffset,
  )
  const mdfBoards = calculateBoardsForMaterial(cuttingList, "18mm MDF board", standardBoard, kerfWidth, edgeOffset)
  const mdfBackply = calculateBoardsForMaterial(cuttingList, "3mm MDF Backply", standardBoard, kerfWidth, edgeOffset)

  return {
    particleBoards,
    mdfBoards,
    mdfBackply,
    particleBoardEdgingLength,
    mdfBoardEdgingLength,
    particleBoardGroovingLength,
    mdfBoardGroovingLength,
  }
}

function calculateBoardsForMaterial(
  cuttingList: CabinetItem[],
  material: string,
  boardSize: { width: number; length: number },
  kerfWidth: number,
  edgeOffset: number,
): number {
  // Filter pieces by material and expand quantities
  const pieces: CabinetItem[] = []
  cuttingList
    .filter((item) => item.material === material)
    .forEach((item) => {
      for (let i = 0; i < item.quantity; i++) {
        pieces.push({
          name: item.name,
          length: item.length,
          width: item.width,
          quantity: 1,
          material: item.material,
          edging: item.edging,
          grooving: item.grooving,
        })
      }
    })

  // Pack pieces onto boards
  const boards = packPieces(pieces, boardSize, kerfWidth, edgeOffset)

  // Return the number of boards required
  return boards.length
}

