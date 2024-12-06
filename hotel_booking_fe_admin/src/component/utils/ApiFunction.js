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
export async function loginAdmin(login) {
  try {
    const response = await api.post("/auth/admin-login", login); // Gọi endpoint login dành cho admin
    if (response.status >= 200 && response.status < 300) {
      return response.data;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error logging in as admin", error);
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
// API lấy danh sách khách sạn PENDING
export async function getPendingHotels() {
  try {
    const response = await api.get("/hotels/pending", { headers: getHeader() });
    return response.data;
  } catch (error) {
    throw new Error("Error fetching pending hotels: " + error.message);
  }
}

export async function approveHotel(hotelId) {
  try {
    const response = await api.put(`/hotels/approve/${hotelId}`, {}, {
      headers: getHeader(), // Nếu cần thêm header như JWT token
    });
    return response.data;
  } catch (error) {
    console.error("Error approving hotel:", error);
    throw new Error(error.message);
  }
}
// API từ chối khách sạn
export async function rejectHotel(hotelId) {
  try {
    const response = await api.put(`/hotels/reject/${hotelId}`, {},
       { headers: getHeader() });
    return response.data;
  } catch (error) {
    throw new Error("Error rejecting hotel: " + error.message);
  }
}
