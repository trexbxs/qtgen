"use client"

import { useState } from "react"
import type { CabinetFormData } from "@/lib/types"

export default function CabinetForms() {
  const [cabinetCounters, setCabinetCounters] = useState({
    base: 0,
    cornerBase: 0,
    wall: 0,
    cornerWall: 0,
    tall: 0,
    endPanel: 0,
  })

  const [cabinets, setCabinets] = useState<{
    baseCabinets: CabinetFormData[]
    cornerBase: CabinetFormData[]
    wallCabinets: CabinetFormData[]
    cornerWall: CabinetFormData[]
    tallUnits: CabinetFormData[]
    endPanels: CabinetFormData[]
  }>({
    baseCabinets: [],
    cornerBase: [],
    wallCabinets: [],
    cornerWall: [],
    tallUnits: [],
    endPanels: [],
  })

  const addBaseCabinet = () => {
    const newCounter = cabinetCounters.base + 1
    setCabinetCounters((prev) => ({ ...prev, base: newCounter }))

    setCabinets((prev) => ({
      ...prev,
      baseCabinets: [
        {
          type: "doors",
          quantity: 1,
        },
        ...prev.baseCabinets,
      ],
    }))
  }

  const addCornerBase = () => {
    const newCounter = cabinetCounters.cornerBase + 1
    setCabinetCounters((prev) => ({ ...prev, cornerBase: newCounter }))

    setCabinets((prev) => ({
      ...prev,
      cornerBase: [
        {
          type: "corner",
          cornerBaseWidth: 1100,
          quantity: 1,
        },
        ...prev.cornerBase,
      ],
    }))
  }

  const addWallCabinet = () => {
    const newCounter = cabinetCounters.wall + 1
    setCabinetCounters((prev) => ({ ...prev, wall: newCounter }))

    setCabinets((prev) => ({
      ...prev,
      wallCabinets: [
        {
          type: "single",
          quantity: 1,
        },
        ...prev.wallCabinets,
      ],
    }))
  }

  const addCornerWall = () => {
    const newCounter = cabinetCounters.cornerWall + 1
    setCabinetCounters((prev) => ({ ...prev, cornerWall: newCounter }))

    setCabinets((prev) => ({
      ...prev,
      cornerWall: [
        {
          type: "corner",
          quantity: 1,
        },
        ...prev.cornerWall,
      ],
    }))
  }

  const addTallUnit = () => {
    const newCounter = cabinetCounters.tall + 1
    setCabinetCounters((prev) => ({ ...prev, tall: newCounter }))

    setCabinets((prev) => ({
      ...prev,
      tallUnits: [
        {
          type: "fridgeUnit",
          quantity: 1,
        },
        ...prev.tallUnits,
      ],
    }))
  }

  const addEndPanel = () => {
    const newCounter = cabinetCounters.endPanel + 1
    setCabinetCounters((prev) => ({ ...prev, endPanel: newCounter }))

    setCabinets((prev) => ({
      ...prev,
      endPanels: [
        {
          type: "lowLevel",
          quantity: 1,
        },
        ...prev.endPanels,
      ],
    }))
  }

  const updateCabinetValue = (
    containerType: keyof typeof cabinets,
    index: number,
    field: string,
    value: string | number,
  ) => {
    setCabinets((prev) => {
      const newCabinets = { ...prev }
      newCabinets[containerType] = [...prev[containerType]]
      newCabinets[containerType][index] = {
        ...newCabinets[containerType][index],
        [field]: value,
      }
      return newCabinets
    })
  }

  const incrementCabinet = (containerType: keyof typeof cabinets, index: number) => {
    setCabinets((prev) => {
      const newCabinets = { ...prev }
      newCabinets[containerType] = [...prev[containerType]]
      const currentQuantity = newCabinets[containerType][index].quantity || 1
      newCabinets[containerType][index] = {
        ...newCabinets[containerType][index],
        quantity: currentQuantity + 1,
      }
      return newCabinets
    })
  }

  const decrementCabinet = (containerType: keyof typeof cabinets, index: number) => {
    setCabinets((prev) => {
      const newCabinets = { ...prev }
      newCabinets[containerType] = [...prev[containerType]]
      const currentQuantity = newCabinets[containerType][index].quantity || 1
      if (currentQuantity > 1) {
        newCabinets[containerType][index] = {
          ...newCabinets[containerType][index],
          quantity: currentQuantity - 1,
        }
      }
      return newCabinets
    })
  }

  const deleteCabinet = (containerType: keyof typeof cabinets, index: number) => {
    setCabinets((prev) => {
      const newCabinets = { ...prev }
      newCabinets[containerType] = prev[containerType].filter((_, i) => i !== index)
      return newCabinets
    })

    // Update cabinet counters
    updateCabinetNumbers(containerType)
  }

  const updateCabinetNumbers = (containerType: keyof typeof cabinets) => {
    setCabinetCounters((prev) => ({
      ...prev,
      [containerType.replace("Cabinets", "").toLowerCase()]: cabinets[containerType].length,
    }))
  }

  const toggleDrawerOptions = (containerType: keyof typeof cabinets, index: number, value: string) => {
    updateCabinetValue(containerType, index, "type", value)
  }

  const toggleEndPanelOptions = (containerType: keyof typeof cabinets, index: number, value: string) => {
    updateCabinetValue(containerType, index, "endPanelType", value)
  }

  const toggleTallUnitOptions = (containerType: keyof typeof cabinets, index: number, value: string) => {
    updateCabinetValue(containerType, index, "tallUnitType", value)
  }

  const generateAndScrollToCuttingList = async () => {
    try {
      // Check if there are any cabinets to process
      const hasCabinets = 
        cabinets.baseCabinets.length > 0 || 
        cabinets.cornerBase.length > 0 || 
        cabinets.wallCabinets.length > 0 || 
        cabinets.cornerWall.length > 0 || 
        cabinets.tallUnits.length > 0 || 
        cabinets.endPanels.length > 0
      
      if (!hasCabinets) {
        alert("Please add at least one cabinet before generating cutting list.")
        return
      }
      
      // Send data to server API route
      const response = await fetch("/api/generate-cutting-list", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ cabinets }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate cutting list")
      }

      const data = await response.json()
      console.log("Received cutting list data:", data.cuttingList)

      // Store cutting list in localStorage for other components to access
      localStorage.setItem("cuttingList", JSON.stringify(data.cuttingList))
      
      // Explicitly trigger a custom event for components to listen to
      if (typeof window !== 'undefined') {
        console.log("Dispatching cuttingListUpdated event")
        window.dispatchEvent(new CustomEvent("cuttingListUpdated"))
      }

      // Show results section
      const resultsElement = document.getElementById("results")
      if (resultsElement) {
        resultsElement.style.display = "block"
        resultsElement.scrollIntoView({ behavior: "smooth", block: "start" })
      }
    } catch (error) {
      console.error("Error generating cutting list:", error)
      alert("Failed to generate cutting list. Please try again.")
    }
  }

  return (
    <>
      <div className="row g-2 ms-1" id="cabinetForms">
        <div className="col-md-2 g-1">
          <h4>Base Cabinets</h4>
          <button className="btn btn-primary mb-3" onClick={addBaseCabinet}>
            Add Base Cabinet
          </button>
          <div id="baseCabinets" className="cabinet-container">
            {cabinets.baseCabinets.map((cabinet, index) => (
              <div key={`base-${index}`} className="cabinet-form" data-quantity={cabinet.quantity || 1}>
                <h5>Base Cabinet {cabinets.baseCabinets.length - index}</h5>
                <div className="form-content">
                  <div className="mb-2">
                    <label className="form-label">Width (mm)</label>
                    <input
                      type="number"
                      className="form-control"
                      name="baseWidth"
                      value={cabinet.width || ""}
                      onChange={(e) =>
                        updateCabinetValue("baseCabinets", index, "width", Number.parseInt(e.target.value))
                      }
                    />
                  </div>
                  <div className="mb-2">
                    <label className="form-label">Type</label>
                    <select
                      className="form-select"
                      name="baseType"
                      value={cabinet.type || "doors"}
                      onChange={(e) => toggleDrawerOptions("baseCabinets", index, e.target.value)}
                    >
                      <option value="doors">Doors</option>
                      <option value="drawers">Drawers</option>
                      <option value="open">Open</option>
                    </select>
                  </div>
                  {cabinet.type === "doors" && (
                    <div className="mb-2 door-options">
                      <label className="form-label">Configuration</label>
                      <select
                        className="form-select"
                        name="doorConfig"
                        value={cabinet.doorConfig || "single"}
                        onChange={(e) => updateCabinetValue("baseCabinets", index, "doorConfig", e.target.value)}
                      >
                        <option value="single">Single</option>
                        <option value="double">Double</option>
                      </select>
                    </div>
                  )}
                  {cabinet.type === "drawers" && (
                    <div className="mb-3 drawer-options">
                      <label className="form-label">No of Drawers</label>
                      <select
                        className="form-select"
                        name="drawerCount"
                        value={cabinet.drawerCount || 2}
                        onChange={(e) =>
                          updateCabinetValue("baseCabinets", index, "drawerCount", Number.parseInt(e.target.value))
                        }
                      />
                    </div>
                  )}
                </div>
                <div className="button-group">
                  <button className="delete-btn" onClick={() => deleteCabinet("baseCabinets", index)}>
                    <i className="bi bi-trash"></i>
                  </button>
                  <button
                    className="minus-btn"
                    onClick={() => decrementCabinet("baseCabinets", index)}
                    title="Remove one duplicate"
                  >
                    <i className="bi bi-dash"></i>
                  </button>
                  <button
                    className="plus-btn"
                    onClick={() => incrementCabinet("baseCabinets", index)}
                    title="Add one duplicate"
                  >
                    <i className="bi bi-plus"></i>
                  </button>
                  <div className="quantity-indicator">x{cabinet.quantity || 1}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="col-md-2 g-1">
          <h4>Corner Base</h4>
          <button className="btn btn-primary mb-3" onClick={addCornerBase}>
            Add Corner Base
          </button>
          <div id="cornerBase" className="cabinet-container">
            {cabinets.cornerBase.map((cabinet, index) => (
              <div key={`corner-base-${index}`} className="cabinet-form" data-quantity={cabinet.quantity || 1}>
                <h5>Corner Base {cabinets.cornerBase.length - index}</h5>
                <div className="form-content">
                  <div className="mb-2">
                    <label className="form-label">Width (mm)</label>
                    <select
                      className="form-select"
                      name="cornerBaseWidth"
                      value={cabinet.cornerBaseWidth || 1100}
                      onChange={(e) =>
                        updateCabinetValue("cornerBase", index, "cornerBaseWidth", Number.parseInt(e.target.value))
                      }
                    >
                      <option value="1100">1100mm</option>
                      <option value="1050">1050mm</option>
                      <option value="1000">1000mm</option>
                    </select>
                  </div>
                </div>
                <div className="button-group">
                  <button className="delete-btn" onClick={() => deleteCabinet("cornerBase", index)}>
                    <i className="bi bi-trash"></i>
                  </button>
                  <button
                    className="minus-btn"
                    onClick={() => decrementCabinet("cornerBase", index)}
                    title="Remove one duplicate"
                  >
                    <i className="bi bi-dash"></i>
                  </button>
                  <button
                    className="plus-btn"
                    onClick={() => incrementCabinet("cornerBase", index)}
                    title="Add one duplicate"
                  >
                    <i className="bi bi-plus"></i>
                  </button>
                  <div className="quantity-indicator">x{cabinet.quantity || 1}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="col-md-2 g-1">
          <h4>Wall Cabinets</h4>
          <button className="btn btn-primary mb-3 wall-cabinet-btn" onClick={addWallCabinet}>
            Add Wall Cabinet
          </button>
          <div id="wallCabinets" className="cabinet-container">
            {cabinets.wallCabinets.map((cabinet, index) => (
              <div key={`wall-${index}`} className="cabinet-form" data-quantity={cabinet.quantity || 1}>
                <h5>Wall Cabinet {cabinets.wallCabinets.length - index}</h5>
                <div className="form-content">
                  <div className="mb-2">
                    <label className="form-label">Width (mm)</label>
                    <input
                      type="number"
                      className="form-control"
                      name="wallWidth"
                      value={cabinet.width || ""}
                      onChange={(e) =>
                        updateCabinetValue("wallCabinets", index, "width", Number.parseInt(e.target.value))
                      }
                    />
                  </div>
                  <div className="mb-2">
                    <label className="form-label">Height (mm)</label>
                    <input
                      type="number"
                      className="form-control"
                      name="wallHeight"
                      value={cabinet.height || ""}
                      onChange={(e) =>
                        updateCabinetValue("wallCabinets", index, "height", Number.parseInt(e.target.value))
                      }
                    />
                  </div>
                  <div className="mb-2">
                    <label className="form-label">Type</label>
                    <select
                      className="form-select"
                      name="wallType"
                      value={cabinet.wallType || "single"}
                      onChange={(e) => updateCabinetValue("wallCabinets", index, "wallType", e.target.value)}
                    >
                      <option value="single">Single Door</option>
                      <option value="double">Double Doors</option>
                      <option value="gaslift">Gas Lift</option>
                      <option value="bifold">Bifold</option>
                      <option value="open">Open</option>
                    </select>
                  </div>
                </div>
                <div className="button-group">
                  <button className="delete-btn" onClick={() => deleteCabinet("wallCabinets", index)}>
                    <i className="bi bi-trash"></i>
                  </button>
                  <button
                    className="minus-btn"
                    onClick={() => decrementCabinet("wallCabinets", index)}
                    title="Remove one duplicate"
                  >
                    <i className="bi bi-dash"></i>
                  </button>
                  <button
                    className="plus-btn"
                    onClick={() => incrementCabinet("wallCabinets", index)}
                    title="Add one duplicate"
                  >
                    <i className="bi bi-plus"></i>
                  </button>
                  <div className="quantity-indicator">x{cabinet.quantity || 1}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="col-md-2 g-1">
          <h4>Corner Wall</h4>
          <button className="btn btn-primary mb-3" onClick={addCornerWall}>
            Add Corner Wall
          </button>
          <div id="cornerWall" className="cabinet-container">
            {cabinets.cornerWall.map((cabinet, index) => (
              <div key={`corner-wall-${index}`} className="cabinet-form" data-quantity={cabinet.quantity || 1}>
                <h5>Corner Wall {cabinets.cornerWall.length - index}</h5>
                <div className="form-content">
                  <div className="mb-2">
                    <label className="form-label">Width (mm)</label>
                    <input
                      type="number"
                      className="form-control"
                      name="cornerWallWidth"
                      value={cabinet.cornerWallWidth || ""}
                      onChange={(e) =>
                        updateCabinetValue("cornerWall", index, "cornerWallWidth", Number.parseInt(e.target.value))
                      }
                    />
                  </div>
                  <div className="mb-2">
                    <label className="form-label">Height (mm)</label>
                    <input
                      type="number"
                      className="form-control"
                      name="cornerWallHeight"
                      value={cabinet.cornerWallHeight || ""}
                      onChange={(e) =>
                        updateCabinetValue("cornerWall", index, "cornerWallHeight", Number.parseInt(e.target.value))
                      }
                    />
                  </div>
                </div>
                <div className="button-group">
                  <button className="delete-btn" onClick={() => deleteCabinet("cornerWall", index)}>
                    <i className="bi bi-trash"></i>
                  </button>
                  <button
                    className="minus-btn"
                    onClick={() => decrementCabinet("cornerWall", index)}
                    title="Remove one duplicate"
                  >
                    <i className="bi bi-dash"></i>
                  </button>
                  <button
                    className="plus-btn"
                    onClick={() => incrementCabinet("cornerWall", index)}
                    title="Add one duplicate"
                  >
                    <i className="bi bi-plus"></i>
                  </button>
                  <div className="quantity-indicator">x{cabinet.quantity || 1}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="col-md-2 g-1">
          <h4>Tall Units</h4>
          <button className="btn btn-primary mb-3" onClick={addTallUnit}>
            Add Tall Unit
          </button>
          <div id="tallUnits" className="cabinet-container">
            {cabinets.tallUnits.map((cabinet, index) => (
              <div key={`tall-${index}`} className="cabinet-form" data-quantity={cabinet.quantity || 1}>
                <h5>Tall Unit {cabinets.tallUnits.length - index}</h5>
                <div className="form-content">
                  <div className="mb-2">
                    <label className="form-label">Type</label>
                    <select
                      className="form-select"
                      name="tallUnitType"
                      value={cabinet.tallUnitType || "fridgeUnit"}
                      onChange={(e) => toggleTallUnitOptions("tallUnits", index, e.target.value)}
                    >
                      <option value="fridgeUnit">Fridge Unit</option>
                      <option value="ovenMicrowave">Oven/Microwave</option>
                      <option value="glassUnit">Glass Unit</option>
                      <option value="pullout">Pullout</option>
                    </select>
                  </div>

                  {(cabinet.tallUnitType === "fridgeUnit" || !cabinet.tallUnitType) && (
                    <div id="fridgeUnitOptions">
                      <div className="mb-2">
                        <label className="form-label">Panel Height (mm)</label>
                        <input
                          type="number"
                          className="form-control"
                          name="fridgeUnitPanelHeight"
                          value={cabinet.fridgeUnitPanelHeight || ""}
                          onChange={(e) =>
                            updateCabinetValue(
                              "tallUnits",
                              index,
                              "fridgeUnitPanelHeight",
                              Number.parseInt(e.target.value),
                            )
                          }
                        />
                      </div>
                      <div className="mb-2">
                        <label className="form-label">Panel Depth</label>
                        <select
                          className="form-select"
                          name="fridgeUnitPanelDepth"
                          value={cabinet.fridgeUnitPanelDepth || 600}
                          onChange={(e) =>
                            updateCabinetValue(
                              "tallUnits",
                              index,
                              "fridgeUnitPanelDepth",
                              Number.parseInt(e.target.value),
                            )
                          }
                        >
                          <option value="600">600mm</option>
                          <option value="650">650mm</option>
                        </select>
                      </div>
                      <div className="mb-2">
                        <label className="form-label">Top Box Height (mm)</label>
                        <input
                          type="number"
                          className="form-control"
                          name="fridgeUnitTopBoxHeight"
                          value={cabinet.fridgeUnitTopBoxHeight || ""}
                          onChange={(e) =>
                            updateCabinetValue(
                              "tallUnits",
                              index,
                              "fridgeUnitTopBoxHeight",
                              Number.parseInt(e.target.value),
                            )
                          }
                        />
                      </div>
                      <div className="mb-2">
                        <label className="form-label">Top Box Door Type</label>
                        <select
                          className="form-select"
                          name="fridgeUnitTopBoxDoorType"
                          value={cabinet.fridgeUnitTopBoxDoorType || "flip"}
                          onChange={(e) =>
                            updateCabinetValue("tallUnits", index, "fridgeUnitTopBoxDoorType", e.target.value)
                          }
                        >
                          <option value="flip">Flip</option>
                          <option value="double">Double</option>
                        </select>
                      </div>
                      <div className="mb-2">
                        <label className="form-label">Fridge Box Width (mm)</label>
                        <input
                          type="number"
                          className="form-control"
                          name="fridgeUnitBoxWidth"
                          value={cabinet.fridgeUnitBoxWidth || ""}
                          onChange={(e) =>
                            updateCabinetValue(
                              "tallUnits",
                              index,
                              "fridgeUnitBoxWidth",
                              Number.parseInt(e.target.value),
                            )
                          }
                        />
                      </div>
                    </div>
                  )}

                  {cabinet.tallUnitType === "ovenMicrowave" && (
                    <div id="ovenMicrowaveOptions">
                      <div className="mb-2">
                        <label className="form-label">Configuration</label>
                        <select
                          className="form-select"
                          name="ovenMicrowaveConfig"
                          value={cabinet.ovenMicrowaveConfig || "oven"}
                          onChange={(e) =>
                            updateCabinetValue("tallUnits", index, "ovenMicrowaveConfig", e.target.value)
                          }
                        >
                          <option value="oven">Oven</option>
                          <option value="microwave">Microwave</option>
                          <option value="micrOven">Micr&Oven</option>
                        </select>
                      </div>
                      <div className="mb-2">
                        <label className="form-label">No of Drawers</label>
                        <select
                          className="form-select"
                          name="ovenMicrowaveDrawers"
                          value={cabinet.ovenMicrowaveDrawers || 2}
                          onChange={(e) =>
                            updateCabinetValue(
                              "tallUnits",
                              index,
                              "ovenMicrowaveDrawers",
                              Number.parseInt(e.target.value),
                            )
                          }
                        >
                          <option value="2">2</option>
                          <option value="3">3</option>
                        </select>
                      </div>
                      <div className="mb-2">
                        <label className="form-label">Total Height (mm)</label>
                        <input
                          type="number"
                          className="form-control"
                          name="ovenMicrowaveHeight"
                          value={cabinet.ovenMicrowaveHeight || ""}
                          onChange={(e) =>
                            updateCabinetValue(
                              "tallUnits",
                              index,
                              "ovenMicrowaveHeight",
                              Number.parseInt(e.target.value),
                            )
                          }
                        />
                      </div>
                      <div className="mb-2">
                        <label className="form-label">Depth</label>
                        <select
                          className="form-select"
                          name="ovenMicrowaveDepth"
                          value={cabinet.ovenMicrowaveDepth || 600}
                          onChange={(e) =>
                            updateCabinetValue(
                              "tallUnits",
                              index,
                              "ovenMicrowaveDepth",
                              Number.parseInt(e.target.value),
                            )
                          }
                        >
                          <option value="600">600mm</option>
                          <option value="650">650mm</option>
                        </select>
                      </div>
                      <div className="mb-2">
                        <label className="form-label">+ Shelf</label>
                        <select
                          className="form-select"
                          name="ovenMicrowaveShelf"
                          value={cabinet.ovenMicrowaveShelf || 1}
                          onChange={(e) =>
                            updateCabinetValue(
                              "tallUnits",
                              index,
                              "ovenMicrowaveShelf",
                              Number.parseInt(e.target.value),
                            )
                          }
                        >
                          <option value="1">1</option>
                          <option value="2">2</option>
                          <option value="3">3</option>
                        </select>
                      </div>
                      <div className="mb-2">
                        <label className="form-label">+ Doors Height (mm)</label>
                        <input
                          type="number"
                          className="form-control"
                          name="ovenMicrowaveDoorsHeight"
                          value={cabinet.ovenMicrowaveDoorsHeight || ""}
                          onChange={(e) =>
                            updateCabinetValue(
                              "tallUnits",
                              index,
                              "ovenMicrowaveDoorsHeight",
                              Number.parseInt(e.target.value),
                            )
                          }
                        />
                      </div>
                    </div>
                  )}

                  {cabinet.tallUnitType === "glassUnit" && (
                    <div id="glassUnitOptions">
                      <div className="mb-2">
                        <label className="form-label">Width (mm)</label>
                        <input
                          type="number"
                          className="form-control"
                          name="glassUnitWidth"
                          value={cabinet.glassUnitWidth || ""}
                          onChange={(e) =>
                            updateCabinetValue("tallUnits", index, "glassUnitWidth", Number.parseInt(e.target.value))
                          }
                        />
                      </div>
                      <div className="mb-2">
                        <label className="form-label">Height (mm)</label>
                        <input
                          type="number"
                          className="form-control"
                          name="glassUnitHeight"
                          value={cabinet.glassUnitHeight || ""}
                          onChange={(e) =>
                            updateCabinetValue("tallUnits", index, "glassUnitHeight", Number.parseInt(e.target.value))
                          }
                        />
                      </div>
                      <div className="mb-2">
                        <label className="form-label">No of Shelves</label>
                        <input
                          type="number"
                          className="form-control"
                          name="glassUnitShelves"
                          min="1"
                          value={cabinet.glassUnitShelves || ""}
                          onChange={(e) =>
                            updateCabinetValue("tallUnits", index, "glassUnitShelves", Number.parseInt(e.target.value))
                          }
                        />
                      </div>
                      <div className="mb-2">
                        <label className="form-label">Depth</label>
                        <select
                          className="form-select"
                          name="glassUnitDepth"
                          value={cabinet.glassUnitDepth || 600}
                          onChange={(e) =>
                            updateCabinetValue("tallUnits", index, "glassUnitDepth", Number.parseInt(e.target.value))
                          }
                        >
                          <option value="600">600mm</option>
                          <option value="650">650mm</option>
                        </select>
                      </div>
                      <div className="mb-2">
                        <label className="form-label">Door Type</label>
                        <select
                          className="form-select"
                          name="glassUnitDoorType"
                          value={cabinet.glassUnitDoorType || "metalGlass"}
                          onChange={(e) => updateCabinetValue("tallUnits", index, "glassUnitDoorType", e.target.value)}
                        >
                          <option value="metalGlass">Metal & Glass</option>
                          <option value="mdfGlass">MDF & Glass</option>
                          <option value="plainMdf">Plain MDF</option>
                        </select>
                      </div>
                    </div>
                  )}

                  {cabinet.tallUnitType === "pullout" && (
                    <div id="pulloutOptions">
                      <div className="mb-2">
                        <label className="form-label">Width</label>
                        <select
                          className="form-select"
                          name="pulloutWidth"
                          value={cabinet.pulloutWidth || 600}
                          onChange={(e) =>
                            updateCabinetValue("tallUnits", index, "pulloutWidth", Number.parseInt(e.target.value))
                          }
                        >
                          <option value="600">600mm</option>
                          <option value="450">450mm</option>
                        </select>
                      </div>
                      <div className="mb-2">
                        <label className="form-label">Height (mm)</label>
                        <input
                          type="number"
                          className="form-control"
                          name="pulloutHeight"
                          value={cabinet.pulloutHeight || ""}
                          onChange={(e) =>
                            updateCabinetValue("tallUnits", index, "pulloutHeight", Number.parseInt(e.target.value))
                          }
                        />
                      </div>
                      <div className="mb-2">
                        <label className="form-label">Depth</label>
                        <select
                          className="form-select"
                          name="pulloutDepth"
                          value={cabinet.pulloutDepth || 600}
                          onChange={(e) =>
                            updateCabinetValue("tallUnits", index, "pulloutDepth", Number.parseInt(e.target.value))
                          }
                        >
                          <option value="600">600mm</option>
                          <option value="650">650mm</option>
                        </select>
                      </div>
                    </div>
                  )}
                </div>
                <div className="button-group">
                  <button className="delete-btn" onClick={() => deleteCabinet("tallUnits", index)}>
                    <i className="bi bi-trash"></i>
                  </button>
                  <button
                    className="minus-btn"
                    onClick={() => decrementCabinet("tallUnits", index)}
                    title="Remove one duplicate"
                  >
                    <i className="bi bi-dash"></i>
                  </button>
                  <button
                    className="plus-btn"
                    onClick={() => incrementCabinet("tallUnits", index)}
                    title="Add one duplicate"
                  >
                    <i className="bi bi-plus"></i>
                  </button>
                  <div className="quantity-indicator">x{cabinet.quantity || 1}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="col-md-2 g-1">
          <h4>End Panels</h4>
          <button className="btn btn-primary mb-3" onClick={addEndPanel}>
            Add End Panel
          </button>
          <div id="endPanels" className="cabinet-container">
            {cabinets.endPanels.map((panel, index) => (
              <div key={`end-panel-${index}`} className="cabinet-form" data-quantity={panel.quantity || 1}>
                <h5>End Panel {cabinets.endPanels.length - index}</h5>
                <div className="form-content">
                  <div className="mb-2">
                    <label className="form-label">Type</label>
                    <select
                      className="form-select"
                      name="endPanelType"
                      value={panel.endPanelType || "lowLevel"}
                      onChange={(e) => toggleEndPanelOptions("endPanels", index, e.target.value)}
                    >
                      <option value="lowLevel">Low Level</option>
                      <option value="highLevel">High Level</option>
                      <option value="tallUnits">Tall Units</option>
                      <option value="custom">Custom</option>
                    </select>
                  </div>
                  {(panel.endPanelType === "highLevel" ||
                    panel.endPanelType === "tallUnits" ||
                    panel.endPanelType === "custom") && (
                    <div className="mb-3 highLevel-option">
                      <label className="form-label">Panel Height (mm)</label>
                      <input
                        type="number"
                        className="form-control"
                        name="endPanelHeight"
                        value={panel.endPanelHeight || ""}
                        onChange={(e) =>
                          updateCabinetValue("endPanels", index, "endPanelHeight", Number.parseInt(e.target.value))
                        }
                      />
                    </div>
                  )}
                  {panel.endPanelType === "tallUnits" && (
                    <div className="mb-3 tallUnits-option">
                      <label className="form-label">Panel Depth</label>
                      <select
                        className="form-select"
                        name="endPanelDepth"
                        value={panel.endPanelDepth || "600"}
                        onChange={(e) => updateCabinetValue("endPanels", index, "endPanelDepth", e.target.value)}
                      >
                        <option value="600">600mm</option>
                        <option value="650">650mm</option>
                      </select>
                    </div>
                  )}
                  {panel.endPanelType === "custom" && (
                    <div className="mb-3 custom-option">
                      <label className="form-label">Panel Width (mm)</label>
                      <input
                        type="number"
                        className="form-control"
                        name="endPanelWidth"
                        value={panel.endPanelWidth || ""}
                        onChange={(e) =>
                          updateCabinetValue("endPanels", index, "endPanelWidth", Number.parseInt(e.target.value))
                        }
                      />
                    </div>
                  )}
                </div>
                <div className="button-group">
                  <button className="delete-btn" onClick={() => deleteCabinet("endPanels", index)}>
                    <i className="bi bi-trash"></i>
                  </button>
                  <button
                    className="minus-btn"
                    onClick={() => decrementCabinet("endPanels", index)}
                    title="Remove one duplicate"
                  >
                    <i className="bi bi-dash"></i>
                  </button>
                  <button
                    className="plus-btn"
                    onClick={() => incrementCabinet("endPanels", index)}
                    title="Add one duplicate"
                  >
                    <i className="bi bi-plus"></i>
                  </button>
                  <div className="quantity-indicator">x{panel.quantity || 1}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <button className="modern-btn success mt-4 mb-2" onClick={generateAndScrollToCuttingList}>
        <i className="bi bi-list-check me-2"></i>
        Generate Cutting List
      </button>
    </>
  )
}

