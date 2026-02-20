import { AppSidebar } from "@/components/layout/AppSidebar";
import "@/components/layout/layout.css";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="dashboard-layout">
            <AppSidebar />
            <main className="dashboard-main">
                <div className="dashboard-main-inner">
                    {children}
                </div>
            </main>
        </div>
    );
}
