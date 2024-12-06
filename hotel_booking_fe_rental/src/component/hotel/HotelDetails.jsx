import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getHotelById } from "../utils/ApiFunction"; // Giả sử bạn đã tạo sẵn hàm API này

const HotelDetails = () => {
  const { id } = useParams();
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHotel = async () => {
      try {
        const data = await getHotelById(id); // Gọi API lấy thông tin chi tiết khách sạn
        setHotel(data);
        setLoading(false);
      } catch (err) {
        setError("Error fetching hotel details.");
        setLoading(false);
      }
    };
    fetchHotel();
  }, [id]);

  if (loading) return <p>Loading hotel details...</p>;
  if (error) return <p>Error: {error}</p>;

  const getImageSrc = (photo) => {
    return photo ? `data:image/png;base64,${photo}` : "https://via.placeholder.com/150";
  };

  return (
    <div className="container mt-5">
      {hotel && (
        <div>
          {/* Main Hotel Info */}
          <div className="row mb-4">
            <div className="col-md-6">
              <h2 className="display-4">{hotel.name}</h2>
              <p className="lead text-muted">{hotel.description}</p>
            </div>
            <div className="col-md-6 text-center">
              <img
                src={getImageSrc(hotel.photo)}
                alt={hotel.name}
                className="img-fluid rounded shadow-lg"
                style={{ maxHeight: "400px", objectFit: "cover" }}
              />
            </div>
          </div>

          {/* Hotel Address and Contact */}
          <div className="row mb-4">
            <div className="col-md-6">
              <div className="card border-light shadow-sm">
                <div className="card-header">
                  <h4 className="card-title">Address</h4>
                </div>
                <div className="card-body">
                  <p>
                    {hotel.street}, {hotel.wardName}, {hotel.districtName}, {hotel.provinceName}
                  </p>
                </div>
              </div>
            </div>

            <div className="col-md-6">
              <div className="card border-light shadow-sm">
                <div className="card-header">
                  <h4 className="card-title">Contact</h4>
                </div>
                <div className="card-body">
                  <p><strong>Phone:</strong> {hotel.phoneNumber}</p>
                  <p><strong>Email:</strong> {hotel.email}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Hotel Status */}
          <div className="row mb-4">
            <div className="col-12">
              <div className="card border-light shadow-sm">
                <div className="card-header">
                  <h4 className="card-title">Status</h4>
                </div>
                <div className="card-body">
                  <p>{hotel.status}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Hotel Gallery (Additional Photos) */}
          <h4 className="my-4">Photos</h4>
          <div className="row">
            {hotel.photos && hotel.photos.map((photo, index) => (
              <div className="col-md-4 mb-4" key={index}>
                <div className="card shadow-sm">
                  <img
                    src={getImageSrc(photo)}
                    alt={`Hotel Photo ${index + 1}`}
                    className="card-img-top rounded"
                    style={{ maxHeight: "200px", objectFit: "cover" }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default HotelDetails;
