import React from "react";
import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="sidebar">
      <h5>Admin Tasks</h5>
      <ul className="list-unstyled">
        <li>
          <Link to="/existing-rooms">Manage Rooms</Link>
        </li>
        <li>
          <Link to="/existing-bookings">Manage Bookings</Link>
        </li>
        <li>
          <Link to="/existing-users">Manage Users</Link>
        </li>
        <li>
          <Link to="/register-hotel">Register new hotel</Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
