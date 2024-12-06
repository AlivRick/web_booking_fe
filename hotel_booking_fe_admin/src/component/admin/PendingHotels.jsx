import React, { useEffect, useState } from "react";
import { approveHotel, rejectHotel, getPendingHotels } from "../utils/ApiFunction";

const PendingHotels = () => {
  const [hotels, setHotels] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPendingHotels = async () => {
      try {
        const response = await getPendingHotels();
        setHotels(response);
      } catch (error) {
        setError("Failed to fetch pending hotels");
      }
    };

    fetchPendingHotels();
  }, []);

  const handleApprove = async (hotelId) => {
    try {
      await approveHotel(hotelId);
      setMessage("Hotel approved successfully!");
      setHotels(hotels.filter((hotel) => hotel.id !== hotelId)); // Remove from the list
    } catch (error) {
      setError("Failed to approve hotel");
    }
  };

  const handleReject = async (hotelId) => {
    try {
      await rejectHotel(hotelId);
      setMessage("Hotel rejected successfully!");
      setHotels(hotels.filter((hotel) => hotel.id !== hotelId)); // Remove from the list
    } catch (error) {
      setError("Failed to reject hotel");
    }
  };

  const formatAddress = (hotel) => {
    const wardName = hotel.ward?.name || "N/A";
    const districtName = hotel.ward?.district?.name || "N/A";
    const provinceName = hotel.ward?.district?.province?.name || "N/A";

    return `${hotel.street || "N/A"}, ${wardName}, ${districtName}, ${provinceName}`;
  };

  return (
    <div className="container mt-5">
      <h2>Pending Hotels for Approval</h2>
      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-danger">{error}</div>}
      <table className="table mt-3">
        <thead>
          <tr>
            <th>Name</th>
            <th>Address</th>
            <th>Description</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {hotels.length > 0 ? (
            hotels.map((hotel) => (
              <tr key={hotel.id}>
                <td>{hotel.name}</td>
                <td>{formatAddress(hotel)}</td>
                <td>{hotel.description || "No description available"}</td>
                <td>{hotel.status}</td>
                <td>
                  <button
                    className="btn btn-success"
                    onClick={() => handleApprove(hotel.id)}
                  >
                    Approve
                  </button>
                  <button
                    className="btn btn-danger ms-2"
                    onClick={() => handleReject(hotel.id)}
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">No pending hotels available</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default PendingHotels;
