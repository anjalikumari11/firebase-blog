import { collection, getDocs, query, where } from 'firebase/firestore';
import React, { useState, useEffect } from 'react';
import { fireDB } from '../../firebase/FirebaseConfig';
import { useNavigate, useLocation } from 'react-router-dom';
import './blogPostCard.css';

function BlogPostCard({ selectedCategory }) {
  const [blogs, setBlogs] = useState([]);
  const navigate = useNavigate();
  const urlQuery = useQuery();
  const search = urlQuery.get("search")?.toLowerCase();

  const categoryColors = {
    Technology: '#c2e1f8ff',
    Health: '#c6e6c8ff',
    Fashion: '#e4b5c5ff',
    Travel: '#d6c7aeff',
    Desgin: '#d1aed6ff',
    Business: '#d6aeb6ff',
    Default: '#edd0d0ff'
  };
  // fetchCategory
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const q = query(
          collection(fireDB, "blogPost"),
          where("status", "==", "published")
        );
        const res = await getDocs(q);
        const blogsData = res.docs.map((b) => ({
          id: b.id,
          ...b.data(),
        }));
        setBlogs(blogsData);
      } catch (e) {
        console.log(e.message);
      }
    };
    fetchBlogs();
  }, []);
  // html tags removed
  function stripHTML(html) {
    const div = document.createElement('div');
    div.innerHTML = html;
    return div.textContent || div.innerText || '';
  }

  // filter
  const filteredBlogs = blogs.filter((post) => {
    const matchesSearch = !search || post.title.toLowerCase().includes(search) || post.content.toLowerCase().includes(search);
    const matchesCategory = !selectedCategory || selectedCategory === "All" || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="album-section py-5">
      <div className="container">
        <h2 className="text-center mb-5 fw-bold">Latest Blog Posts</h2>
        {filteredBlogs.length === 0 ? (
          <p className="text-center">No blogs found for selected filters.</p>
        ) : (
          <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-4">
            {filteredBlogs.map((blog) => (
              <div className="col" key={blog.id}>
                <div
                  className="card blog-card h-100 shadow-sm"
                  style={{
                    backgroundColor: categoryColors[blog.category] || categoryColors.Default,
                  }}
                >
                  <div className="card-body d-flex flex-column justify-content-between">
                    <div>
                      <span className="badge bg-dark-subtle text-dark fw-medium mb-2 text-uppercase px-2 py-1 rounded-pill">
                        {blog.category || "General"}
                      </span>
                      <h5 className="card-title fw-semibold text-center">{blog.title}</h5>
                    </div>
                    <div className="mt-3">
                      <p className="blog-excerpt text-muted small">
                        {stripHTML(blog.content)?.slice(0, 80)}...
                      </p>
                    </div>
                    <div className="mt-auto d-flex justify-content-between align-items-center pt-3 border-top">
                      <button
                        className="btn btn-outline-dark btn-sm rounded-pill px-3"
                        onClick={() => navigate(`/blog/view/${blog.id}`)}
                      >
                        Read More
                      </button>
                      <small className="text-muted fst-italic">{blog.date || "No Date"}</small>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default BlogPostCard;

function useQuery() {
  return new URLSearchParams(useLocation().search);
}
