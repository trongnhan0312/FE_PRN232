import axios from "axios";
import { API_ENDPOINT } from "../config/apiConfig";

// Tạo blog post
export const createBlogPost = async ({ title, content, author, imageFile }) => {
  try {
    const formData = new FormData();
    formData.append("Title", title);
    formData.append("Content", content);
    formData.append("Author", author);
    if (imageFile) {
      formData.append("Image", imageFile);
    }

    const response = await axios.post(API_ENDPOINT.BLOGPOST.CREATE, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error creating blog post:", error);
    throw error;
  }
};

// Lấy danh sách blog posts (có phân trang + tìm kiếm)
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

    const response = await axios.get(
      `${API_ENDPOINT.BLOGPOST.ALL}?${params.toString()}`
    );

    return response.data;
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    throw error;
  }
};

// 📝 Cập nhật blog post
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
    if (imageFile) {
      formData.append("Image", imageFile);
    }

    const response = await axios.put(
      `${API_ENDPOINT.BLOGPOST.UPDATE.replace("{id}", id)}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error updating blog post:", error);
    throw error;
  }
};
// 📝 Xoá blog post
export const deleteBlogPost = async (id) => {
  try {
    const response = await axios.delete(
      `${API_ENDPOINT.BLOGPOST.DELETE.replace("{id}", id)}`
    );
    return response.data;
  } catch (error) {
    console.error("Error deleting blog post:", error);
    throw error;
  }
};
// 📝 Lấy blog post theo id
export const getBlogPostById = async (id) => {
  try {
    const response = await axios.get(
      `${API_ENDPOINT.BLOGPOST.DETAIL.replace("{id}", id)}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching blog post by id:", error);
    throw error;
  }
};
