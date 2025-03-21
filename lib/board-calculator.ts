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

      // Match the original HTML implementation, looking for 'G' instead of 'G1'
      if (item.grooving && item.grooving.includes("G")) {
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

      // Match the original HTML implementation, looking for 'G' instead of 'G1'
      if (item.grooving && item.grooving.includes("G")) {
        mdfBoardGroovingLength += item.length * quantity
      }
    } else if (item.material === "3mm MDF Backply") {
      mdfBackplyArea += item.length * item.width * quantity
    }
  })

  // Calculate actual board requirements using the packing algorithm
  const standardBoard = { width: 2440, length: 1220 }
  const kerfWidth = 4
  const edgeOffset = 10

  // Group pieces by material
  const materialGroups = {
    particle: [] as CabinetItem[],
    mdf: [] as CabinetItem[],
    backply: [] as CabinetItem[],
  }

  // Group pieces by material and expand quantities
  cuttingList.forEach((item) => {
    // Add each piece according to its quantity
    for (let i = 0; i < item.quantity; i++) {
      const piece = {
        name: item.name,
        length: item.length,
        width: item.width,
        quantity: 1,
        material: item.material,
        edging: item.edging,
        grooving: item.grooving,
      }

      if (item.material === "18mm Particle Board") {
        materialGroups.particle.push(piece)
      } else if (item.material === "18mm MDF board") {
        materialGroups.mdf.push(piece)
      } else if (item.material === "3mm MDF Backply") {
        materialGroups.backply.push(piece)
      }
    }
  })

  // Calculate boards needed for each material
  const boardCounts = {
    particle: packPieces(materialGroups.particle, standardBoard, kerfWidth, edgeOffset).length,
    mdf: packPieces(materialGroups.mdf, standardBoard, kerfWidth, edgeOffset).length,
    backply: packPieces(materialGroups.backply, standardBoard, kerfWidth, edgeOffset).length,
  }

  return {
    particleBoards: boardCounts.particle,
    mdfBoards: boardCounts.mdf,
    mdfBackply: boardCounts.backply,
    particleBoardEdgingLength,
    mdfBoardEdgingLength,
    particleBoardGroovingLength,
    mdfBoardGroovingLength,
  }
}

