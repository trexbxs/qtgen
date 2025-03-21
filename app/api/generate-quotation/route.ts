import { type NextRequest, NextResponse } from "next/server"
import type { CabinetItem } from "@/lib/types"
import { generateQuotationData } from "@/lib/quotation-generator"

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const cuttingList = data.cuttingList as CabinetItem[]

    // Generate quotation data using the server-side function
    const { quotationItems, worktopItems } = generateQuotationData(cuttingList)

    return NextResponse.json({
      quotationItems,
      worktopItems,
    })
  } catch (error) {
    console.error("Error generating quotation:", error)
    return NextResponse.json({ error: "Failed to generate quotation" }, { status: 500 })
  }
}

