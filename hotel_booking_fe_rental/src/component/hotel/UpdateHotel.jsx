import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getHotelById,
  updateHotel,
  getProvinces,
  getDistrictsByProvince,
  getWardsByDistrict,
} from "../utils/ApiFunction";

const UpdateHotel = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [hotel, setHotel] = useState({
    name: "",
    phoneNumber: "",
    email: "",
    description: "",
    street: "",
    provinceId: "",
    districtId: "",
    wardId: "",
    coverPhoto: null,
    coverPhotoBase64: null,
    newPhotos: [],
    photosBase64: [],
  });

  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getHotelById(id);
        setHotel((prev) => ({
          ...prev,
          name: data.name,
          phoneNumber: data.phoneNumber,
          email: data.email,
          description: data.description,
          street: data.street,
          provinceId: data.provinceId || "",
          districtId: data.districtId || "",
          wardId: data.wardId || "",
          coverPhotoBase64: data.photo ? `data:image/png;base64,${data.photo}` : null,
          photosBase64: data.photos ? data.photos.map((photo) => `data:image/png;base64,${photo}`) : [],
        }));

        const provincesData = await getProvinces();
        setProvinces(provincesData);

        if (data.provinceId) {
          const districtsData = await getDistrictsByProvince(data.provinceId);
          setDistricts(districtsData);
        }

        if (data.districtId) {
          const wardsData = await getWardsByDistrict(data.districtId);
          setWards(wardsData);
        }

        setLoading(false);
      } catch (err) {
        setError("Failed to fetch data.");
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleProvinceChange = async (e) => {
    const provinceId = e.target.value;
    setHotel((prev) => ({ ...prev, provinceId, districtId: "", wardId: "" }));
    setDistricts([]);
    setWards([]);

    if (provinceId) {
      try {
        const districtsData = await getDistrictsByProvince(provinceId);
        setDistricts(districtsData);
      } catch (err) {
        console.error("Error fetching districts:", err);
      }
    }
  };

  const handleDistrictChange = async (e) => {
    const districtId = e.target.value;
    setHotel((prev) => ({ ...prev, districtId, wardId: "" }));
    setWards([]);

    if (districtId) {
      try {
        const wardsData = await getWardsByDistrict(districtId);
        setWards(wardsData);
      } catch (err) {
        console.error("Error fetching wards:", err);
      }
    }
  };

  const handleWardChange = (e) => {
    const wardId = e.target.value;
    setHotel((prev) => ({ ...prev, wardId }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setHotel((prev) => ({ ...prev, [name]: value }));
  };

  const handleCoverPhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setHotel((prev) => ({
          ...prev,
          coverPhoto: file,
          coverPhotoBase64: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteCoverPhoto = () => {
    setHotel((prev) => ({
      ...prev,
      coverPhoto: null,
      coverPhotoBase64: null,
    }));
  };

  const handlePhotosChange = (e) => {
    const files = Array.from(e.target.files);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        setHotel((prev) => ({
          ...prev,
          newPhotos: [...prev.newPhotos, file],
          photosBase64: [...prev.photosBase64, reader.result],
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDeletePhoto = (index) => {
    setHotel((prev) => ({
      ...prev,
      photosBase64: prev.photosBase64.filter((_, i) => i !== index),
      newPhotos: prev.newPhotos.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...hotel };

    // Ensure the payload is valid before sending
    if (!payload.name || !payload.phoneNumber || !payload.email || !payload.description || !payload.street) {
      setError("All fields are required.");
      return;
    }

    try {
      await updateHotel(id, payload);
      navigate(`/hotel/${id}`);
    } catch (err) {
      setError("Failed to update hotel.");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="container mt-4">
      <h2>Update Hotel</h2>
      <form onSubmit={handleSubmit}>
        {/* Hotel Name */}
        <div className="mb-3">
          <label htmlFor="name" className="form-label">Hotel Name</label>
          <input
            type="text"
            className="form-control"
            id="name"
            name="name"
            value={hotel.name}
            onChange={handleChange}
            required
          />
        </div>

        {/* Phone Number */}
        <div className="mb-3">
          <label htmlFor="phoneNumber" className="form-label">Phone Number</label>
          <input
            type="text"
            className="form-control"
            id="phoneNumber"
            name="phoneNumber"
            value={hotel.phoneNumber}
            onChange={handleChange}
            required
          />
        </div>

        {/* Email */}
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email</label>
          <input
            type="email"
            className="form-control"
            id="email"
            name="email"
            value={hotel.email}
            onChange={handleChange}
            required
          />
        </div>

        {/* Description */}
        <div className="mb-3">
          <label htmlFor="description" className="form-label">Description</label>
          <textarea
            className="form-control"
            id="description"
            name="description"
            rows="4"
            value={hotel.description}
            onChange={handleChange}
            required
          />
        </div>

        {/* Street */}
        <div className="mb-3">
          <label htmlFor="street" className="form-label">Street</label>
          <input
            type="text"
            className="form-control"
            id="street"
            name="street"
            value={hotel.street}
            onChange={handleChange}
            required
          />
        </div>

        {/* Province */}
        <div className="mb-3">
          <label htmlFor="province" className="form-label">Province</label>
          <select
            className="form-select"
            id="province"
            value={hotel.provinceId}
            onChange={handleProvinceChange}
          >
            <option value="">Select Province</option>
            {provinces.map((province) => (
              <option key={province.id} value={province.id}>
                {province.name}
              </option>
            ))}
          </select>
        </div>

        {/* District */}
        <div className="mb-3">
          <label htmlFor="district" className="form-label">District</label>
          <select
            className="form-select"
            id="district"
            value={hotel.districtId}
            onChange={handleDistrictChange}
            disabled={!districts.length}
          >
            <option value="">Select District</option>
            {districts.map((district) => (
              <option key={district.id} value={district.id}>
                {district.name}
              </option>
            ))}
          </select>
        </div>

        {/* Ward */}
        <div className="mb-3">
          <label htmlFor="ward" className="form-label">Ward</label>
          <select
            className="form-select"
            id="ward"
            value={hotel.wardId}
            onChange={handleWardChange}
            disabled={!wards.length}
          >
            <option value="">Select Ward</option>
            {wards.map((ward) => (
              <option key={ward.id} value={ward.id}>
                {ward.name}
              </option>
            ))}
          </select>
        </div>

        {/* Cover Photo */}
        <div className="mb-3 position-relative">
          <label className="form-label">Cover Photo</label>
          {hotel.coverPhotoBase64 && (
            <div className="position-relative" style={{ width: '200px', height: '200px', overflow: 'hidden' }}>
              <img
                src={hotel.coverPhotoBase64}
                alt="Cover Preview"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  borderRadius: '8px',
                }}
              />
              <button
                type="button"
                className="btn btn-danger btn-sm position-absolute top-0 end-0"
                onClick={handleDeleteCoverPhoto}
                style={{ zIndex: 1 }}
              >
                X
              </button>
            </div>
          )}
          <input
            type="file"
            className="form-control"
            accept="image/*"
            onChange={handleCoverPhotoChange}
          />
        </div>

        {/* Photos */}
        <div className="mb-3">
          <label className="form-label">Hotel Photos</label>
          <div>
            {hotel.photosBase64.map((photo, index) => (
              <div
                key={index}
                style={{
                  display: 'inline-block',
                  marginRight: '10px',
                  position: 'relative',
                  width: '200px',
                  height: '200px',
                  overflow: 'hidden',
                }}
              >
                <img
                  src={photo}
                  alt={`Photo ${index + 1}`}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    borderRadius: '8px',
                  }}
                />
                <button
                  type="button"
                  className="btn btn-danger btn-sm position-absolute top-0 end-0"
                  onClick={() => handleDeletePhoto(index)}
                  style={{ zIndex: 1 }}
                >
                  X
                </button>
              </div>
            ))}
          </div>
          <input
            type="file"
            className="form-control"
            accept="image/*"
            multiple
            onChange={handlePhotosChange}
          />
        </div>

        <button type="submit" className="btn btn-primary">Update Hotel</button>
      </form>
    </div>
  );
};

export default UpdateHotel;
