"use client"

import { useState, useEffect } from "react"
import type { CabinetItem } from "@/lib/types"
import { packPieces } from "@/lib/board-packer"

interface BoardVisualizationProps {
  cuttingList: CabinetItem[]
}

export default function BoardVisualization({ cuttingList }: BoardVisualizationProps) {
  const [activeMaterial, setActiveMaterial] = useState("particle")

  useEffect(() => {
    // Listen for visualization events
    const handleVisualize = () => {
      document.getElementById("visualization")?.scrollIntoView({ behavior: "smooth" })
    }

    document.addEventListener("visualize-boards", handleVisualize)

    return () => {
      document.removeEventListener("visualize-boards", handleVisualize)
    }
  }, [])

  const toggleMaterial = (material: string) => {
    setActiveMaterial(material)
  }

  const renderBoardsForMaterial = (materialType: string) => {
    const standardBoard = { width: 2440, length: 1220 }
    const kerfWidth = 4
    const edgeOffset = 10

    // Filter pieces by material and expand quantities
    const pieces: CabinetItem[] = []
    cuttingList
      .filter((item) => {
        switch (materialType) {
          case "particle":
            return item.material === "18mm Particle Board"
          case "mdf":
            return item.material === "18mm MDF board"
          case "backply":
            return item.material === "3mm MDF Backply"
          default:
            return false
        }
      })
      .forEach((item) => {
        for (let i = 0; i < item.quantity; i++) {
          pieces.push({
            name: item.name,
            length: item.length,
            width: item.width,
            quantity: 1,
            material: item.material,
            edging: item.edging,
            grooving: item.grooving,
          })
        }
      })

    const boards = packPieces(pieces, standardBoard, kerfWidth, edgeOffset)

    return (
      <>
        <div id="boardStats">
          <div className="row row-cols-1 row-cols-md-4 g-2 mx-0 my-3 px-0 container-fluid justify-content-between">
            <div className="col-12 col-md-3">
              <div
                className="card h-100 shadow-sm border-0"
                style={{ background: "linear-gradient(45deg, #4e54c8, #8f94fb)", borderRadius: "21px" }}
              >
                <div className="card-body d-flex align-items-center p-3">
                  <i className="bi bi-layers-fill text-white me-3" style={{ fontSize: "2.5rem" }}></i>
                  <div>
                    <div className="stat-value text-white">
                      {materialType === "particle"
                        ? "Particle Board"
                        : materialType === "mdf"
                          ? "MDF Board"
                          : "MDF Backply"}
                    </div>
                    <div className="stat-label text-white opacity-75">Material Type</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-12 col-md-3">
              <div
                className="card h-100 shadow-sm border-0"
                style={{
                  background:
                    materialType === "particle"
                      ? "linear-gradient(45deg, #27ae60, #2ecc71)"
                      : materialType === "mdf"
                        ? "linear-gradient(45deg, #2980b9, #3498db)"
                        : "linear-gradient(45deg, #f39c12, #f1c40f)",
                  borderRadius: "21px",
                }}
              >
                <div className="card-body d-flex align-items-center p-3">
                  <i className="bi bi-grid-3x3-gap-fill text-white me-3" style={{ fontSize: "2.5rem" }}></i>
                  <div>
                    <div className="stat-value text-white">{boards.length}</div>
                    <div className="stat-label text-white opacity-75">Boards Required</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-12 col-md-3">
              <div
                className="card h-100 shadow-sm border-0"
                style={{ background: "linear-gradient(45deg, #11998e, #38ef7d)", borderRadius: "21px" }}
              >
                <div className="card-body d-flex align-items-center p-3">
                  <i className="bi bi-pie-chart-fill text-white me-3" style={{ fontSize: "2.5rem" }}></i>
                  <div>
                    <div className="stat-value text-white">
                      {calculateEfficiency(pieces, boards.length, standardBoard)}%
                    </div>
                    <div className="stat-label text-white opacity-75">Material Efficiency</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-12 col-md-3">
              <div
                className="card h-100 shadow-sm border-0"
                style={{ background: "linear-gradient(45deg, #2193b0, #6dd5ed)", borderRadius: "21px" }}
              >
                <div className="card-body d-flex align-items-center p-3">
                  <i className="bi bi-bounding-box-circles text-white me-3" style={{ fontSize: "2.5rem" }}></i>
                  <div>
                    <div className="stat-value text-white">{(calculateTotalArea(pieces) / 1000000).toFixed(2)}m²</div>
                    <div className="stat-label text-white opacity-75">Total Area Used</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div id="boards">
          {boards.map((board, boardIndex) => (
            <div key={boardIndex} className="board-container">
              <div className="board-wrapper">
                <div className="board-header">
                  <div className="board-label">Board {boardIndex + 1}</div>
                  <div className="board-dimensions">2440mm × 1220mm</div>
                </div>
                <div className="board">
                  {board.pieces.map((piece, pieceIndex) => (
                    <div
                      key={pieceIndex}
                      className="piece"
                      data-material={materialType}
                      style={{
                        left: `${(piece.x / standardBoard.width) * 100}%`,
                        top: `${(piece.y / standardBoard.length) * 100}%`,
                        width: `${(piece.width / standardBoard.width) * 100}%`,
                        height: `${(piece.length / standardBoard.length) * 100}%`,
                      }}
                    >
                      <div
                        className={`piece-label ${piece.width < piece.length && piece.width < 200 ? "rotated" : ""}`}
                      >
                        <div className="piece-name">{piece.name}</div>
                        <div className="piece-dimensions">
                          {piece.width}×{piece.length}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </>
    )
  }

  const calculateEfficiency = (
    pieces: CabinetItem[],
    boardCount: number,
    boardSize: { width: number; length: number },
  ) => {
    const totalPieceArea = pieces.reduce((sum, piece) => sum + piece.length * piece.width, 0)
    const totalBoardArea = boardCount * boardSize.width * boardSize.length
    return ((totalPieceArea / totalBoardArea) * 100).toFixed(2)
  }

  const calculateTotalArea = (pieces: CabinetItem[]) => {
    return pieces.reduce((sum, piece) => sum + piece.length * piece.width, 0)
  }

  return (
    <div id="visualization" className="mt-4 container g-0">
      <h3>Board Visualization</h3>

      <div className="material-toggle" role="group">
        <button
          className={`modern-btn material-btn ${activeMaterial === "particle" ? "active" : ""}`}
          onClick={() => toggleMaterial("particle")}
        >
          <i className="bi bi-layers me-2"></i>Particle Board
        </button>
        <button
          className={`modern-btn material-btn ${activeMaterial === "mdf" ? "active" : ""}`}
          onClick={() => toggleMaterial("mdf")}
        >
          <i className="bi bi-grid me-2"></i>MDF Board
        </button>
        <button
          className={`modern-btn material-btn ${activeMaterial === "backply" ? "active" : ""}`}
          onClick={() => toggleMaterial("backply")}
        >
          <i className="bi bi-grid-3x3 me-2"></i>MDF Backply
        </button>
      </div>

      {renderBoardsForMaterial(activeMaterial)}
    </div>
  )
}

