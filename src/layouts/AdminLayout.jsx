import { useState } from "react";
import { X } from "lucide-react";
import { Outlet } from "react-router-dom";

import AdminSidebar from "../components/admin/AdminSidebar";
import AdminHeader from "../components/admin/AdminHeader";

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#F5FAF9]">
      <div className="flex min-h-screen">
        {/* Desktop Sidebar */}
        <aside className="hidden w-72 shrink-0 lg:block">
          <div className="sticky top-0 h-screen">
            <AdminSidebar />
          </div>
        </aside>

        {/* Mobile Sidebar */}
        {isSidebarOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            {/* Backdrop */}
            <button
              type="button"
              aria-label="Close sidebar"
              onClick={closeSidebar}
              className="absolute inset-0 bg-[#073F42]/40 backdrop-blur-sm"
            />

            {/* Drawer */}
            <div className="relative h-full w-72 max-w-[85vw] shadow-2xl">
              <AdminSidebar onClose={closeSidebar} />

              {/* Close Button */}
              <button
                type="button"
                onClick={closeSidebar}
                aria-label="Close sidebar"
                className="absolute right-3 top-4 flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 text-white transition hover:bg-white/20"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}

        {/* Main Area */}
        <div className="flex min-w-0 flex-1 flex-col">
          {/* Header */}
          <AdminHeader
            onMenuClick={() => setIsSidebarOpen(true)}
          />

          {/* Page Content */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8">
            <div className="mx-auto w-full max-w-[1600px]">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;