import type { CabinetFormData, CabinetItem } from "@/lib/types"

export function generateCuttingList(cabinets: {
  baseCabinets: CabinetFormData[]
  cornerBase: CabinetFormData[]
  wallCabinets: CabinetFormData[]
  cornerWall: CabinetFormData[]
  tallUnits: CabinetFormData[]
  endPanels: CabinetFormData[]
}): CabinetItem[] {
  const cuttingList: CabinetItem[] = []

  // Process base cabinets
  cabinets.baseCabinets.forEach((cabinet, index) => {
    const width = cabinet.width || 0
    const type = cabinet.type || "doors"
    const doorConfig = cabinet.doorConfig || "single"
    const drawerCount = cabinet.drawerCount || 2
    const quantity = cabinet.quantity || 1

    // Side panels
    cuttingList.push({
      name: `Base Cabinet ${index + 1} Side Panels`,
      length: 780,
      width: 560,
      quantity: 2 * quantity,
      material: "18mm Particle Board",
      edging: "L1",
      grooving: "G1|L2",
    })

    // Bottom panel
    cuttingList.push({
      name: `Base Cabinet ${index + 1} Bottom Panel`,
      length: width - 36,
      width: 560,
      quantity: 1 * quantity,
      material: "18mm Particle Board",
      edging: "L1",
      grooving: "G1|L2",
    })

    // Back Ply
    cuttingList.push({
      name: `Base Cabinet ${index + 1} Back Ply`,
      length: width - 6,
      width: 780,
      quantity: 1 * quantity,
      material: "3mm MDF Backply",
      edging: "None",
      grooving: "None",
    })

    // Add shelf only if it's a door type cabinet
    if (type === "doors" || type === "open") {
      cuttingList.push({
        name: `Base Cabinet ${index + 1} Shelf`,
        length: width - 36,
        width: 560 - 22,
        quantity: 1 * quantity,
        material: "18mm Particle Board",
        edging: "L1",
        grooving: "None",
      })
    }

    // Screw plate
    cuttingList.push({
      name: `Base Cabinet ${index + 1} Screw plate`,
      length: width - 36,
      width: 100,
      quantity: 3 * quantity,
      material: "18mm Particle Board",
      edging: "None",
      grooving: "None",
    })

    // Screw plate
    cuttingList.push({
      name: `Base Cabinet ${index + 1} Screw plate`,
      length: width - 36,
      width: 100,
      quantity: 2 * quantity,
      material: "18mm Particle Board",
      edging: "L1",
      grooving: "None",
    })

    // Doors or drawers
    if (type === "doors") {
      const doorWidth = doorConfig === "single" ? width - 5 : (width - 10) / 2
      cuttingList.push({
        name: `Base Cabinet ${index + 1} Door`,
        length: 780 - 5,
        width: doorWidth,
        quantity: (doorConfig === "single" ? 1 : 2) * quantity,
        material: "18mm MDF board",
        edging: "L1,L2,W1,W2",
        grooving: "None",
      })
    } else if (type === "drawers") {
      cuttingList.push({
        name: `Base Cabinet ${index + 1} Drawer Face`,
        length: width - 5,
        width: 222,
        quantity: drawerCount * quantity,
        material: "18mm MDF board",
        edging: "L1,L2,W1,W2",
        grooving: "None",
      })

      cuttingList.push({
        name: `Base Cabinet ${index + 1} Drawer Sides`,
        length: 500,
        width: 200,
        quantity: 2 * drawerCount * quantity,
        material: "18mm Particle Board",
        edging: "L1",
        grooving: "None",
      })

      cuttingList.push({
        name: `Base Cabinet ${index + 1} Drawer Back & Front`,
        length: width - 98,
        width: 200,
        quantity: 2 * drawerCount * quantity,
        material: "18mm Particle Board",
        edging: "L1",
        grooving: "None",
      })

      cuttingList.push({
        name: `Base Cabinet ${index + 1} Drawer Bottom`,
        length: width - 98,
        width: 414,
        quantity: drawerCount * quantity,
        material: "18mm Particle Board",
        edging: "None",
        grooving: "None",
      })
    }
  })

  // Process corner base cabinets
  cabinets.cornerBase.forEach((cabinet, index) => {
    const width = cabinet.cornerBaseWidth || 1100
    const quantity = cabinet.quantity || 1

    // Side panels
    cuttingList.push({
      name: `Corner Base ${index + 1} Side Panels`,
      length: 780,
      width: 560,
      quantity: 2 * quantity,
      material: "18mm Particle Board",
      edging: "L1",
      grooving: "G1|L2",
    })

    // Bottom panel
    cuttingList.push({
      name: `Corner Base ${index + 1} Bottom Panel`,
      length: width - 36,
      width: 560,
      quantity: 1 * quantity,
      material: "18mm Particle Board",
      edging: "L1",
      grooving: "G1|L2",
    })

    // Back Ply
    cuttingList.push({
      name: `Corner Base ${index + 1} Back Ply`,
      length: width - 17,
      width: 780 - 8,
      quantity: 1 * quantity,
      material: "3mm MDF Backply",
      edging: "None",
      grooving: "None",
    })

    // Shelf
    cuttingList.push({
      name: `Corner Base ${index + 1} Shelf`,
      length: width - 36,
      width: 560 - 22,
      quantity: 1 * quantity,
      material: "18mm Particle Board",
      edging: "L1",
      grooving: "None",
    })

    // Screw plate
    cuttingList.push({
      name: `Corner Base ${index + 1} Screw plate`,
      length: width - 36,
      width: 100,
      quantity: 3 * quantity,
      material: "18mm Particle Board",
      edging: "None",
      grooving: "None",
    })

    // Screw plate
    cuttingList.push({
      name: `Corner Base ${index + 1} Screw plate`,
      length: width - 36,
      width: 100,
      quantity: 2 * quantity,
      material: "18mm Particle Board",
      edging: "L1",
      grooving: "None",
    })

    // Door
    let doorWidth
    if (width === 1100) doorWidth = 495
    else if (width === 1050) doorWidth = 445
    else doorWidth = 395

    cuttingList.push({
      name: `Corner Base ${index + 1} Door`,
      length: 780 - 5,
      width: doorWidth,
      quantity: 1 * quantity,
      material: "18mm MDF board",
      edging: "L1,L2,W1,W2",
      grooving: "None",
    })

    // Blanking panel
    cuttingList.push({
      name: `Corner Base ${index + 1} Blanking Panel`,
      length: 744,
      width: 546,
      quantity: 1 * quantity,
      material: "18mm Particle Board",
      edging: "None",
      grooving: "None",
    })

    // Blanking strip
    cuttingList.push({
      name: `Corner Base ${index + 1} Blanking Strip`,
      length: 744,
      width: 80,
      quantity: 1 * quantity,
      material: "18mm Particle Board",
      edging: "L1",
      grooving: "None",
    })
  })

  // Process wall cabinets
  cabinets.wallCabinets.forEach((cabinet, index) => {
    const width = cabinet.width || 0
    const height = cabinet.height || 0
    const type = cabinet.wallType || "single"
    const quantity = cabinet.quantity || 1

    // Side panels
    cuttingList.push({
      name: `Wall Cabinet ${index + 1} Side Panels`,
      length: height,
      width: 282,
      quantity: 2 * quantity,
      material: "18mm Particle Board",
      edging: "L1",
      grooving: "G1|L2",
    })

    // Top and bottom panels
    cuttingList.push({
      name: `Wall Cabinet ${index + 1} Top & Bottom Panels`,
      length: width - 36,
      width: 282,
      quantity: 2 * quantity,
      material: "18mm Particle Board",
      edging: "L1",
      grooving: "G1|L2",
    })

    // Back Ply
    cuttingList.push({
      name: `Wall Cabinet ${index + 1} Back Ply`,
      length: width - 17,
      width: height - 17,
      quantity: 1 * quantity,
      material: "3mm MDF Backply",
      edging: "None",
      grooving: "None",
    })

    // Shelves
    const shelfCount = type === "bifold" || type === "gaslift" ? 2 : 1
    cuttingList.push({
      name: `Wall Cabinet ${index + 1} Shelf`,
      length: width - 36,
      width: 282 - 22,
      quantity: shelfCount * quantity,
      material: "18mm Particle Board",
      edging: "L1",
      grooving: "None",
    })

    // Screw plate
    cuttingList.push({
      name: `Wall Cabinet ${index + 1} Screw plate`,
      length: width - 36,
      width: 100,
      quantity: 3 * quantity,
      material: "18mm Particle Board",
      edging: "None",
      grooving: "None",
    })

    // Screw plate
    cuttingList.push({
      name: `Wall Cabinet ${index + 1} Screw plate`,
      length: width - 36,
      width: 100,
      quantity: 2 * quantity,
      material: "18mm Particle Board",
      edging: "L1",
      grooving: "None",
    })

    // Doors
    if (type === "single" && type !== "open") {
      cuttingList.push({
        name: `Wall Cabinet ${index + 1} Door`,
        length: height - 5,
        width: width - 5,
        quantity: 1 * quantity,
        material: "18mm MDF board",
        edging: "L1,L2,W1,W2",
        grooving: "None",
      })
    } else if (type === "double" && type !== "open") {
      cuttingList.push({
        name: `Wall Cabinet ${index + 1} Door`,
        length: height - 5,
        width: (width - 10) / 2,
        quantity: 2 * quantity,
        material: "18mm MDF board",
        edging: "L1,L2,W1,W2",
        grooving: "None",
      })
    } else if ((type === "gaslift" || type === "bifold") && type !== "open") {
      cuttingList.push({
        name: `Wall Cabinet ${index + 1} Door`,
        length: width - 5,
        width: height / 2 - 35 - 5,
        quantity: 2 * quantity,
        material: "18mm MDF board",
        edging: "L1,L2,W1,W2",
        grooving: "None",
      })
    }
  })

  // Process corner wall cabinets
  cabinets.cornerWall.forEach((cabinet, index) => {
    const height = cabinet.cornerWallHeight || 0
    const width = cabinet.cornerWallWidth || 0
    const quantity = cabinet.quantity || 1

    // Side panels
    cuttingList.push({
      name: `Corner Wall ${index + 1} Side Panels`,
      length: height,
      width: 282,
      quantity: 2 * quantity,
      material: "18mm Particle Board",
      edging: "L1",
      grooving: "G1|L2",
    })

    // Top and bottom panels
    cuttingList.push({
      name: `Corner Wall ${index + 1} Top & Bottom Panels`,
      length: width - 36,
      width: 282,
      quantity: 2 * quantity,
      material: "18mm Particle Board",
      edging: "L1",
      grooving: "L2",
    })

    // Back Ply
    cuttingList.push({
      name: `Corner Wall ${index + 1} Back Ply`,
      length: width - 17,
      width: height - 17,
      quantity: 1 * quantity,
      material: "3mm MDF Backply",
      edging: "None",
      grooving: "None",
    })

    // Shelf
    cuttingList.push({
      name: `Corner Wall ${index + 1} Shelf`,
      length: width - 36,
      width: 282 - 22,
      quantity: 1 * quantity,
      material: "18mm Particle Board",
      edging: "L1",
      grooving: "None",
    })

    // Screw plate
    cuttingList.push({
      name: `Corner Wall ${index + 1} Screw plate`,
      length: width - 36,
      width: 100,
      quantity: 3 * quantity,
      material: "18mm Particle Board",
      edging: "None",
      grooving: "None",
    })

    // Screw plate
    cuttingList.push({
      name: `Corner Wall ${index + 1} Screw plate`,
      length: width - 36,
      width: 100,
      quantity: 2 * quantity,
      material: "18mm Particle Board",
      edging: "L1",
      grooving: "None",
    })

    // Door
    cuttingList.push({
      name: `Corner Wall ${index + 1} Door`,
      length: height - 5,
      width: width - 297,
      quantity: 1 * quantity,
      material: "18mm MDF board",
      edging: "L1,L2,W1,W2",
      grooving: "None",
    })

    // Blanking panel
    cuttingList.push({
      name: `Corner Wall ${index + 1} Blanking Panel`,
      length: height - 36,
      width: 300,
      quantity: 1 * quantity,
      material: "18mm Particle Board",
      edging: "None",
      grooving: "None",
    })

    // Blanking strip
    cuttingList.push({
      name: `Corner Wall ${index + 1} Blanking Strip`,
      length: height - 36,
      width: 80,
      quantity: 1 * quantity,
      material: "18mm Particle Board",
      edging: "L1",
      grooving: "None",
    })
  })

  // Process tall units
  cabinets.tallUnits.forEach((cabinet, index) => {
    const type = cabinet.tallUnitType || "fridgeUnit"
    const quantity = cabinet.quantity || 1

    if (type === "fridgeUnit") {
      processFridgeUnit(cuttingList, cabinet, index, quantity)
    } else if (type === "ovenMicrowave") {
      processOvenMicrowave(cuttingList, cabinet, index, quantity)
    } else if (type === "glassUnit") {
      processGlassUnit(cuttingList, cabinet, index, quantity)
    } else if (type === "pullout") {
      processPullout(cuttingList, cabinet, index, quantity)
    }
  })

  // Process end panels
  cabinets.endPanels.forEach((panel, index) => {
    const type = panel.endPanelType || "lowLevel"
    const quantity = panel.quantity || 1
    let length, width

    switch (type) {
      case "lowLevel":
        length = 778
        width = 579
        break
      case "highLevel":
        length = (panel.endPanelHeight || 0) - 2
        width = 299
        break
      case "tallUnits":
        length = (panel.endPanelHeight || 0) - 2
        width = panel.endPanelDepth === "600" ? 599 : 649
        break
      case "custom":
        length = (panel.endPanelHeight || 0) - 2
        width = (panel.endPanelWidth || 0) - 1
        break
    }

    cuttingList.push({
      name: `End Panel ${index + 1}`,
      length: length,
      width: width,
      quantity: 1 * quantity,
      edging: "L1,W1,W2",
      grooving: "None",
      material: "18mm MDF board",
    })
  })

  return cuttingList
}

function processFridgeUnit(cuttingList: CabinetItem[], unit: CabinetFormData, index: number, quantity: number) {
  const panelHeight = unit.fridgeUnitPanelHeight || 0
  const panelDepth = unit.fridgeUnitPanelDepth || 600
  const topBoxHeight = unit.fridgeUnitTopBoxHeight || 0
  const topBoxDoorType = unit.fridgeUnitTopBoxDoorType || "flip"
  const fridgeBoxWidth = unit.fridgeUnitBoxWidth || 0

  // End panels
  const endPanelWidth = panelDepth === 600 ? 600 : 650
  const endPanelLength = panelHeight
  cuttingList.push({
    name: `Fridge Unit ${index + 1} End Panels`,
    length: endPanelLength,
    width: endPanelWidth - 2,
    quantity: 2 * quantity,
    material: "18mm MDF board",
    edging: "L1,L2,W1,W2",
    grooving: "G1|L2",
  })

  // Side panels
  const sidePanelWidth = panelDepth - 19
  const sidePanelLength = topBoxHeight
  cuttingList.push({
    name: `Fridge Unit ${index + 1} Side Panels`,
    length: sidePanelLength,
    width: sidePanelWidth,
    quantity: 2 * quantity,
    material: "18mm Particle Board",
    edging: "L1",
    grooving: "G1|L2",
  })

  // Top & Bottom panels
  const topBottomPanelWidth = panelDepth - 19
  const topBottomPanelLength = fridgeBoxWidth - 36
  cuttingList.push({
    name: `Fridge Unit ${index + 1} Top & Bottom Panels`,
    length: topBottomPanelLength,
    width: topBottomPanelWidth,
    quantity: 2 * quantity,
    material: "18mm Particle Board",
    edging: "L1",
    grooving: "G1|L2",
  })

  // Back Ply
  cuttingList.push({
    name: `Fridge Unit ${index + 1} Back Ply`,
    length: fridgeBoxWidth - 56,
    width: topBoxHeight - 20,
    quantity: 1 * quantity,
    material: "3mm MDF Backply",
    edging: "None",
    grooving: "None",
  })

  // Screw plates
  cuttingList.push({
    name: `Fridge Unit ${index + 1} Screw Plates `,
    length: fridgeBoxWidth - 72,
    width: 80,
    quantity: 2 * quantity,
    material: "18mm Particle Board",
    edging: "None",
    grooving: "None",
  })

  cuttingList.push({
    name: `Fridge Unit ${index + 1} Screw Plates `,
    length: fridgeBoxWidth - 72,
    width: 80,
    quantity: 2 * quantity,
    material: "18mm Particle Board",
    edging: "L1",
    grooving: "None",
  })

  // Doors
  const doorWidth = topBoxHeight - 5
  let doorLength, doorQuantity
  if (topBoxDoorType === "flip") {
    doorLength = fridgeBoxWidth - 41
    doorQuantity = 1
  } else {
    doorLength = (fridgeBoxWidth - 46) / 2
    doorQuantity = 2
  }
  cuttingList.push({
    name: `Fridge Unit ${index + 1} Door${doorQuantity > 1 ? "s" : ""}`,
    length: doorLength,
    width: doorWidth,
    quantity: doorQuantity * quantity,
    material: "18mm MDF board",
    edging: "L1,L2,W1,W2",
    grooving: "None",
  })
}

function processOvenMicrowave(cuttingList: CabinetItem[], unit: CabinetFormData, index: number, quantity: number) {
  const config = unit.ovenMicrowaveConfig || "oven"
  const drawers = unit.ovenMicrowaveDrawers || 2
  const totalHeight = unit.ovenMicrowaveHeight || 0
  const depth = unit.ovenMicrowaveDepth || 600
  const shelfCount = unit.ovenMicrowaveShelf || 1
  const doorsHeight = unit.ovenMicrowaveDoorsHeight || 0

  const panelWidth = depth === 600 ? 580 : 630

  // Side panels
  cuttingList.push({
    name: `Oven/Microwave ${index + 1} Side Panels`,
    length: totalHeight,
    width: panelWidth,
    quantity: 2 * quantity,
    material: "18mm Particle Board",
    edging: "L1",
    grooving: "G1|L2",
  })

  // Top & Bottom panels
  cuttingList.push({
    name: `Oven/Microwave ${index + 1} Top & Bottom Panels`,
    length: 564,
    width: panelWidth,
    quantity: 2 * quantity,
    material: "18mm Particle Board",
    edging: "L1",
    grooving: "G1|L2",
  })

  // Back Ply
  cuttingList.push({
    name: `Oven/Microwave ${index + 1} Back Ply`,
    length: totalHeight - 20,
    width: 580,
    quantity: 1 * quantity,
    material: "3mm MDF Backply",
    edging: "None",
    grooving: "None",
  })

  // Shelf
  const shelfLength = depth === 600 ? 577 : 628
  const baseShelfCount = config === "micrOven" ? 3 : 2
  cuttingList.push({
    name: `Oven/Microwave ${index + 1} Shelf`,
    length: shelfLength,
    width: 564,
    quantity: (baseShelfCount + shelfCount) * quantity,
    material: "18mm Particle Board",
    edging: "L1",
    grooving: "None",
  })

  // Screw plates
  cuttingList.push({
    name: `Oven/Microwave ${index + 1} Screw Plate `,
    length: 564,
    width: 100,
    quantity: 5 * quantity,
    material: "18mm Particle Board",
    edging: "None",
    grooving: "None",
  })

  cuttingList.push({
    name: `Oven/Microwave ${index + 1} Screw Plate `,
    length: 564,
    width: 100,
    quantity: (1 + baseShelfCount + shelfCount) * quantity,
    material: "18mm Particle Board",
    edging: "L1",
    grooving: "None",
  })

  // Drawers
  const drawerWidth = drawers === 3 ? 150 : 200
  cuttingList.push({
    name: `Oven/Microwave ${index + 1} Drawer Front & Back`,
    length: 502,
    width: drawerWidth,
    quantity: 4 * quantity,
    material: "18mm Particle Board",
    edging: "L1",
    grooving: "None",
  })

  cuttingList.push({
    name: `Oven/Microwave ${index + 1} Drawer Sides`,
    length: 500,
    width: drawerWidth,
    quantity: 4 * quantity,
    material: "18mm Particle Board",
    edging: "L1",
    grooving: "None",
  })

  const drawerFaceWidth = drawers === 3 ? 220 : 350
  cuttingList.push({
    name: `Oven/Microwave ${index + 1} Drawer Face`,
    length: 595,
    width: drawerFaceWidth,
    quantity: drawers * quantity,
    material: "18mm MDF board",
    edging: "L1,L2,W1,W2",
    grooving: "None",
  })

  cuttingList.push({
    name: `Oven/Microwave ${index + 1} Drawer Bottom`,
    length: 502,
    width: 464,
    quantity: drawers * quantity,
    material: "18mm Particle Board",
    edging: "None",
    grooving: "None",
  })

  // Doors
  const doorQuantity = config === "micrOven" ? 2 : 1
  const doorLength = config === "oven" ? 560 : config === "microwave" ? 360 : [560, 360]

  if (Array.isArray(doorLength)) {
    doorLength.forEach((length, i) => {
      cuttingList.push({
        name: `Oven/Microwave ${index + 1} Door ${i + 1}`,
        length: length,
        width: 595,
        quantity: 1 * quantity,
        material: "18mm MDF board",
        edging: "L1,L2,W1,W2",
        grooving: "None",
      })
    })
  } else {
    cuttingList.push({
      name: `Oven/Microwave ${index + 1} Door`,
      length: doorLength,
      width: 595,
      quantity: doorQuantity * quantity,
      material: "18mm MDF board",
      edging: "L1,L2,W1,W2",
      grooving: "None",
    })
  }

  if (doorsHeight > 0) {
    cuttingList.push({
      name: `Oven/Microwave ${index + 1} Additional Door`,
      length: doorsHeight - 5,
      width: 595,
      quantity: 1 * quantity,
      material: "18mm MDF board",
      edging: "L1,L2,W1,W2",
      grooving: "None",
    })
  }
}

function processGlassUnit(cuttingList: CabinetItem[], unit: CabinetFormData, index: number, quantity: number) {
  const width = unit.glassUnitWidth || 0
  const height = unit.glassUnitHeight || 0
  const shelves = unit.glassUnitShelves || 1
  const depth = unit.glassUnitDepth || 600
  const doorType = unit.glassUnitDoorType || "metalGlass"

  const panelWidth = depth === 600 ? 580 : 630
  const shelfWidth = depth === 600 ? 576 : 626

  // Side panels
  cuttingList.push({
    name: `Glass Unit ${index + 1} Side Panels`,
    length: height,
    width: panelWidth,
    quantity: 2 * quantity,
    material: "18mm Particle Board",
    edging: "L1",
    grooving: "G1|L2",
  })

  // Top & Bottom panels
  cuttingList.push({
    name: `Glass Unit ${index + 1} Top & Bottom Panels`,
    length: width - 36,
    width: panelWidth,
    quantity: 2 * quantity,
    material: "18mm Particle Board",
    edging: "L1",
    grooving: "G1|L2",
  })

  // Back Ply
  cuttingList.push({
    name: `Glass Unit ${index + 1} Back Ply`,
    length: height - 20,
    width: width - 20,
    quantity: 1 * quantity,
    material: "3mm MDF Backply",
    edging: "None",
    grooving: "None",
  })

  // Shelves
  cuttingList.push({
    name: `Glass Unit ${index + 1} Shelves`,
    length: width - 36,
    width: shelfWidth,
    quantity: shelves * quantity,
    material: "18mm Particle Board",
    edging: "L1",
    grooving: "None",
  })

  // Screw plates
  cuttingList.push({
    name: `Glass Unit ${index + 1} Screw Plates `,
    length: width - 36,
    width: 100,
    quantity: 4 * quantity,
    material: "18mm Particle Board",
    edging: "None",
    grooving: "None",
  })

  // Screw plates
  cuttingList.push({
    name: `Glass Unit ${index + 1} Screw Plates `,
    length: width - 36,
    width: 100,
    quantity: 2 * shelves * quantity,
    material: "18mm Particle Board",
    edging: "L1",
    grooving: "None",
  })

  // Doors
  if (doorType !== "metalGlass") {
    const doorWidth = width <= 600 ? width - 5 : (width - 10) / 2
    const doorQuantity = width <= 600 ? 1 : 2
    cuttingList.push({
      name: `Glass Unit ${index + 1} Door${doorQuantity > 1 ? "s" : ""}`,
      length: height - 5,
      width: doorWidth,
      quantity: doorQuantity * quantity,
      material: "18mm MDF board",
      edging: "L1,L2,W1,W2",
      grooving: "None",
    })
  }
}

function processPullout(cuttingList: CabinetItem[], unit: CabinetFormData, index: number, quantity: number) {
  const width = unit.pulloutWidth || 600
  const height = unit.pulloutHeight || 0
  const depth = unit.pulloutDepth || 600

  const panelWidth = depth === 600 ? 580 : 630
  const panelLength = width === 600 ? 564 : 414

  // Side panels
  cuttingList.push({
    name: `Pullout ${index + 1} Side Panels`,
    length: height,
    width: panelWidth,
    quantity: 2 * quantity,
    material: "18mm Particle Board",
    edging: "L1",
    grooving: "G1|L2",
  })

  // Top & Bottom panels
  cuttingList.push({
    name: `Pullout ${index + 1} Top & Bottom Panels`,
    length: panelLength,
    width: panelWidth,
    quantity: 2 * quantity,
    material: "18mm Particle Board",
    edging: "L1",
    grooving: "G1|L2",
  })

  // Back Ply
  const backPlyWidth = width === 600 ? 580 : 430
  cuttingList.push({
    name: `Pullout ${index + 1} Back Ply`,
    length: height - 20,
    width: backPlyWidth,
    quantity: 1 * quantity,
    material: "3mm MDF Backply",
    edging: "None",
    grooving: "None",
  })

  // Screw plate
  cuttingList.push({
    name: `Pullout ${index + 1} Screw Plates `,
    length: panelLength,
    width: 100,
    quantity: 4 * quantity,
    material: "18mm Particle Board",
    edging: "None",
    grooving: "None",
  })

  // Screw plate
  cuttingList.push({
    name: `Pullout ${index + 1} Screw Plates `,
    length: panelLength,
    width: 100,
    quantity: 2 * quantity,
    material: "18mm Particle Board",
    edging: "L1",
    grooving: "None",
  })

  // Door
  const doorWidth = width === 600 ? 595 : 495
  cuttingList.push({
    name: `Pullout ${index + 1} Door`,
    length: height - 5,
    width: doorWidth,
    quantity: 1 * quantity,
    material: "18mm MDF board",
    edging: "L1,L2,W1,W2",
    grooving: "None",
  })
}

