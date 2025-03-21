"use client"

import type React from "react"

import { useState, useEffect } from "react"
import type { CabinetItem, QuotationItem, WorktopItem } from "@/lib/types"

interface QuotationSectionProps {
  cuttingList: CabinetItem[]
}

export default function QuotationSection({ cuttingList }: QuotationSectionProps) {
  const [quotationData, setQuotationData] = useState<QuotationItem[]>([])
  const [worktopData, setWorktopData] = useState<WorktopItem[]>([])
  const [subtotal, setSubtotal] = useState(0)
  const [labourPercentage, setLabourPercentage] = useState(30)
  const [labourAmount, setLabourAmount] = useState(0)
  const [totalAmount, setTotalAmount] = useState(0)
  const [worktopTotal, setWorktopTotal] = useState(0)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const fetchQuotationData = async () => {
      try {
        setIsLoading(true)
        const response = await fetch("/api/generate-quotation", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ cuttingList }),
        })

        if (!response.ok) {
          throw new Error("Failed to generate quotation")
        }

        const data = await response.json()
        setQuotationData(data.quotationItems)
        setWorktopData(data.worktopItems)

        // Calculate initial totals
        const initialSubtotal = data.quotationItems.reduce(
          (sum: number, item: QuotationItem) => sum + item.qty * item.unitPrice,
          0,
        )
        const initialWorktopTotal = data.worktopItems.reduce(
          (sum: number, item: WorktopItem) => sum + item.qty * item.unitPrice,
          0,
        )

        setSubtotal(initialSubtotal)
        setLabourAmount(initialSubtotal * (labourPercentage / 100))
        setTotalAmount(initialSubtotal + initialSubtotal * (labourPercentage / 100))
        setWorktopTotal(initialWorktopTotal)
      } catch (error) {
        console.error("Error fetching quotation data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchQuotationData()
  }, [cuttingList, labourPercentage])

  const handleLabourPercentageChange = (e: React.FocusEvent<HTMLTableCellElement>) => {
    const newPercentage = Number.parseFloat(e.target.textContent || "30")
    setLabourPercentage(newPercentage)
    const newLabourAmount = subtotal * (newPercentage / 100)
    setLabourAmount(newLabourAmount)
    setTotalAmount(subtotal + newLabourAmount)
  }

  const handleCellEdit = (index: number, field: keyof QuotationItem, value: string) => {
    const updatedData = [...quotationData]

    if (field === "qty" || field === "unitPrice") {
      updatedData[index][field] = Number.parseFloat(value)
    } else {
      updatedData[index][field] = value
    }

    setQuotationData(updatedData)

    // Recalculate totals
    const newSubtotal = updatedData.reduce((sum, item) => sum + item.qty * item.unitPrice, 0)
    setSubtotal(newSubtotal)
    const newLabourAmount = newSubtotal * (labourPercentage / 100)
    setLabourAmount(newLabourAmount)
    setTotalAmount(newSubtotal + newLabourAmount)
  }

  const handleWorktopCellEdit = (index: number, field: keyof WorktopItem, value: string) => {
    const updatedData = [...worktopData]

    if (field === "qty" || field === "unitPrice") {
      updatedData[index][field] = Number.parseFloat(value)
    } else {
      updatedData[index][field] = value
    }

    setWorktopData(updatedData)

    // Recalculate worktop total
    const newWorktopTotal = updatedData.reduce((sum, item) => sum + item.qty * item.unitPrice, 0)
    setWorktopTotal(newWorktopTotal)
  }

  if (isLoading) {
    return <div className="text-center py-4">Loading quotation data...</div>
  }

  return (
    <div id="quotationSection" className="mt-4 container">
      <h3>Kitchen Cabinets Quote</h3>
      <div className="table-responsive">
        <table className="table table-striped mt-2 table-condensed">
          <thead>
            <tr>
              <th>Description</th>
              <th>Units</th>
              <th>QTY</th>
              <th>Unit Price</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody id="quotationBody">
            {quotationData.map((item, index) => (
              <tr key={index}>
                <td
                  contentEditable={true}
                  suppressContentEditableWarning={true}
                  onBlur={(e) => handleCellEdit(index, "description", e.currentTarget.textContent || "")}
                >
                  {item.description}
                </td>
                <td
                  contentEditable={true}
                  suppressContentEditableWarning={true}
                  onBlur={(e) => handleCellEdit(index, "units", e.currentTarget.textContent || "")}
                >
                  {item.units}
                </td>
                <td
                  contentEditable={true}
                  suppressContentEditableWarning={true}
                  onBlur={(e) => handleCellEdit(index, "qty", e.currentTarget.textContent || "")}
                >
                  {typeof item.qty === "number" ? item.qty.toFixed(2) : item.qty}
                </td>
                <td
                  contentEditable={true}
                  suppressContentEditableWarning={true}
                  onBlur={(e) =>
                    handleCellEdit(index, "unitPrice", e.currentTarget.textContent?.replace(/,/g, "") || "")
                  }
                >
                  {item.unitPrice.toLocaleString()}
                </td>
                <td>{(item.qty * item.unitPrice).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={3}></td>
              <td>
                <strong>SUBTOTAL</strong>
              </td>
              <td>
                <strong>
                  <span id="subtotal">{subtotal.toLocaleString()}</span>
                </strong>
              </td>
            </tr>
            <tr>
              <td>
                <strong>ADD LABOUR</strong>
              </td>
              <td>%</td>
              <td
                contentEditable={true}
                suppressContentEditableWarning={true}
                className="labour-percentage"
                onBlur={handleLabourPercentageChange}
              >
                {labourPercentage}
              </td>
              <td></td>
              <td>
                <span id="labourAmount">{labourAmount.toLocaleString()}</span>
              </td>
            </tr>
            <tr>
              <td colSpan={3}></td>
              <td>
                <strong>TOTAL</strong>
              </td>
              <td>
                <strong>
                  <span id="totalAmount">{totalAmount.toLocaleString()}</span>
                </strong>
              </td>
            </tr>
          </tfoot>
        </table>
        <h4 className="mt-4">WORKTOP</h4>
        <table className="table table-striped mt-2 table-condensed">
          <thead>
            <tr>
              <th>Description</th>
              <th>Units</th>
              <th>QTY</th>
              <th>Unit Price</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody id="worktopQuotationBody">
            {worktopData.map((item, index) => (
              <tr key={index}>
                <td
                  contentEditable={true}
                  suppressContentEditableWarning={true}
                  onBlur={(e) => handleWorktopCellEdit(index, "description", e.currentTarget.textContent || "")}
                >
                  {item.description === "granite slabs" ? (
                    <div className="slab-description">
                      <span>granite slabs</span>
                      <div className="slab-size-selector">
                        {item.size || "2400 x 600"}
                        <div className="slab-size-options">
                          <div className="slab-size-option">2400 x 600</div>
                          <div className="slab-size-option">2700 x 600</div>
                        </div>
                      </div>
                      <div className="slab-lengths">
                        <span className="add-length-btn">
                          <i className="bi bi-plus-lg"></i>
                        </span>
                      </div>
                    </div>
                  ) : (
                    item.description
                  )}
                </td>
                <td
                  contentEditable={true}
                  suppressContentEditableWarning={true}
                  onBlur={(e) => handleWorktopCellEdit(index, "units", e.currentTarget.textContent || "")}
                >
                  {item.units}
                </td>
                <td
                  contentEditable={true}
                  suppressContentEditableWarning={true}
                  onBlur={(e) => handleWorktopCellEdit(index, "qty", e.currentTarget.textContent || "")}
                >
                  {typeof item.qty === "number" ? item.qty.toFixed(2) : item.qty}
                </td>
                <td
                  contentEditable={true}
                  suppressContentEditableWarning={true}
                  onBlur={(e) =>
                    handleWorktopCellEdit(index, "unitPrice", e.currentTarget.textContent?.replace(/,/g, "") || "")
                  }
                >
                  {item.unitPrice.toLocaleString()}
                </td>
                <td>{(item.qty * item.unitPrice).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={3}></td>
              <td>
                <strong>TOTAL</strong>
              </td>
              <td>
                <strong>
                  <span id="worktopTotal">{worktopTotal.toLocaleString()}</span>
                </strong>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  )
}

