import Navbar from "@/components/layout/Navbar"
import Sidebar from "@/components/layout/Sidebar"

function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-900 font-sans transition-colors">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar />
        <div className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-6xl mx-auto animate-in fade-in duration-500">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardLayout