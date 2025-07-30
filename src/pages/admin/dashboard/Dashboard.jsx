import React, { useEffect, useState } from 'react';
import Navbar from '../../../components/navbar/Navbar';
import Profile from '../../../assets/profile.jpg';
import { useNavigate } from 'react-router-dom';
import UseGoogleLoginStore from '../../../store/LoginGoogleStore';
import './dashboard.css'
import { collection, deleteDoc, doc, getDocs, query, where } from 'firebase/firestore';
import { fireDB } from '../../../firebase/FirebaseConfig';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faClose } from '@fortawesome/free-solid-svg-icons';
// import Layout from '../../../components/layout/Layout';

function Dashboard() {
  const navigate = useNavigate();
  const { logout, getUser } = UseGoogleLoginStore();
  const [userData, setUserData] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [headerName, setHeaderName] = useState("Published");
  const [selectedBlog, setSelectedBlog] = useState(null);

  const fetchBlogs = async (uid, status) => {
    try {
      const q = query(
        collection(fireDB, "blogPost"),
        where("status", "==", status),
        where("userId", "==", uid)
      );

      const res = await getDocs(q);
      const blogList = res.docs.map((b) => ({
        id: b.id,
        ...b.data()
      }));
      setHeaderName(status);
      setBlogs(blogList);
    } catch (e) {
      console.error('Error fetching blogs:', e.message);
    }
  };

  const deleteBlog = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this blog?");
    if (confirmDelete) {
      await deleteDoc(doc(fireDB, 'blogPost', id));
      if (userData?.uid) fetchBlogs(userData.uid, "published");
    }
  };

  const createBlog = () => {
    navigate('/createBlog');
  };

  const handleLogout = async () => {
    await logout();
    navigate('/adminLogin');
  };

  useEffect(() => {
    const storeData = getUser();
    if (storeData) {
      setUserData(storeData);
    }
  }, []);

  useEffect(() => {
    if (userData?.uid) {
      console.log(userData);
      fetchBlogs(userData.uid, "published");
    }
  }, [userData]);

  // save and draft
  const handleSaveAndDraft = () => {
    setDrawerOpen(false);
    fetchBlogs(userData.uid, "draft");
  }
  const handlePublished = () => {
    setDrawerOpen(false);
    fetchBlogs(userData.uid, "published");
  }

  return (
    <>
      <Navbar />
      <div className="px-4 py-5 my-5 d-flex justify-content-center align-items-center gap-4 bg-secondary p-2 text-dark bg-opacity-25 border position-relative" style={{ marginTop: "90px" }}>
        <img
          className="rounded-circle img-thumbnail"
          src={userData?.photoURL ?? Profile}
          alt="Profile"
          height="140"
          width="140"
        />
        <div>
          <h2 className="fw-bold m-1">{userData?.displayName || "User"}</h2>
          <p className="m-1">Engineer</p>
          <p className="m-1">{userData?.email}</p>
          <p className="m-1">Total Blog: {blogs.length}</p>
          <div className="d-grid gap-2 d-sm-flex justify-content-sm-center">
            <button type="button" className="btn btn-primary btn-lg px-4 gap-3" onClick={createBlog}>Create Blog</button>
            <button type="button" className="btn btn-outline-secondary btn-lg px-4" onClick={handleLogout}>Logout</button>
          </div>
        </div>
        <div className='position-absolute top-0 start-0 mt-4 ' onClick={() => setDrawerOpen(true)}>
          <FontAwesomeIcon icon={faBars} style={{ fontSize: "22px" }} />
        </div>
      </div>
      {drawerOpen && (
        <div className="drawer-overlay">
          <div className="drawer DrawerActive">
            <button id="close" className='py-2 px- closeDrawer' onClick={() => setDrawerOpen(false)}><FontAwesomeIcon icon={faClose} /></button>
            <div className="d-flex justify-content-center align-items-center vh-100">
              <div className="text-white p-4 rounded shadow" style={{ width: '500px' }}>
                <ul className="list-unstyled m-0 text-center">
                  <li className="drawerList py-3 p-2 bg-dark border mt-3" onClick={() => navigate('/admin/dashboard')}>Dashboard</li>
                  <li className="drawerList py-3 p-2 bg-dark border mt-3" onClick={() => navigate('/MyFavorites')}>Favorites</li>
                  <li className="drawerList py-3 p-2 bg-dark border mt-3" onClick={handleSaveAndDraft}>Save & Draft</li>
                  <li className="drawerList py-3 p-2 bg-dark border mt-3" onClick={handlePublished}>Published Blog</li>
                  <li className="drawerList py-3 p-2 bg-dark border mt-3" onClick={() => navigate('/settings')}>Settings</li>
                </ul>
              </div>
            </div>

          </div>
        </div>
      )}

      <div className='container py-4'>
        <h2 className='text-secondary my-3 text-center'>
          {headerName.toUpperCase()} BLOGS
        </h2>

        <div className="table-responsive">
          <table className="table table-bordered align-middle text-center">
            <thead className="table-light">
              <tr>
                <th>S.No.</th>
                <th>Title</th>
                <th>Category</th>
                <th>Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {blogs.map((blog, index) => (
                <tr key={blog.id}>
                  <td>{index + 1}</td>
                  <td className="text-start">
                    {blog.title.length > 30 ? blog.title.substring(0, 30) + '...' : blog.title}
                  </td>
                  <td>{blog.category}</td>
                  <td>{blog.date}</td>
                  <td>
                    <span
                      className={`badge ${blog.status === 'published' ? 'bg-success' : 'bg-secondary'}`}
                    >
                      {blog.status}
                    </span>
                  </td>
                  <td>
                    <div className="d-grid gap-2 d-md-flex justify-content-md-center">
                      <button
                        className='btn btn-sm btn-primary'
                        data-bs-toggle="modal"
                        data-bs-target="#exampleModal"
                        onClick={() => setSelectedBlog(blog)}
                      >
                        View
                      </button>
                      <button
                        className='btn btn-sm btn-warning'
                        onClick={() => navigate(`/blog/edit/${blog.id}`)}
                      >
                        Edit
                      </button>
                      <button
                        className='btn btn-sm btn-danger'
                        onClick={() => deleteBlog(blog.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* View Modal */}
        <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog modal-dialog-scrollable modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">
                  {selectedBlog?.title}
                </h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div className="modal-body">
                <p><strong>Category:</strong> {selectedBlog?.category}</p>
                <p><strong>Date:</strong> {selectedBlog?.date}</p>
                <p><strong>Status:</strong> {selectedBlog?.status}</p>
                <hr />
                <div dangerouslySetInnerHTML={{ __html: selectedBlog?.content }} />
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

    </>
  );
}

export default Dashboard;
