import Navbar from "../components/Navbar"
import Sidebar from "../components/Sidebar"
import SocietySwitcher from "../components/SocietySwitcher"

function DashboardLayout({ children }: { children: React.ReactNode }) {

  return (
    <div className="flex">

      <Sidebar />

      <div className="flex-1">

        <Navbar />

        <div className="p-6 bg-gray-100 min-h-screen">
          <SocietySwitcher />
          {children}
        </div>

      </div>

    </div>
  )
}

export default DashboardLayout