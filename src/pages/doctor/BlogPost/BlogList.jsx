import React, { useEffect, useState } from "react";
import { getBlogPosts } from "../../../services/doctorService";

const BlogList = () => {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const res = await getBlogPosts({ pageNumber: 1, pageSize: 6 });
                if (res?.isSuccessed) {
                    setBlogs(res.resultObj.items);
                } else {
                    setError("Không lấy được danh sách blog.");
                }
            } catch (err) {
                setError("Có lỗi xảy ra khi lấy blog.");
            } finally {
                setLoading(false);
            }
        };
        fetchBlogs();
    }, []);

    if (loading) return <div>Đang tải blog...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div style={{ maxWidth: 900, margin: "0 auto", padding: 24 }}>
            <h2 style={{ color: '#b71c1c', marginBottom: 24 }}>Blog chia sẻ kinh nghiệm</h2>
            {blogs.length === 0 ? (
                <div>Chưa có bài viết nào.</div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(270px, 1fr))', gap: 24 }}>
                    {blogs.map((blog) => (
                        <div key={blog.id} style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 12px rgba(183,28,28,0.08)', border: '1px solid #eee', padding: 18, display: 'flex', flexDirection: 'column', minHeight: 260 }}>
                            {blog.imageUrl && (
                                <img src={blog.imageUrl} alt={blog.title} style={{ maxWidth: '100%', borderRadius: 8, marginBottom: 12, objectFit: 'cover', height: 120 }} />
                            )}
                            <h3 style={{ color: "#b71c1c", fontSize: 20, margin: 0 }}>{blog.title}</h3>
                            <div style={{ fontSize: 14, color: "#888", marginBottom: 8 }}>Tác giả: {blog.author}</div>
                            <div style={{ margin: "8px 0", flex: 1 }}>{blog.content?.slice(0, 120)}{blog.content?.length > 120 ? "..." : ""}</div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default BlogList;
