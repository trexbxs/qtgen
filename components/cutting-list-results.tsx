"use client"

import { useState, useEffect } from "react"
import type { CabinetItem, ClientInfo } from "@/lib/types"
import CuttingListTable from "@/components/cutting-list-table"
import CuttingListSummary from "@/components/cutting-list-summary"
import BoardVisualization from "@/components/board-visualization"
import QuotationSection from "@/components/quotation-section"
import ClientInfoModal from "@/components/client-info-modal"
import { downloadExcel, downloadWord, downloadPDF } from "@/lib/download-utils"

export default function CuttingListResults() {
  const [cuttingList, setCuttingList] = useState<CabinetItem[]>([])
  const [showVisualization, setShowVisualization] = useState(false)
  const [showQuotation, setShowQuotation] = useState(false)
  const [showClientInfoModal, setShowClientInfoModal] = useState(false)
  const [activeDownloadFormat, setActiveDownloadFormat] = useState<string | null>(null)
  const [hasGeneratedList, setHasGeneratedList] = useState(false)

  useEffect(() => {
    // Helper function to load cutting list from localStorage
    const loadCuttingList = () => {
      if (typeof window === 'undefined') return
      
    const storedCuttingList = localStorage.getItem("cuttingList")
      console.log("Attempting to load cutting list from localStorage")
      
    if (storedCuttingList) {
        try {
          const parsedList = JSON.parse(storedCuttingList)
          if (Array.isArray(parsedList) && parsedList.length > 0) {
            console.log("Successfully loaded cutting list:", parsedList.length, "items")
            setCuttingList(parsedList)
            setHasGeneratedList(true)
          } else {
            console.log("Cutting list was empty or invalid")
            setCuttingList([])
            setHasGeneratedList(false)
          }
        } catch (error) {
          console.error("Error parsing cutting list from localStorage:", error)
          setCuttingList([])
          setHasGeneratedList(false)
        }
      } else {
        console.log("No cutting list found in localStorage")
        setCuttingList([])
        setHasGeneratedList(false)
      }
    }
    
    // Handler for the custom event
    const handleCuttingListUpdate = () => {
      console.log("⚡ Cutting list update event received")
      setTimeout(loadCuttingList, 100) // Add small delay to ensure localStorage is updated
    }

    // Try to load the cutting list immediately on mount
    if (typeof window !== 'undefined') {
      loadCuttingList()
      
      // Add event listener for future updates
      window.addEventListener("cuttingListUpdated", handleCuttingListUpdate)
      console.log("Added event listener for cuttingListUpdated")
    }

    // Clean up
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener("cuttingListUpdated", handleCuttingListUpdate)
        console.log("Removed event listener for cuttingListUpdated")
      }
    }
  }, [])

  const generateQuotation = () => {
    setShowQuotation(true)
    setTimeout(() => {
      document.getElementById("quotationSection")?.scrollIntoView({ behavior: "smooth" })
    }, 100)
  }

  const visualizeBoards = () => {
    setShowVisualization(true)
    setTimeout(() => {
      document.getElementById("visualization")?.scrollIntoView({ behavior: "smooth" })
    }, 100)
  }

  const downloadCuttingList = (format: string) => {
    setActiveDownloadFormat(format)
    if (format === "pdf") {
      setShowClientInfoModal(true)
    } else {
      // Handle Excel and Word downloads
      if (format === "excel") {
        downloadExcel(cuttingList)
      } else if (format === "word") {
        downloadWord(cuttingList)
      }
    }
  }

  const handleClientInfoSubmit = (clientInfo: ClientInfo) => {
    if (activeDownloadFormat === "pdf") {
      downloadPDF(cuttingList, clientInfo)
    }
    setShowClientInfoModal(false)
  }

  return (
    <div id="results" className="mt-5" style={{ display: hasGeneratedList ? "block" : "none" }}>
      <h2>Cutting List</h2>
      <div id="cuttingList">
        {cuttingList.length > 0 ? (
        <CuttingListTable cuttingList={cuttingList} />
        ) : (
          <p>No cutting list items found. Please generate a cutting list first.</p>
        )}
      </div>

      {cuttingList.length > 0 && (
        <>
      <h3>Cutting List Summary</h3>
      <div id="cuttingListSummary" className="row row-cols-1 row-cols-md-3 g-4 mt-0">
        <CuttingListSummary cuttingList={cuttingList} />
      </div>

      <div className="position-relative mt-4">
        <div className="mobile-action-buttons">
          <div className="top-row">
            <div className="dropdown download-btn-container">
              <button
                className="modern-btn dropdown-toggle mb-4"
                type="button"
                id="dropdownMenuButton"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <i className="bi bi-download me-2"></i>
                Download Cutting List
              </button>
              <ul className="dropdown-menu modern-dropdown-menu download-options" aria-labelledby="dropdownMenuButton">
                <li>
                  <a className="dropdown-item" href="#" onClick={() => downloadCuttingList("excel")}>
                    <i className="bi bi-file-earmark-excel me-2"></i>
                    Excel
                  </a>
                </li>
                <li>
                  <a className="dropdown-item" href="#" onClick={() => downloadCuttingList("word")}>
                    <i className="bi bi-file-earmark-word me-2"></i>
                    Word
                  </a>
                </li>
                <li>
                  <a className="dropdown-item" href="#" onClick={() => downloadCuttingList("pdf")}>
                    <i className="bi bi-file-earmark-pdf me-2"></i>
                    PDF
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="middle-row">
            <button className="modern-btn mb-4 visualize-btn" onClick={visualizeBoards}>
              <i className="bi bi-grid-3x3-gap me-2"></i>
              Visualize Boards
            </button>
          </div>
          <div className="bottom-row">
            <button className="modern-btn mb-4 quotation-btn" onClick={generateQuotation}>
              <i className="bi bi-calculator me-2"></i>
              Generate Quotation
            </button>
          </div>
        </div>
      </div>
        </>
      )}

      {showVisualization && <BoardVisualization cuttingList={cuttingList} />}

      {showQuotation && <QuotationSection key={JSON.stringify(cuttingList)} cuttingList={cuttingList} />}

      {showClientInfoModal && (
        <ClientInfoModal
          show={showClientInfoModal}
          onClose={() => setShowClientInfoModal(false)}
          onSubmit={handleClientInfoSubmit}
        />
      )}
    </div>
  )
}

