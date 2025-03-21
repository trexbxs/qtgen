"use client"

import { useState, useEffect } from "react"
import type { CabinetItem } from "@/lib/types"

interface CuttingListTableProps {
  cuttingList: CabinetItem[]
}

export default function CuttingListTable({ cuttingList }: CuttingListTableProps) {
  const [sortState, setSortState] = useState(0) // 0: default, 1: by material asc, 2: by material desc, 3: grouped, 4: original
  const [displayList, setDisplayList] = useState<CabinetItem[]>([])

  // Initialize displayList with cuttingList when component mounts or cuttingList changes
  useEffect(() => {
    // Only update and log if there's actual data
    if (cuttingList && cuttingList.length > 0) {
      setDisplayList([...cuttingList])
      console.log("CuttingListTable received cuttingList:", cuttingList)
    } else {
      setDisplayList([])
    }
  }, [cuttingList])

  const sortCuttingList = () => {
    // Increment sort state
    const newSortState = (sortState + 1) % 5
    setSortState(newSortState)

    switch (newSortState) {
      case 0: // Default state
        setDisplayList([...cuttingList])
        break
      case 1: // Material ascending
        setDisplayList([...cuttingList].sort((a, b) => a.material.localeCompare(b.material)))
        break
      case 2: // Material descending
        setDisplayList([...cuttingList].sort((a, b) => b.material.localeCompare(a.material)))
        break
      case 3: // Grouped items
        displayGroupedItems()
        break
      case 4: // Original order
        setDisplayList([...cuttingList])
        break
    }
  }

  const displayGroupedItems = () => {
    // Group similar items
    const groupedItems: Record<string, CabinetItem> = {}

    cuttingList.forEach((item) => {
      // Extract core item name and clean up
      const baseName = item.name.toLowerCase()

      // Extract the core item type with improved pattern matching
      let coreName = ""
      if (baseName.includes("door")) {
        coreName = "Door"
      } else if (baseName.includes("drawer face")) {
        coreName = "Drawer Face"
      } else if (baseName.includes("drawer side")) {
        coreName = "Drawer Side"
      } else if (baseName.includes("drawer back")) {
        coreName = "Drawer Back"
      } else if (baseName.includes("drawer bottom")) {
        coreName = "Drawer Bottom"
      } else if (baseName.includes("end panel")) {
        coreName = "End Panel"
      } else if (baseName.includes("side panel")) {
        coreName = "Side Panel"
      } else if (baseName.includes("shelf")) {
        coreName = "Shelf"
      } else if (baseName.includes("back ply")) {
        coreName = "Back Ply"
      } else if (baseName.includes("screw plate")) {
        coreName = "Screw Plate"
      } else if (baseName.includes("top & bottom panel")) {
        coreName = "Top & Bottom Panel"
      } else if (baseName.includes("bottom panel")) {
        coreName = "Bottom Panel"
      } else if (baseName.includes("top panel")) {
        coreName = "Top Panel"
      } else if (baseName.includes("blanking panel")) {
        coreName = "Blanking Panel"
      } else if (baseName.includes("blanking strip")) {
        coreName = "Blanking Strip"
      } else {
        // Remove cabinet type prefixes
        coreName = item.name.replace(/^(Base|Wall|Corner|Tall Unit|Corner Base|Corner Wall)\s+\d+\s+/, "")
      }

      // Create a unique key that includes all relevant properties
      const dimensions = `${item.length}x${item.width}`
      const key = `${coreName}|${dimensions}|${item.material}|${item.edging}|${item.grooving}`

      if (!groupedItems[key]) {
        groupedItems[key] = {
          name: coreName,
          length: item.length,
          width: item.width,
          quantity: 0,
          edging: item.edging,
          grooving: item.grooving,
          material: item.material,
        }
      }
      groupedItems[key].quantity += item.quantity
    })

    // Convert grouped items to array and sort
    const groupedArray = Object.values(groupedItems)
    groupedArray.sort((a, b) => {
      // First sort by material
      const materialCompare = a.material.localeCompare(b.material)
      if (materialCompare !== 0) return materialCompare

      // Then sort by name
      const nameCompare = a.name.localeCompare(b.name)
      if (nameCompare !== 0) return nameCompare

      // Finally sort by dimensions (largest to smallest)
      const aArea = a.length * a.width
      const bArea = b.length * b.width
      return bArea - aArea
    })

    setDisplayList(groupedArray)
  }

  return (
    <div className="table-responsive">
      <table className="table">
        <thead>
          <tr>
            <th>Item</th>
            <th>Length (mm)</th>
            <th>Width (mm)</th>
            <th>Quantity</th>
            <th>Edging</th>
            <th>Grooving</th>
            <th>
              Material
              <i
                className={`bi ${sortState === 0 || sortState === 3 || sortState === 4 ? "bi-arrow-down-up" : sortState === 1 ? "bi-arrow-up" : "bi-arrow-down"} sort-icon`}
                onClick={sortCuttingList}
              ></i>
            </th>
          </tr>
        </thead>
        <tbody>
          {displayList.map((item, index) => (
            <tr key={index}>
              <td>{item.name}</td>
              <td>{item.length}</td>
              <td>{item.width}</td>
              <td>{item.quantity}</td>
              <td>{item.edging}</td>
              <td>{item.grooving}</td>
              <td>{item.material}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

