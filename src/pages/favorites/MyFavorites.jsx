import React, { useEffect, useState } from 'react'
import Layout from '../../components/layout/Layout'
import { collection, getDoc, getDocs } from 'firebase/firestore'
import { fireDB } from '../../firebase/FirebaseConfig'
import { useNavigate } from 'react-router-dom';


function MyFavorites() {
    const [fav, setFav] = useState([]);
    const admin = localStorage.getItem("admin");
    const parsedAdmin = JSON.parse(admin);
    const userId = parsedAdmin?.uid;
    const navigate = useNavigate();
    useEffect(() => {
        const fetchFav = async () => {
            try {
                const favRef = await getDocs(collection(fireDB, "favorite", userId, "favoritesBlog"));
                const favFromDB = favRef.docs.map((f) => ({
                    id: f.id,
                    ...f.data(),
                }))
                setFav(favFromDB);

            } catch (err) {
                console.log(err);
            }
        }
        if (userId) fetchFav();
    }, [userId])

    function stripHTML(html) {
        const div = document.createElement('div');
        div.innerHTML = html;
        return div.innerText || div.textContent;
    }
    return (
        <>
            <Layout>
                <div className="container mt-5 py-5">
                    <h2 className="mb-4 text-center fw-bold">My Favorite Blogs</h2>
                    {fav.length === 0 ? (
                        <p className="text-center text-muted">No favorites found.</p>
                    ) : (
                        <div className="row g-4">
                            {fav.map((blog) => (
                                <div className="col-sm-12 col-md-6 col-lg-4" key={blog.id}>
                                    <div className="card h-100 shadow-lg border-0">
                                        <div className="card-body d-flex flex-column justify-content-between">
                                            <div>
                                                <h5 className="card-title text-primary">{blog.title}</h5>
                                                <h6 className="card-subtitle mb-2 text-muted">{blog.category}</h6>
                                                <p className="card-text mt-2 text-dark">
                                                    {stripHTML(blog.content?.slice(0, 80))}...
                                                </p>
                                            </div>
                                            <div className="mt-3">
                                                <button className="btn btn-outline-primary btn-sm" onClick={()=>navigate(`/blog/view/${blog.blogId}`)}>Read More</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className='d-flex justify-content-between mt-3'>
                        <button className='btn btn-secondary px-3' onClick={()=>navigate('/admin/dashboard')}>Back</button>
                        <button className='btn btn-secondary px-3' onClick={()=>navigate('/allBlogs')}>Home</button>
  
                    </div>
                </div>

            </Layout>
        </>

    )
}

export default MyFavorites
