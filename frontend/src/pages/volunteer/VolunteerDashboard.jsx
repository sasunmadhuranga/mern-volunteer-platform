import VolunteerNavbar from "./VolunteerNavbar";
import { Outlet } from 'react-router-dom';

export default function VolunteerDashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      <VolunteerNavbar/>  
      <div className="px-4 md:px-8">
        <Outlet />  
      </div>
    </div>
  );
}
