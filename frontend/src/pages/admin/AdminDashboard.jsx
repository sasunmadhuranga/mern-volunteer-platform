import AdminNavbar from "./AdminNavbar";
import { Outlet } from 'react-router-dom';

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-sky-100">
      <AdminNavbar/>  
      <div className="pt-10 px-4 md:px-8">
        <Outlet />  {/* Sub-page content goes here */}
      </div>
    </div>
  );
}
