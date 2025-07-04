import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./style.scss";
import {
  createBlogPost,
  getBlogPosts,
  updateBlogPost,
  deleteBlogPost,
} from "../../../services/doctorService";

import { toast } from "react-toastify";

const BlogPost = () => {
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [author, setAuthor] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");

  const navigate = useNavigate();

  const fetchPosts = async (keyword = "") => {
    try {
      const res = await getBlogPosts({ keyword, pageNumber: 1, pageSize: 10 });
      if (res?.isSuccessed) {
        const fetchedPosts = res.resultObj.items.map((item) => ({
          id: item.id,
          title: item.title,
          content: item.content,
          author: item.author,
          image: item.imageUrl,
        }));
        setPosts(fetchedPosts);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
      toast.error("Failed to fetch posts.");
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImageFile(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const resetForm = () => {
    setTitle("");
    setContent("");
    setAuthor("");
    setImageFile(null);
    setImagePreview("");
    setEditingId(null);
  };

  const handleSubmit = async () => {
    if (!title || !content || !author) {
      toast.warning("Please fill all required fields.");
      return;
    }

    setLoading(true);

    try {
      let result;

      if (editingId) {
        result = await updateBlogPost({
          id: editingId,
          title,
          content,
          author,
          imageFile,
        });
      } else {
        result = await createBlogPost({
          title,
          content,
          author,
          imageFile,
        });
      }

      if (result?.isSuccessed) {
        toast.success(
          editingId
            ? "Blog post updated successfully!"
            : "Blog post created successfully!"
        );

        fetchPosts();
        resetForm();
      } else {
        toast.error(result?.message || "Failed to save blog post.");
      }
    } catch (error) {
      toast.error("Error while saving blog post.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (post) => {
    setTitle(post.title);
    setContent(post.content);
    setAuthor(post.author);
    setImagePreview(post.image);
    setEditingId(post.id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    try {
      const result = await deleteBlogPost(id);

      if (result?.isSuccessed) {
        toast.success("Post deleted successfully!");
        fetchPosts();
      } else {
        toast.error(result?.message || "Failed to delete post.");
      }
    } catch (error) {
      toast.error("Error while deleting post.");
    }
  };

  const handleSearch = () => {
    fetchPosts(searchKeyword);
  };

  const goToDetail = (id) => {
    navigate(`/doctor/blog/${id}`);
  };

  return (
    <div className="blog-post">
      <h1>📝 Blog Posts</h1>

      <div className="form">
        <input
          type="text"
          placeholder="Title *"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          placeholder="Content *"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <input
          type="text"
          placeholder="Author *"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
        />
        <input type="file" accept="image/*" onChange={handleImageChange} />

        {imagePreview && (
          <img src={imagePreview} alt="Preview" className="preview-image" />
        )}

        <button onClick={handleSubmit} disabled={loading}>
          {loading ? "Submitting..." : editingId ? "Update" : "Add"}
        </button>
      </div>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search by title..."
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      <div className="posts">
        {posts.map((post) => (
          <div key={post.id} className="post-card">
            <div
              onClick={() => goToDetail(post.id)}
              style={{ cursor: "pointer" }}
            >
              {post.image && (
                <img src={post.image} alt="Post" className="post-image" />
              )}
              <h2>{post.title}</h2>
              <p>{post.content}</p>
              <p>
                <strong>Author:</strong> {post.author}
              </p>
            </div>

            <div className="actions">
              <button onClick={() => handleEdit(post)}>✏️ Edit</button>
              <button onClick={() => handleDelete(post.id)}>🗑️ Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlogPost;
