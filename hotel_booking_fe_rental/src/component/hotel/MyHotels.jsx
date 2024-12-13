import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom"; // Import Link from react-router-dom
import { getMyHotels } from "../utils/ApiFunction"; // Giả sử bạn đã tạo sẵn hàm API này

const MyHotels = () => {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  
  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const data = await getMyHotels(); // Gọi API lấy danh sách khách sạn
        setHotels(data);
        setLoading(false);
      } catch (err) {
        if (err.response && err.response.status === 403) {
          setError("You do not have permission to view this page. Please check your role.");
        } else {
          setError("An error occurred while fetching your hotels.");
        }
        setLoading(false);
      }
    };
    fetchHotels();
  }, []);

  if (loading) return <p>Loading your hotels...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="container mt-4">
      <h2>Your Registered Hotels</h2>
      {hotels.length === 0 ? (
        <p>You have not registered any hotels yet.</p>
      ) : (
        <div className="row">
          {hotels.map((hotel) => (
            <div className="col-md-4 mb-4" key={hotel.id}>
              <div className="card h-100">
                {/* Dùng ảnh mặc định nếu không có ảnh khách sạn */}
                <img
                  src={`data:image/png;base64,${hotel.photo}` || "https://via.placeholder.com/150"}
                  className="card-img-top"
                  alt={hotel.name}
                />
                <div className="card-body">
                  <h5 className="card-title">{hotel.name}</h5>
                  <p className="card-text">
                    {hotel.description || "No description available."}
                  </p>
                  <p>
                    <strong>Address:</strong>{" "}
                    {hotel.street}, {hotel.wardName || "N/A"} -{" "}
                    {hotel.districtName || "N/A"} -{" "}
                    {hotel.provinceName || "N/A"}
                  </p>
                  <p>
                    <strong>Contact:</strong> {hotel.phoneNumber || "N/A"}
                  </p>
                  <p>
                    <strong>Status:</strong> {hotel.status || "N/A"}
                  </p>
                  <p>
                    <strong>Email:</strong> {hotel.email || "N/A"}
                  </p>
                  <div className="d-flex justify-content-between">
                    {/* View Details Button */}
                    <Link to={`/hotel/${hotel.id}`} className="btn btn-primary">
                      View Details
                    </Link>
                    {/* Update Button */}
                    <Link to={`/hotel/${hotel.id}/update`} className="btn btn-warning">
                      Update
                    </Link>
                    <Link to={`/hotel/${hotel.id}/rooms`} className="btn btn-warning">
                      Room
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyHotels;
