"use client"

import type { CabinetItem } from "@/lib/types"
import { calculateBoardRequirements } from "@/lib/board-calculator"

interface CuttingListSummaryProps {
  cuttingList: CabinetItem[]
}

export default function CuttingListSummary({ cuttingList }: CuttingListSummaryProps) {
  // Calculate statistics
  const stats = calculateBoardRequirements(cuttingList)

  return (
    <div className="row row-cols-1 row-cols-md-3 g-3 mx-0 my-0 w-100">
      <div className="col-12 col-md-4">
        <div
          className="card h-100 shadow-sm border-0 w-100"
          style={{ background: "linear-gradient(45deg, #4e54c8, #8f94fb)", borderRadius: "20px" }}
        >
          <div className="card-body">
            <h5 className="card-title text-white mb-4">
              <i className="bi bi-layers-fill me-2"></i>Boards Required
            </h5>
            <div className="text-white">
              <p className="card-text">18mm Particle Boards: {stats.particleBoards}</p>
              <p className="card-text">18mm MDF boards: {stats.mdfBoards}</p>
              <p className="card-text">3mm MDF ply: {stats.mdfBackply}</p>
            </div>
            <button
              className="visualize-btn"
              onClick={() => document.dispatchEvent(new CustomEvent("visualize-boards"))}
            >
              <i className="bi bi-grid-3x3-gap"></i>
              Visualize Cutting
            </button>
          </div>
        </div>
      </div>
      <div className="col-12 col-md-4">
        <div
          className="card h-100 shadow-sm border-0 w-100"
          style={{ background: "linear-gradient(45deg, #11998e, #38ef7d)", borderRadius: "20px" }}
        >
          <div className="card-body">
            <h5 className="card-title text-white mb-4">
              <i className="bi bi-rulers me-2"></i>Edging Length
            </h5>
            <div className="text-white">
              <p className="card-text">Particle Board: {(stats.particleBoardEdgingLength / 1000).toFixed(2)}M</p>
              <p className="card-text">MDF Board: {(stats.mdfBoardEdgingLength / 1000).toFixed(2)}M</p>
              <p className="card-text">
                Total: {((stats.particleBoardEdgingLength + stats.mdfBoardEdgingLength) / 1000).toFixed(2)}M
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="col-12 col-md-4">
        <div
          className="card h-100 shadow-sm border-0 w-100"
          style={{ background: "linear-gradient(45deg, #2193b0, #6dd5ed)", borderRadius: "20px" }}
        >
          <div className="card-body">
            <h5 className="card-title text-white mb-4">
              <i className="bi bi-slash-lg me-2"></i>Grooving Length
            </h5>
            <div className="text-white">
              <p className="card-text">Particle Board: {(stats.particleBoardGroovingLength / 1000).toFixed(2)}M</p>
              <p className="card-text">MDF Board: {(stats.mdfBoardGroovingLength / 1000).toFixed(2)}M</p>
              <p className="card-text">
                Total: {((stats.particleBoardGroovingLength + stats.mdfBoardGroovingLength) / 1000).toFixed(2)}M
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

