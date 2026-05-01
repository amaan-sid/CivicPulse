import { useState } from "react"
import DashboardLayout from "../../layouts/DashboardLayout"
import ResidentsSection from "./ManageSocietySections/ResidentsSection"
import SocietySection from "./ManageSocietySections/SocietySection"

function ManageSociety(){

  const [section, setSection] = useState<"society" | "residents">("society")

  return(

    <DashboardLayout>

      <div className="flex gap-6 mb-6 border-b pb-2">
        <button
          className={section === "society" ? "font-bold border-b-2" : ""}
          onClick={() => setSection("society")}
        >
          Society
        </button>

        <button
          className={section === "residents" ? "font-bold border-b-2" : ""}
          onClick={() => setSection("residents")}
        >
          Residents
        </button>
      </div>

      {section === "society" && <SocietySection />}
      {section === "residents" && <ResidentsSection />}

    </DashboardLayout>

  )

}

export default ManageSociety
