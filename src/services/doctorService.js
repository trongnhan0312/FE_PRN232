import axios from "axios";
import { API_ENDPOINT } from "../config/apiConfig";

// ---------------- BLOG POST ------------------

export const createBlogPost = async ({ title, content, author, imageFile }) => {
  try {
    const formData = new FormData();
    formData.append("Title", title);
    formData.append("Content", content);
    formData.append("Author", author);
    if (imageFile) formData.append("Image", imageFile);

    const res = await axios.post(API_ENDPOINT.BLOGPOST.CREATE, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  } catch (err) {
    console.error("❌ Error creating blog post:", err);
    throw err;
  }
};

export const getBlogPosts = async ({
  keyword = "",
  pageNumber = 1,
  pageSize = 5,
}) => {
  try {
    const params = new URLSearchParams();
    if (keyword) params.append("keyword", keyword);
    params.append("pageNumber", pageNumber);
    params.append("pageSize", pageSize);

    const res = await axios.get(
      `${API_ENDPOINT.BLOGPOST.ALL}?${params.toString()}`
    );
    return res.data;
  } catch (err) {
    console.error("❌ Error fetching blog posts:", err);
    throw err;
  }
};

export const updateBlogPost = async ({
  id,
  title,
  content,
  author,
  imageFile,
}) => {
  try {
    const formData = new FormData();
    formData.append("Title", title);
    formData.append("Content", content);
    formData.append("Author", author);
    if (imageFile) formData.append("Image", imageFile);

    const res = await axios.put(
      API_ENDPOINT.BLOGPOST.UPDATE.replace("{id}", id),
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    return res.data;
  } catch (err) {
    console.error("❌ Error updating blog post:", err);
    throw err;
  }
};

export const deleteBlogPost = async (id) => {
  try {
    const res = await axios.delete(
      API_ENDPOINT.BLOGPOST.DELETE.replace("{id}", id)
    );
    return res.data;
  } catch (err) {
    console.error("❌ Error deleting blog post:", err);
    throw err;
  }
};

export const getBlogPostById = async (id) => {
  try {
    const res = await axios.get(
      API_ENDPOINT.BLOGPOST.DETAIL.replace("{id}", id)
    );
    return res.data;
  } catch (err) {
    console.error("❌ Error fetching blog post by id:", err);
    throw err;
  }
};

// ---------------- BLOOD GROUP ------------------

export const getBloodGroups = async ({ pageNumber = 1, pageSize = 5 }) => {
  try {
    const params = new URLSearchParams();
    params.append("pageNumber", pageNumber);
    params.append("pageSize", pageSize);

    const res = await axios.get(
      `${API_ENDPOINT.BLOOD_GROUP.ALL}?${params.toString()}`
    );
    // Trả về đúng mảng nhóm máu
    return res.data.resultObj.items;
  } catch (err) {
    console.error("❌ Error fetching blood groups:", err);
    throw err;
  }
};

// ---------------- BLOOD COMPATIBILITY ------------------

export const getBloodCompatibility = async ({
  pageNumber = 1,
  pageSize = 10,
}) => {
  try {
    const params = new URLSearchParams();
    params.append("pageNumber", pageNumber);
    params.append("pageSize", pageSize);

    const res = await axios.get(
      `${API_ENDPOINT.BLOOD_COMPATIBILITY.ALL}?${params.toString()}`
    );
    return res.data;
  } catch (err) {
    console.error("❌ Error fetching blood compatibility:", err);
    throw err;
  }
};

// ---------------- BLOOD UNIT ------------------

export const getBloodUnits = async ({ pageNumber = 1, pageSize = 10 }) => {
  try {
    const params = new URLSearchParams();
    params.append("pageNumber", pageNumber);
    params.append("pageSize", pageSize);

    const res = await axios.get(
      `${API_ENDPOINT.BLOOD_UNIT.ALL}?${params.toString()}`
    );
    return res.data;
  } catch (err) {
    console.error("❌ Error fetching blood units:", err);
    throw err;
  }
};

export const createBloodUnit = async ({
  bloodGroupId,
  bloodComponent,
  quantity,
  expiryDate,
}) => {
  try {
    const params = new URLSearchParams();
    params.append("BloodGroupId", bloodGroupId);
    params.append("BloodComponent", bloodComponent);
    params.append("Quantity", quantity);
    params.append("ExpiryDate", expiryDate);

    const res = await axios.post(
      `${API_ENDPOINT.BLOOD_UNIT.CREATE}?${params.toString()}`
    );
    return res.data;
  } catch (err) {
    console.error("❌ Error creating blood unit:", err);
    throw err;
  }
};

export const updateBloodUnit = async (
  id,
  { bloodGroupId, bloodComponent, quantity, expiryDate }
) => {
  try {
    const params = new URLSearchParams();
    params.append("BloodGroupId", bloodGroupId);
    params.append("BloodComponent", bloodComponent);
    params.append("Quantity", quantity);
    params.append("ExpiryDate", expiryDate);

    const res = await axios.put(
      `${API_ENDPOINT.BLOOD_UNIT.UPDATE.replace(
        "{id}",
        id
      )}?${params.toString()}`
    );
    return res.data;
  } catch (err) {
    console.error("❌ Error updating blood unit:", err);
    throw err;
  }
};

export const deleteBloodUnit = async (id) => {
  try {
    const res = await axios.delete(
      API_ENDPOINT.BLOOD_UNIT.DELETE.replace("{id}", id)
    );
    return res.data;
  } catch (err) {
    console.error("❌ Error deleting blood unit:", err);
    throw err;
  }
};

/**
 * Lấy danh sách Donor Availability
 * @param {Object} params
 * @param {string} [params.userName] - Tên người dùng (tùy chọn)
 * @param {number} [params.pageNumber=1] - Trang hiện tại
 * @param {number} [params.pageSize=5] - Kích thước trang
 * @returns {Promise<Object>} dữ liệu từ server
 */
export const getDonorAvailability = async ({
  userName,
  pageNumber = 1,
  pageSize = 5,
} = {}) => {
  try {
    const query = new URLSearchParams();

    // chỉ thêm userName nếu có
    if (userName && userName.trim() !== "") {
      query.append("userName", userName.trim());
    }

    query.append("pageNumber", pageNumber);
    query.append("pageSize", pageSize);

    const res = await axios.get(
      `${API_ENDPOINT.DONOR_AVAILABILITY.ALL}?${query.toString()}`
    );

    console.log("✅ data:", res.data);
    return res.data;
  } catch (err) {
    console.error("❌ Error fetching donor availability:", err);
    throw err;
  }
};

/**
 * Lấy chi tiết Donor Availability theo ID
 * @param {number} id - ID của donor availability
 * @returns {Promise<Object>} dữ liệu từ server
 */
export const getDonorAvailabilityById = async (id) => {
  try {
    const res = await axios.get(
      `${API_ENDPOINT.DONOR_AVAILABILITY.DETAIL.replace("{id}", id)}`
    );
    console.log("✅ Donor Availability Detail:", res.data);
    return res.data;
  } catch (err) {
    console.error("❌ Error fetching donor availability by id:", err);
    throw err;
  }
};

// ---------------- BLOOD REQUEST ------------------

export const getAllBloodRequests = async ({
  pageNumber = 1,
  pageSize = 5,
  requestSource = null,
  requestDate = null,
  status = null,
  bloodComponent = null,
  requestId = null,
  fullName = null,
} = {}) => {
  try {
    const params = new URLSearchParams();
    params.append("pageNumber", pageNumber);
    params.append("pageSize", pageSize);
    if (requestSource) params.append("requestSource", requestSource);
    if (requestDate) params.append("requestDate", requestDate);
    if (status) params.append("status", status);
    if (bloodComponent) params.append("bloodComponent", bloodComponent);
    if (requestId) params.append("requestId", requestId);
    if (fullName) params.append("fullName", fullName);
    const res = await axios.get(
      `${API_ENDPOINT.BLOOD_REQUEST.ALL}?${params.toString()}`
    );
    return res.data;
  } catch (err) {
    console.error("❌ Error fetching all blood requests:", err);
    throw err;
  }
};

export const getAllBloodRequestsNoPaging = async () => {
  try {
    const res = await axios.get(API_ENDPOINT.BLOOD_REQUEST.ALL_NOPAGING);
    return res.data;
  } catch (err) {
    console.error("❌ Error fetching all blood requests (no paging):", err);
    throw err;
  }
};

export const getBloodRequestById = async (id) => {
  try {
    const res = await axios.get(
      API_ENDPOINT.BLOOD_REQUEST.DETAIL.replace("{id}", id)
    );
    return res.data;
  } catch (err) {
    console.error("❌ Error fetching blood request by id:", err);
    throw err;
  }
};

export const createBloodRequest = async (model) => {
  try {
    const formData = new FormData();
    Object.entries(model).forEach(([key, value]) => {
      if (value !== undefined && value !== null) formData.append(key, value);
    });
    const res = await axios.post(API_ENDPOINT.BLOOD_REQUEST.CREATE, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  } catch (err) {
    console.error("❌ Error creating blood request:", err);
    throw err;
  }
};

export const updateBloodRequest = async (id, model) => {
  try {
    const formData = new FormData();
    Object.entries(model).forEach(([key, value]) => {
      if (value !== undefined && value !== null) formData.append(key, value);
    });
    const res = await axios.put(
      API_ENDPOINT.BLOOD_REQUEST.UPDATE.replace("{id}", id),
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    return res.data;
  } catch (err) {
    console.error("❌ Error updating blood request:", err);
    throw err;
  }
};

export const deleteBloodRequest = async (id) => {
  try {
    const res = await axios.delete(
      API_ENDPOINT.BLOOD_REQUEST.DELETE.replace("{id}", id)
    );
    return res.data;
  } catch (err) {
    console.error("❌ Error deleting blood request:", err);
    throw err;
  }
};

// ---------------- BLOOD GROUP (CRUD) ------------------

export const getBloodGroupsNoPaging = async () => {
  try {
    const res = await axios.get(API_ENDPOINT.BLOOD_GROUP.ALL_NOPAGING);
    return res.data;
  } catch (err) {
    console.error("❌ Error fetching blood groups (no paging):", err);
    throw err;
  }
};

export const getBloodGroupById = async (id) => {
  try {
    const res = await axios.get(
      API_ENDPOINT.BLOOD_GROUP.DETAIL.replace("{id}", id)
    );
    return res.data;
  } catch (err) {
    console.error("❌ Error fetching blood group by id:", err);
    throw err;
  }
};

export const createBloodGroup = async (model) => {
  try {
    const params = new URLSearchParams();
    Object.entries(model).forEach(([key, value]) => {
      if (value !== undefined && value !== null) params.append(key, value);
    });
    const res = await axios.post(
      `${API_ENDPOINT.BLOOD_GROUP.CREATE}?${params.toString()}`
    );
    return res.data;
  } catch (err) {
    console.error("❌ Error creating blood group:", err);
    throw err;
  }
};

export const updateBloodGroup = async (id, model) => {
  try {
    const params = new URLSearchParams();
    Object.entries(model).forEach(([key, value]) => {
      if (value !== undefined && value !== null) params.append(key, value);
    });
    const res = await axios.put(
      `${API_ENDPOINT.BLOOD_GROUP.UPDATE.replace(
        "{id}",
        id
      )}?${params.toString()}`
    );
    return res.data;
  } catch (err) {
    console.error("❌ Error updating blood group:", err);
    throw err;
  }
};

export const deleteBloodGroup = async (id) => {
  try {
    const res = await axios.delete(
      API_ENDPOINT.BLOOD_GROUP.DELETE.replace("{id}", id)
    );
    return res.data;
  } catch (err) {
    console.error("❌ Error deleting blood group:", err);
    throw err;
  }
};

// ---------------- BLOOD COMPATIBILITY (CRUD) ------------------

export const getBloodCompatibilities = async ({
  pageNumber = 1,
  pageSize = 10,
  bloodComponent = null,
  donorBloodGroupName = null,
  recipientBloodGroupName = null,
} = {}) => {
  try {
    const params = new URLSearchParams();
    params.append("pageNumber", pageNumber);
    params.append("pageSize", pageSize);
    if (bloodComponent) params.append("bloodComponent", bloodComponent);
    if (donorBloodGroupName)
      params.append("donorBloodGroupName", donorBloodGroupName);
    if (recipientBloodGroupName)
      params.append("recipientBloodGroupName", recipientBloodGroupName);
    const res = await axios.get(
      `${API_ENDPOINT.BLOOD_COMPATIBILITY.ALL}?${params.toString()}`
    );
    return res.data;
  } catch (err) {
    console.error("❌ Error fetching blood compatibilities:", err);
    throw err;
  }
};

export const getBloodCompatibilityById = async (id) => {
  try {
    const res = await axios.get(
      API_ENDPOINT.BLOOD_COMPATIBILITY.DETAIL.replace("{id}", id)
    );
    return res.data;
  } catch (err) {
    console.error("❌ Error fetching blood compatibility by id:", err);
    throw err;
  }
};

export const createBloodCompatibility = async (model) => {
  try {
    const res = await axios.post(
      API_ENDPOINT.BLOOD_COMPATIBILITY.CREATE,
      model
    );
    return res.data;
  } catch (err) {
    console.error("❌ Error creating blood compatibility:", err);
    throw err;
  }
};

export const updateBloodCompatibility = async (id, model) => {
  try {
    const res = await axios.put(
      API_ENDPOINT.BLOOD_COMPATIBILITY.UPDATE.replace("{id}", id),
      model
    );
    return res.data;
  } catch (err) {
    console.error("❌ Error updating blood compatibility:", err);
    throw err;
  }
};

export const deleteBloodCompatibility = async (id) => {
  try {
    const res = await axios.delete(
      API_ENDPOINT.BLOOD_COMPATIBILITY.DELETE.replace("{id}", id)
    );
    return res.data;
  } catch (err) {
    console.error("❌ Error deleting blood compatibility:", err);
    throw err;
  }
};

// ---------------- DONATION (CRUD) ------------------

export const getAllDonations = async ({
  userId = null,
  bloodRequestId = null,
  donationDate = null,
  pageNumber = 1,
  pageSize = 5,
} = {}) => {
  try {
    const params = new URLSearchParams();
    if (userId) params.append("userId", userId);
    if (bloodRequestId) params.append("bloodRequestId", bloodRequestId);
    if (donationDate) params.append("donationDate", donationDate);
    params.append("pageNumber", pageNumber);
    params.append("pageSize", pageSize);
    const res = await axios.get(
      `${API_ENDPOINT.DONATION.ALL}?${params.toString()}`
    );
    return res.data;
  } catch (err) {
    console.error("❌ Error fetching donations:", err);
    throw err;
  }
};

export const getAllDonationsNoPaging = async () => {
  try {
    const res = await axios.get(API_ENDPOINT.DONATION.ALL_NOPAGING);
    return res.data;
  } catch (err) {
    console.error("❌ Error fetching donations (no paging):", err);
    throw err;
  }
};

export const getDonationById = async (id) => {
  try {
    const res = await axios.get(
      API_ENDPOINT.DONATION.DETAIL.replace("{id}", id)
    );
    return res.data;
  } catch (err) {
    console.error("❌ Error fetching donation by id:", err);
    throw err;
  }
};

/**
 * Tạo donation mới
 * @param {Object} model
 * @param {number} model.UserId
 * @param {number} model.BloodRequestId
 * @param {number} model.Quantity
 * @param {string} model.DonationDate - dạng ISO hoặc yyyy-MM-dd
 * @param {string} [model.Notes]
 */
export const createDonation = async (model) => {
  console.log("📤 [createDonation] Dữ liệu gửi:", model);

  try {
    const query = new URLSearchParams();

    Object.entries(model).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        query.append(key, value);
      }
    });

    const url = `${API_ENDPOINT.DONATION.CREATE}?${query.toString()}`;
    console.log(`🔗 [createDonation] URL gọi API:`, url);

    const res = await axios.post(url);

    console.log("✅ [createDonation] Kết quả trả về:", res.data);
    return res.data;
  } catch (err) {
    console.error(
      "❌ [createDonation] Lỗi:",
      err.response?.data || err.message || err
    );
    throw err;
  }
};

export const updateDonation = async (id, model) => {
  try {
    const params = new URLSearchParams();
    Object.entries(model).forEach(([key, value]) => {
      if (value !== undefined && value !== null) params.append(key, value);
    });
    const res = await axios.put(
      `${API_ENDPOINT.DONATION.UPDATE.replace("{id}", id)}?${params.toString()}`
    );
    return res.data;
  } catch (err) {
    console.error("❌ Error updating donation:", err);
    throw err;
  }
};

export const deleteDonation = async (id) => {
  try {
    const res = await axios.delete(
      API_ENDPOINT.DONATION.DELETE.replace("{id}", id)
    );
    return res.data;
  } catch (err) {
    console.error("❌ Error deleting donation:", err);
    throw err;
  }
};

// ---------------- EMPLOYEE/DOCTOR CRUD ------------------

export const createEmployee = async (model) => {
  try {
    const formData = new FormData();
    Object.entries(model).forEach(([key, value]) => {
      if (value !== undefined && value !== null) formData.append(key, value);
    });
    const res = await axios.post(API_ENDPOINT.EMPLOYEE.CREATE, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  } catch (err) {
    console.error("❌ Error creating employee:", err);
    throw err;
  }
};

export const updateDoctorProfile = async (model) => {
  try {
    const formData = new FormData();
    Object.entries(model).forEach(([key, value]) => {
      if (value !== undefined && value !== null) formData.append(key, value);
    });
    const res = await axios.put(API_ENDPOINT.EMPLOYEE.UPDATE, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  } catch (err) {
    console.error("❌ Error updating doctor profile:", err);
    throw err;
  }
};

export const updateEmployeeStatus = async (model) => {
  try {
    const res = await axios.put(API_ENDPOINT.EMPLOYEE.UPDATE_STATUS, model);
    return res.data;
  } catch (err) {
    console.error("❌ Error updating employee status:", err);
    throw err;
  }
};

export const deleteEmployee = async (model) => {
  try {
    const res = await axios.post(API_ENDPOINT.EMPLOYEE.DELETE, model);
    return res.data;
  } catch (err) {
    console.error("❌ Error deleting employee:", err);
    throw err;
  }
};

export const getDoctorPagination = async ({
  Email = null,
  PageIndex = 1,
  PageSize = 10,
} = {}) => {
  try {
    const params = new URLSearchParams();
    if (Email) params.append("Email", Email);
    params.append("PageIndex", PageIndex);
    params.append("PageSize", PageSize);
    const res = await axios.post(
      `${API_ENDPOINT.EMPLOYEE.GET_DOCTORS_PAGINATION}?${params.toString()}`
    );
    return res.data;
  } catch (err) {
    console.error("❌ Error fetching doctor pagination:", err);
    throw err;
  }
};

export const getAllDoctor = async () => {
  try {
    const res = await axios.get(API_ENDPOINT.EMPLOYEE.GET_ALL_DOCTORS);
    return res.data;
  } catch (err) {
    console.error("❌ Error fetching all doctors:", err);
    throw err;
  }
};

export const getAllEmployee = async () => {
  try {
    const res = await axios.get(API_ENDPOINT.EMPLOYEE.GET_ALL_EMPLOYEE);
    return res.data;
  } catch (err) {
    console.error("❌ Error fetching all employees:", err);
    throw err;
  }
};

export const getEmployeeById = async (id) => {
  try {
    const res = await axios.get(
      API_ENDPOINT.EMPLOYEE.DETAIL.replace("{id}", id)
    );
    return res.data;
  } catch (err) {
    console.error("❌ Error fetching employee by id:", err);
    throw err;
  }
};
