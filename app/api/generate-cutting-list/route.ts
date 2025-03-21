import { type NextRequest, NextResponse } from "next/server"
import type { CabinetFormData } from "@/lib/types"
import { generateCuttingList } from "@/lib/cutting-list-generator"

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    
    // Ensure cabinets object exists
    if (!data.cabinets) {
      console.warn("No cabinets data provided")
      return NextResponse.json({ cuttingList: [] })
    }
    
    const cabinets = data.cabinets as {
      baseCabinets: CabinetFormData[]
      cornerBase: CabinetFormData[]
      wallCabinets: CabinetFormData[]
      cornerWall: CabinetFormData[]
      tallUnits: CabinetFormData[]
      endPanels: CabinetFormData[]
    }

    // Ensure all cabinet arrays exist
    cabinets.baseCabinets = Array.isArray(cabinets.baseCabinets) ? cabinets.baseCabinets : []
    cabinets.cornerBase = Array.isArray(cabinets.cornerBase) ? cabinets.cornerBase : []
    cabinets.wallCabinets = Array.isArray(cabinets.wallCabinets) ? cabinets.wallCabinets : []
    cabinets.cornerWall = Array.isArray(cabinets.cornerWall) ? cabinets.cornerWall : []
    cabinets.tallUnits = Array.isArray(cabinets.tallUnits) ? cabinets.tallUnits : []
    cabinets.endPanels = Array.isArray(cabinets.endPanels) ? cabinets.endPanels : []

    // Validate if we have any cabinets to process
    const hasCabinets = 
      cabinets.baseCabinets.length > 0 || 
      cabinets.cornerBase.length > 0 || 
      cabinets.wallCabinets.length > 0 || 
      cabinets.cornerWall.length > 0 || 
      cabinets.tallUnits.length > 0 || 
      cabinets.endPanels.length > 0

    if (!hasCabinets) {
      console.warn("No cabinet data found in request")
      return NextResponse.json({ cuttingList: [] })
    }

    // Generate cutting list using the server-side function
    const cuttingList = generateCuttingList(cabinets)

    return NextResponse.json({ cuttingList })
  } catch (error) {
    console.error("Error generating cutting list:", error)
    return NextResponse.json({ error: "Failed to generate cutting list" }, { status: 500 })
  }
}

