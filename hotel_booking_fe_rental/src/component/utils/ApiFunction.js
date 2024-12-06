import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:8080",
});

export const getHeader = () => {
  const token = localStorage.getItem("token");
  return {
    Authorization: `Bearer ${token}`,
    //"Content-Type": "application/json",
    "Content-Type": "multipart/form-data",
  };
};

export async function addRoom(photo, roomType, roomPrice) {
  const formData = new FormData();
  formData.append("photo", photo);
  formData.append("roomType", roomType);
  formData.append("roomPrice", roomPrice);

  const response = await api.post("/rooms/add/new-room", formData, {
    headers: getHeader(),
  });

  return response.status === 201;
}

export async function getRoomTypes() {
  try {
    const response = await api.get("/rooms/room/types");
    return response.data;
  } catch (error) {
    console.error("Error fetching room types", error);
    throw new Error("Error fetching room types");
  }
}
// This function get all rooms from database
export async function getAllRooms() {
  try {
    const result = await api.get("/rooms/all-rooms");
    console.log(result.data);
    return result.data;
  } catch (error) {
    throw new Error("Error fetching room");
  }
}

//This function deletes a room by id
export async function deleteRoom(roomId) {
  try {
    const result = await api.delete(`/rooms/delete/room/${roomId}`, {
      headers: getHeader(),
    });
    return result.data;
  } catch (error) {
    throw new Error(`Error deleting  room ${error.massage}`);
  }
}
//This function update a room
export async function updateRoom(roomId, roomData) {
  const formData = new FormData();
  formData.append("roomType", roomData.roomType);
  formData.append("roomPrice", roomData.roomPrice);
  formData.append("photo", roomData.photo);
  const response = await api.put(`/rooms/update/${roomId}`, formData, {
    headers: getHeader(),
  });
  return response;
}
//This function gets a room by the id
export async function getRoomById(roomId) {
  try {
    const result = await api.get(`/rooms/room/${roomId}`);
    return result.data;
  } catch (error) {
    throw new Error(`Error featching room ${error.massage}`);
  }
}
export async function bookRoom(roomId, booking) {
  try {
    const response = await api.post(
      `/bookings/room/${roomId}/booking`,
      booking
    );
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data);
    } else {
      throw new Error(`Error booking room : ${error.massage}`);
    }
  }
}
export async function getAllBookings() {
  try {
    const result = await api.get("/bookings/all-bookings", {
      headers: getHeader(),
    });
    return result.data;
  } catch (error) {
    throw new Error(`Error fetching bookings : ${error.massage}`);
  }
}
export async function getBookingByConfirmationCode(confirmationCode) {
  try {
    const result = await api.get(`/bookings/confirmation/${confirmationCode}`);
    return result.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data);
    } else {
      throw new Error(`Error find booking : ${error.message}`);
    }
  }
}
/* This is the function to cancel user booking */
export async function cancelBooking(bookingId) {
  try {
    const result = await api.delete(`/bookings/booking/${bookingId}/delete`);
    return result.data;
  } catch (error) {
    throw new Error(`Error cancelling booking :${error.message}`);
  }
}
// This function gets all available room from the database
export async function getAvailableRooms(checkInDate, checkOutDate, roomType) {
  const results = await api.get(
    `/rooms/available-rooms?checkInDate=${checkInDate}&checkOutDate=${checkOutDate}&roomType=${roomType}`
  );
  return results;
}
// This function register a new user
export async function registerUser(registration) {
  try {
    const response = await api.post("/auth/register-user", registration);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data);
    } else {
      throw new Error(`User registration error:${error.message}`);
    }
  }
}
export async function loginRental(login) {
  try {
    const response = await api.post("/auth/login-rental", login);
    if (response.status >= 200 && response.status < 300) {
      return response.data;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Login failed:", error.response ? error.response.data : error.message);
    return null;
  }
}
export async function getUserProfile(userId, token) {
  try {
    const response = await api.get(`users/profile/${userId}`, {
      headers: getHeader(),
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}
export async function deleteUser(userId) {
  try {
    const response = await api.delete(`/users/delete/${userId}`, {
      headers: getHeader(),
    });
    return response.data;
  } catch (error) {
    return error.message;
  }
}
export async function getUser(userId, token) {
  try {
    const response = await api.get(`/users/${userId}`, {
      headers: getHeader(),
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}
export async function getBookingsByUserId(userId, token) {
  try {
    const response = await api.get(`/bookings/user/${userId}/bookings`, {
      headers: getHeader(),
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching bookings:", error.message);
    throw new Error("Failed to fetch bookings");
  }
}
// Hàm đăng ký khách sạn
export async function registerHotel(hotelData) {
  try {
    const response = await api.post('/hotels/register', hotelData, {
      headers: getHeader(),
    });
    return response.data;
  } catch (error) {
    throw new Error(`Error registering hotel: ${error.response?.data || error.message}`);
  }
}

// API to fetch hotel by ID
export async function getHotelById(hotelId) {
  try {
    const response = await api.get(`/hotels/hotels/${hotelId}`, {
      headers: getHeader(),
    });
    return response.data;
  } catch (error) {
    throw new Error("Error fetching hotel details");
  }
}

// API to update hotel
// API to update hotel
export async function updateHotel(hotelId, hotelData) {
  try {
    const formData = new FormData();

    // Append hotel data (including text fields)
    formData.append("name", hotelData.name);
    formData.append("phoneNumber", hotelData.phoneNumber);
    formData.append("email", hotelData.email);
    formData.append("description", hotelData.description);
    formData.append("street", hotelData.street);
    formData.append("wardId", hotelData.wardId);

    // Always send the coverPhoto
    if (hotelData.coverPhoto) {
      formData.append("coverPhoto", hotelData.coverPhoto);
    }

    // Combine old photos with new photos
    if (hotelData.photos && hotelData.photos.length > 0) {
      hotelData.photos.forEach(photo => {
        formData.append("photos", photo);  // Append existing photos
      });
    }

    // Append new photos if any
    if (hotelData.newPhotos && hotelData.newPhotos.length > 0) {
      hotelData.newPhotos.forEach(photo => {
        formData.append("photos", photo);  // Append new photos
      });
    }

    // Send request to update hotel
    const response = await api.put(`/hotels/hotels/update/${hotelId}`, formData, {
      headers: getHeader(),
    });

    return response.data;
  } catch (error) {
    console.error("Error updating hotel:", error);
    throw new Error("Error updating hotel");
  }
}



// Lấy danh sách khách sạn của Rental
  export async function getMyHotels() {
    try {
      const response = await api.get("/hotels/my-hotels", {
        headers: getHeader(),
      });
      return response.data;
    } catch (error) {
      throw new Error(`Error fetching hotels: ${error.response?.data || error.message}`);
    }
  }


// Get pending hotels for admin approval
export async function getPendingHotels() {
  try {
    const response = await api.get(`/hotels/pending`, {
      headers: getHeader(),
    });
    return response.data;
  } catch (error) {
    throw new Error("Error fetching pending hotels");
  }
}

// Approve a hotel (admin only)
export async function approveHotel(hotelId) {
  try {
    const response = await api.put(`/hotels/approve/${hotelId}`, null, {
      headers: getHeader(),
    });
    return response.data;
  } catch (error) {
    throw new Error("Error approving hotel");
  }
}
// apiFunctions.js

// Get provinces
export async function getProvinces() {
  try {
    const response = await api.get("/api/locations/provinces", { headers: getHeader() });
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch provinces: ${error.response?.data || error.message}`);
  }
}

// Get districts by province ID
export async function getDistrictsByProvince(provinceId) {
  try {
    const response = await api.get(`/api/locations/districts`, {
      params: { provinceId },
      headers: getHeader(),
    });
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch districts: ${error.response?.data || error.message}`);
  }
}

// Get wards by district ID
export async function getWardsByDistrict(districtId) {
  try {
    const response = await api.get(`/api/locations/wards`, {
      params: { districtId },
      headers: getHeader(),
    });
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch wards: ${error.response?.data || error.message}`);
  }
}