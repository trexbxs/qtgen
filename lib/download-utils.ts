import type { CabinetItem, ClientInfo } from "@/lib/types"
import { jsPDF } from "jspdf"
import 'jspdf-autotable'
// Add proper typings for jsPDF with autotable
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
    lastAutoTable: {
      finalY: number;
    };
    GState: any;
  }
}
import * as XLSX from "xlsx"

export async function downloadExcel(cuttingList: CabinetItem[]) {
  const ws = XLSX.utils.json_to_sheet(cuttingList)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, "Cutting List")

  // Convert workbook to array buffer
  const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" })

  // Create blob and download
  const blob = new Blob([wbout], { type: "application/octet-stream" })
  
  try {
    // Use the saveAs function pattern for better browser compatibility
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "kitchen_cutting_list.xlsx"
    // Use a safer approach that works in most browsers
    document.body.appendChild(a)
    a.click()
    // Small delay before cleanup
    setTimeout(() => {
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }, 100)
  } catch (error) {
    console.error("Error downloading Excel file:", error)
    alert("There was an error downloading the file. Please try again.")
  }
}

export async function downloadWord(cuttingList: CabinetItem[]) {
  let content =
    '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">'
  content += "<head><meta charset='utf-8'><title>Kitchen Cutting List</title>"
  content += "<style>"
  content += "@page { size: 21cm 29.7cm; margin: 0; }"
  content += "body { margin: 0; padding: 0; width: 21cm; height: 29.7cm; }"
  content += ".word-document { position: relative; width: 21cm; height: 29.7cm; page-break-after: always; }"
  content += ".word-letterhead { position: absolute; top: 0; left: 0; width: 21cm; height: 29.7cm; z-index: -1; }"
  content +=
    ".word-content { position: relative; padding-top: 7.5cm; padding-left: 1.4cm; padding-right: 1.4cm; z-index: 1; }"
  content += "table { width: 100%; border-collapse: collapse; }"
  content += "th, td { border: none; border-bottom: 1px solid #000; padding: 2mm; font-size: 9pt; }"
  content += "th { font-weight: bold; }"
  content += ".summary { margin-top: 1cm; font-size: 9pt; }"
  content += "</style>"
  content += "</head><body>"
  content += "<div class='word-document'>"
  content += "<img class='word-letterhead' src='/placeholder.svg?height=1000&width=800' />"
  content += "<div class='word-content'>"

  // Add table
  content += "<table border='1' cellspacing='0' cellpadding='5'>"
  content += "<thead><tr>"
  content +=
    "<th>Item</th><th>Length (mm)</th><th>Width (mm)</th><th>Quantity</th><th>Edging</th><th>Grooving</th><th>Material</th>"
  content += "</tr></thead><tbody>"

  // Add rows
  cuttingList.forEach((item) => {
    content += "<tr>"
    content += `<td>${item.name}</td>`
    content += `<td>${item.length}</td>`
    content += `<td>${item.width}</td>`
    content += `<td>${item.quantity}</td>`
    content += `<td>${item.edging}</td>`
    content += `<td>${item.grooving}</td>`
    content += `<td>${item.material}</td>`
    content += "</tr>"
  })

  content += "</tbody></table>"
  content += "</div></div></body></html>"

  // Create blob and download
  const blob = new Blob([content], { type: "application/msword;charset=utf-8" })
  
  try {
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "kitchen_cutting_list.doc"
    document.body.appendChild(a)
    a.click()
    // Small delay before cleanup
    setTimeout(() => {
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }, 100)
  } catch (error) {
    console.error("Error downloading Word file:", error)
    alert("There was an error downloading the file. Please try again.")
  }
}

export function formatDate(date: Date) {
  const day = date.getDate()
  const month = date.toLocaleString("default", { month: "long" })
  const year = date.getFullYear()
  const suffixes = ["th", "st", "nd", "rd"]
  const specialCases = [11, 12, 13]
  let suffix = suffixes[0]

  if (!specialCases.includes(day % 100)) {
    suffix = suffixes[day % 10] || suffixes[0]
  }

  return `${day}${suffix} ${month} ${year}`
}

export function capitalizeWords(str: string) {
  return str.replace(/\b\w/g, (char) => char.toUpperCase())
}

export function generatePDFFilename(clientInfo: ClientInfo) {
  return `${clientInfo.clientName}-${clientInfo.projectLocation}-Cuttinglist-${clientInfo.currentDate}.pdf`.replace(
    /\s+/g,
    "-",
  )
}

export async function downloadPDF(cuttingList: CabinetItem[], clientInfo: ClientInfo) {
  try {
    // Check which template to use
    if (clientInfo.template === "capitalD") {
      await generateCapitalDPDF(cuttingList, clientInfo)
      return
    }
    
    // Template 1 (default) implementation
    const doc = new jsPDF()

    // Sort the cutting list
    const sortedList = [...cuttingList].sort((a, b) => {
      const materialOrder = {
        "18mm MDF board": 1,
        "18mm Particle Board": 2,
        "3mm MDF Backply": 3,
      }
      return (
        materialOrder[a.material as keyof typeof materialOrder] - materialOrder[b.material as keyof typeof materialOrder]
      )
    })

    // Group items by material
    const groupedList = sortedList.reduce(
      (acc, item) => {
        if (!acc[item.material]) {
          acc[item.material] = []
        }
        acc[item.material].push(item)
        return acc
      },
      {} as Record<string, CabinetItem[]>,
    )

    let currentPage = 1
    let yPosition = 57

    // Template 1-specific styling
    // This would ideally use an image background, but for simplicity we'll create a clean styled document
    doc.setFillColor(240, 240, 240)
    doc.rect(0, 0, 210, 40, "F")
    doc.setFont("helvetica", "bold")
    doc.setFontSize(20)
    doc.setTextColor(50, 50, 50)
    doc.text("KITCHEN CUTTING LIST", 105, 20, { align: "center" })

    // Add client information on the first page
    doc.setFont("helvetica", "normal")
    doc.setFontSize(12)
    doc.setTextColor(0, 0, 0)

    // Client Name
    doc.text(`Client: ${clientInfo.clientName}`, 20, 50)
    
    // Project Location
    doc.text(`Location: ${clientInfo.projectLocation}`, 20, 58)
    
    // Current Date
    doc.text(`Date: ${clientInfo.currentDate}`, 20, 66)
    
    // Process each material group
    Object.entries(groupedList).forEach(([material, items], index) => {
      // Add new page if necessary
      if (index > 0) {
        doc.addPage()
        yPosition = 20
      }

      // Add material header
      doc.setFont("helvetica", "bold")
      doc.setFontSize(12)
      doc.text(material, 20, yPosition)
      yPosition += 10

      // Check if autoTable is available
      if (typeof doc.autoTable === 'function') {
        // Use autoTable for each material group
        doc.autoTable({
          head: [["Item", "Length (mm)", "Width (mm)", "Quantity", "Edging", "Grooving", "Material"]],
          body: items.map((item) => [
            item.name,
            item.length,
            item.width,
            item.quantity,
            item.edging,
            item.grooving,
            item.material,
          ]),
          startY: yPosition,
          styles: {
            cellPadding: 2,
            fontSize: 9,
            font: "helvetica",
          },
          headStyles: {
            fillColor: [220, 220, 220],
            textColor: [0, 0, 0],
            fontSize: 10,
            fontStyle: "bold",
          },
        })

        yPosition = doc.lastAutoTable.finalY + 10
      } else {
        // Fallback manual table implementation
        const headers = ["Item", "Length", "Width", "Qty", "Edging", "Grooving", "Material"]
        const colWidths = [60, 20, 20, 15, 25, 25, 25]
        const startX = 20
        let currentX = startX
        
        // Draw header row
        doc.setFillColor(220, 220, 220)
        doc.rect(startX, yPosition, 190, 8, 'F')
        doc.setTextColor(0, 0, 0)
        
        headers.forEach((header, i) => {
          doc.text(header, currentX + 2, yPosition + 6)
          currentX += colWidths[i]
        })
        
        yPosition += 8
        
        // Draw data rows
        doc.setTextColor(60, 60, 60)
        items.forEach(item => {
          currentX = startX
          
          const rowData = [
            item.name,
            item.length.toString(),
            item.width.toString(),
            item.quantity.toString(),
            item.edging,
            item.grooving,
            item.material
          ]
          
          rowData.forEach((text, i) => {
            // Truncate text if too long
            const maxChars = Math.floor(colWidths[i] / 2)
            const displayText = text.length > maxChars ? text.substring(0, maxChars) + '...' : text
            doc.text(displayText, currentX + 2, yPosition + 6)
            currentX += colWidths[i]
          })
          
          // Draw row border
          doc.line(startX, yPosition + 8, startX + 190, yPosition + 8)
          
          yPosition += 8
          
          // Add new page if needed
          if (yPosition > 270) {
            doc.addPage()
            yPosition = 20
          }
        })
        
        yPosition += 10
      }

      currentPage++
    })

    // Generate the filename and save the PDF
    const filename = generatePDFFilename(clientInfo)
    doc.save(filename)
  } catch (error) {
    console.error("Error generating PDF:", error)
    alert("There was an error generating the PDF. Please try again.")
  }
}

// Add the Capital D Template implementation
async function generateCapitalDPDF(cuttingList: CabinetItem[], clientInfo: ClientInfo) {
  try {
    // Create a landscape PDF
    const doc = new jsPDF('landscape')
    
    // Set drawing parameters
    const pageWidth = doc.internal.pageSize.width
    const pageHeight = doc.internal.pageSize.height
    
    // Draw header
    doc.setFontSize(16)
    doc.setFont('helvetica', 'bold')
    doc.text('CAPITAL', 20, 20)
    
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    doc.text('BOARDS - HARDWOOD - ACCESSORIES', 20, 25)
    
    // Draw main header notes
    doc.setFontSize(10)
    doc.text('NOTE: DEDUCT 1MM EDGING ON YOUR CUTLIST THAT IS THE SIZE WE CUT.', 85, 20)
    doc.text('NOTE: PART LIST CANNOT BE AMENDED IN ANY FORM OR MANNER ONCE CASHIER HAS RECEIVED IT.', 160, 20)
    doc.text('PROVIDE YOUR CUTLIST WITHOUT THE LIPPING BECAUSE WE CUT AS WRITTEN', 160, 25)
    
    // Draw client information
    doc.setFontSize(10)
    doc.setFont('helvetica', 'bold')
    doc.text('NAME:', 20, 35)
    doc.text('CONTACT NUMBER:', 20, 40)
    
    doc.setFont('helvetica', 'normal')
    doc.text(clientInfo.clientName, 40, 35)
    doc.text(clientInfo.projectLocation, 70, 40)
    
    // Table headers - first row
    doc.setFontSize(8)
    doc.setFont('helvetica', 'bold')
    const tableY = 50
    const columnPositions = [20, 60, 100, 130, 145, 160, 190, 210, 230, 250]
    const headers = ['PART', 'PART SIZES', 'MATERIALS', 'PIECES', 'EDGE', 'EDGE SIDES', 'NO-SIDE HINGES', 'GROOVE SIDE', 'VERIFY', 'OTHER']
    
    headers.forEach((header, index) => {
      doc.text(header, columnPositions[index], tableY)
    })
    
    // Subheaders - second row
    doc.setFontSize(7)
    doc.text('DESCRIPTION', columnPositions[0], tableY + 5)
    doc.text('LENGTH WIDTH', columnPositions[1], tableY + 5)
    doc.text('TH MDF PB PLY', columnPositions[2], tableY + 5)
    doc.text('QTY', columnPositions[3], tableY + 5)
    doc.text('COLOR', columnPositions[4], tableY + 5)
    doc.text('E1 E2 E3 E4', columnPositions[5], tableY + 5)
    doc.text('H1 H2 H3 H4', columnPositions[6], tableY + 5)
    doc.text('G1 G2 G3 G4', columnPositions[7], tableY + 5)
    
    // Draw horizontal line below headers
    doc.setLineWidth(0.2)
    doc.line(20, tableY + 7, pageWidth - 20, tableY + 7)
    
    // Draw table rows for each cutting list item
    let yPosition = tableY + 12
    const rowHeight = 7
    
    cuttingList.forEach((item, index) => {
      // Check if we need a new page
      if (yPosition > pageHeight - 20) {
        doc.addPage()
        // Reset position to top of new page with some margin
        yPosition = 20
        
        // Add headers to new page
        doc.setFontSize(8)
        doc.setFont('helvetica', 'bold')
        headers.forEach((header, i) => {
          doc.text(header, columnPositions[i], yPosition)
        })
        
        // Draw horizontal line below headers
        doc.line(20, yPosition + 7, pageWidth - 20, yPosition + 7)
        
        // Move position down for content
        yPosition += 12
      }
      
      // Item description
      doc.setFontSize(8)
      doc.setFont('helvetica', 'normal')
      doc.text(item.name, columnPositions[0], yPosition)
      
      // Part sizes
      doc.text(`${item.length} x ${item.width}`, columnPositions[1], yPosition)
      
      // Material - check the material type and mark the appropriate column
      if (item.material.includes('Particle Board')) {
        doc.text('✓', columnPositions[2] + 15, yPosition) // PB column
      } else if (item.material.includes('MDF board')) {
        doc.text('✓', columnPositions[2] + 5, yPosition) // MDF column
      } else if (item.material.includes('Backply')) {
        doc.text('✓', columnPositions[2] + 25, yPosition) // PLY column
      }
      
      // Quantity
      doc.text(item.quantity.toString(), columnPositions[3], yPosition)
      
      // Draw checkmarks for edging sides if defined
      if (item.edging) {
        const edging = item.edging.toLowerCase()
        if (edging.includes('l1')) doc.text('✓', columnPositions[5], yPosition)
        if (edging.includes('l2')) doc.text('✓', columnPositions[5] + 5, yPosition)
        if (edging.includes('w1')) doc.text('✓', columnPositions[5] + 10, yPosition)
        if (edging.includes('w2')) doc.text('✓', columnPositions[5] + 15, yPosition)
      }
      
      // Draw checkmarks for grooving if defined
      if (item.grooving && item.grooving.toLowerCase().includes('g1')) {
        doc.text('✓', columnPositions[7], yPosition)
      }
      
      // Increment position for next row
      yPosition += rowHeight
    })
    
    // Generate the filename and save the PDF
    const filename = generatePDFFilename(clientInfo)
    doc.save(filename)
  } catch (error) {
    console.error("Error generating Capital D PDF:", error)
    alert("There was an error generating the PDF. Please try again.")
  }
}

