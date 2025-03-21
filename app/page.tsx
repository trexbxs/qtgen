import CabinetForms from "@/components/cabinet-forms"
import CuttingListResults from "@/components/cutting-list-results"

export default function Home() {
  return (
    <div className="container mt-3 g-1">
      <script dangerouslySetInnerHTML={{
        __html: `
          // Clear any previous data on page load
          localStorage.removeItem('cuttingList');
        `
      }} />
      <h1 className="mb-2">Full Kitchen Cutting List</h1>
      <CabinetForms />
      <CuttingListResults />
    </div>
  )
}

