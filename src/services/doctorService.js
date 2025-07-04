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
    return res.data;
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

export const getBloodUnits = async ({ pageNumber = 1, pageSize = 5 }) => {
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

