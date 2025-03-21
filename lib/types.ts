export interface CabinetItem {
  name: string
  length: number
  width: number
  quantity: number
  material: string
  edging: string
  grooving: string
}

export interface UsedSpace {
  x: number
  y: number
  width: number
  height: number
}

export interface Board {
  pieces: BoardPiece[]
  usedSpaces: UsedSpace[]
}

export interface BoardPiece {
  name: string
  length: number
  width: number
  x: number
  y: number
  material: string
  edging: string
  grooving: string
}

export interface CabinetFormData {
  type?:
    | "doors"
    | "drawers"
    | "open"
    | "corner"
    | "single"
    | "double"
    | "gaslift"
    | "bifold"
    | "fridgeUnit"
    | "ovenMicrowave"
    | "glassUnit"
    | "pullout"
    | "lowLevel"
    | "highLevel"
    | "tallUnits"
    | "custom"
  quantity?: number
  width?: number
  height?: number
  depth?: number
  doorConfig?: "single" | "double"
  drawerCount?: number
  wallType?: "single" | "double" | "gaslift" | "bifold" | "open"
  cornerBaseWidth?: number
  cornerWallWidth?: number
  cornerWallHeight?: number
  tallUnitType?: "fridgeUnit" | "ovenMicrowave" | "glassUnit" | "pullout"
  fridgeUnitPanelHeight?: number
  fridgeUnitPanelDepth?: number
  fridgeUnitTopBoxHeight?: number
  fridgeUnitTopBoxDoorType?: "flip" | "double"
  fridgeUnitBoxWidth?: number
  ovenMicrowaveConfig?: "oven" | "microwave" | "micrOven"
  ovenMicrowaveDrawers?: number
  ovenMicrowaveHeight?: number
  ovenMicrowaveDepth?: number
  ovenMicrowaveShelf?: number
  ovenMicrowaveDoorsHeight?: number
  glassUnitWidth?: number
  glassUnitHeight?: number
  glassUnitShelves?: number
  glassUnitDepth?: number
  glassUnitDoorType?: "metalGlass" | "mdfGlass" | "plainMdf"
  pulloutWidth?: number
  pulloutHeight?: number
  pulloutDepth?: number
  endPanelType?: "lowLevel" | "highLevel" | "tallUnits" | "custom"
  endPanelHeight?: number
  endPanelDepth?: number
  endPanelWidth?: number
}

export interface QuotationItem {
  description: string
  units: string
  qty: number
  unitPrice: number
}

export interface WorktopItem {
  description: string
  size?: string
  lengths?: number[]
  units: string
  qty: number
  unitPrice: number
}

export interface ClientInfo {
  clientName: string
  projectLocation: string
  currentDate: string
  template: string
}

export interface CuttingListItem {
  name: string
  length: number
  width: number
  quantity: number
  material: string
  edging: string
  grooving: string
}

export interface BoardRequirements {
  particleBoards: number
  mdfBoards: number
  mdfBackply: number
  particleBoardEdgingLength: number
  mdfBoardEdgingLength: number
  particleBoardGroovingLength: number
  mdfBoardGroovingLength: number
}

export interface CabinetData {
  type: string
  index?: number
  quantity: number
  dimensions?: {
    width: number
    height: number
    depth: number
  }
  options?: {
    baseType?: string
    doorConfig?: string
    drawerCount?: number
    wallType?: string
    endPanelType?: string
    tallUnitType?: string
  }
}

