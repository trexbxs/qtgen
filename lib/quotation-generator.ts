import type { CabinetItem, QuotationItem, WorktopItem } from "@/lib/types"
import { calculateBoardRequirements } from "@/lib/board-calculator"

export function generateQuotationData(cuttingList: CabinetItem[]) {
  // Get board counts from the board calculator
  const boardStats = calculateBoardRequirements(cuttingList)

  // Calculate door and drawer counts
  let regularDoorCount = 0
  let tallUnitDoorCount = 0
  let totalGChannelWidth = 0
  let totalDrawerFaces = 0
  let gasLiftCount = 0

  cuttingList.forEach((item) => {
    if (item.name.toLowerCase().includes("door")) {
      if (item.name.toLowerCase().includes("tall unit")) {
        tallUnitDoorCount += item.quantity
      } else {
        regularDoorCount += item.quantity
      }
      // Sum up all doors width multiplied by their quantities
      totalGChannelWidth += Number.parseInt(item.width.toString()) * Number.parseInt(item.quantity.toString())
    }

    // Sum up all drawer faces quantities and widths
    if (item.name.toLowerCase().includes("drawer face")) {
      totalDrawerFaces += Number.parseInt(item.quantity.toString())
      totalGChannelWidth += Number.parseInt(item.length.toString()) * Number.parseInt(item.quantity.toString()) // Using length as it's the width for drawer faces
    }

    // Count wall cabinets with gas lift type
    if (
      item.name.toLowerCase().includes("wall cabinet") &&
      item.name.toLowerCase().includes("door") &&
      item.name.toLowerCase().includes("gas lift")
    ) {
      gasLiftCount += Number.parseInt(item.quantity.toString())
    }
  })

  const hingeCount = regularDoorCount + tallUnitDoorCount * 2
  // Calculate g-channel profile quantity by dividing total width by 3000mm and rounding up
  const gProfileCount = Math.ceil(totalGChannelWidth / 3000)
  // Calculate final gas lift quantity (2 per gas lift cabinet)
  const gasLiftTotal = gasLiftCount * 2

  // Calculate marine boards (2 for every 10 particle boards)
  const marineBoards = Math.ceil(boardStats.particleBoards / 10) * 2

  // Create quotation data
  const quotationItems: QuotationItem[] = [
    { description: "18MM White particle boards", units: "pcs", qty: boardStats.particleBoards, unitPrice: 4200 },
    {
      description: "1MM White lipping",
      units: "mtrs",
      qty: Number.parseFloat((boardStats.particleBoardEdgingLength / 1000).toFixed(2)),
      unitPrice: 80,
    },
    {
      description: "Grooving services",
      units: "mtrs",
      qty: Number.parseFloat(
        ((boardStats.particleBoardGroovingLength + boardStats.mdfBoardGroovingLength) / 1000).toFixed(2),
      ),
      unitPrice: 35,
    },
    { description: "Marine Board", units: "pcs", qty: marineBoards, unitPrice: 3200 },
    { description: "3MM white backply", units: "pcs", qty: boardStats.mdfBackply, unitPrice: 1500 },
    { description: "18MM white finishing boards", units: "pcs", qty: boardStats.mdfBoards, unitPrice: 15000 },
    {
      description: "finishing lippings",
      units: "mtrs",
      qty: Number.parseFloat((boardStats.mdfBoardEdgingLength / 1000).toFixed(2)),
      unitPrice: 120,
    },
    { description: "Hydraulic Malpha hinges", units: "prs", qty: hingeCount, unitPrice: 200 },
    { description: "g channel profile", units: "pcs", qty: gProfileCount, unitPrice: 4500 },
    { description: "Malpha holes", units: "prs", qty: hingeCount, unitPrice: 30 },
    { description: "Undermount runners", units: "prs", qty: totalDrawerFaces, unitPrice: 2200 },
    { description: "40MM screws", units: "pkts", qty: 7, unitPrice: 400 },
    { description: "30MM screws", units: "pkts", qty: 5, unitPrice: 350 },
    { description: "16MM screws", units: "pkts", qty: 3, unitPrice: 250 },
    { description: "70MM Screws", units: "pkts", qty: 2, unitPrice: 700 },
    { description: "8MM wall plugs", units: "pkts", qty: 3, unitPrice: 250 },
    { description: "shelf rests", units: "pcs", qty: 200, unitPrice: 15 },
    { description: "Gas lift", units: "pcs", qty: gasLiftTotal, unitPrice: 350 },
  ]

  // Create worktop data
  const worktopItems: WorktopItem[] = [
    {
      description: "granite slabs",
      size: "2400 x 600",
      lengths: [],
      units: "slabs",
      qty: 4.5,
      unitPrice: 24000,
    },
    { description: "island granite 2400 x 900", units: "slabs", qty: 2, unitPrice: 37000 },
    { description: "silicon tubes- GP spacal", units: "tubes", qty: 5, unitPrice: 550 },
    { description: "body filler+glue", units: "ltrs", qty: 2, unitPrice: 2000 },
    { description: "labour", units: "", qty: 6, unitPrice: 3000 },
  ]

  return { quotationItems, worktopItems }
}

