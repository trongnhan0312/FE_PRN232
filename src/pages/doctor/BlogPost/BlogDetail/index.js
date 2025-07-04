import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getBlogPostById } from "../../../../services/doctorService"; // Adjust the import path as necessary
import "./style.scss";

const BlogDetail = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await getBlogPostById(id);
        if (res?.isSuccessed) {
          setPost(res.resultObj);
        }
      } catch (err) {
        console.error("Failed to fetch blog post", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  if (loading) {
    return <div className="blog-detail">Loading...</div>;
  }

  if (!post) {
    return <div className="blog-detail">Blog post not found.</div>;
  }

  return (
    <div className="blog-detail">
      <div className="blog-card">
        <img src={post.imageUrl} alt={post.title} className="blog-image" />
        <h1 className="blog-title">{post.title}</h1>
        <p className="blog-author">
          <strong>Author:</strong> {post.author}
        </p>
        <div className="blog-content">{post.content}</div>
      </div>
    </div>
  );
};

export default BlogDetail;
