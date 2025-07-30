import React, { useEffect, useState } from 'react';
import { doc, getDoc, updateDoc, Timestamp, collection, query, orderBy, onSnapshot, addDoc, getDocs, deleteDoc } from 'firebase/firestore';
import { useNavigate, useParams } from 'react-router-dom';
import { fireDB } from '../../firebase/FirebaseConfig';
import Comment from '../comment/Comment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSleigh, faStar, faHeart as solidHeart } from '@fortawesome/free-solid-svg-icons';
import { faCommentDots, faHeart as regularHeart } from '@fortawesome/free-regular-svg-icons';
import './viewBlog.css'
import Layout from '../layout/Layout';
import { toast } from 'react-toastify';
function ViewBlog() {
  const { id } = useParams();
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [comment, setComment] = useState(false);
  const [comments, setComments] = useState([]);
  const navigate = useNavigate();

  const [blogs, setBlogs] = useState({
    title: '',
    category: '',
    content: '',
    likes: 0,
    time: Timestamp.now(),
  });

  // ================= Bookmark or fav =================
  const [bookmark, setBookmark] = useState(false);
  const handleBookMark = async () => {
    const adminData = localStorage.getItem("admin");
    const parsedAdmin = JSON.parse(adminData);
    const userId = parsedAdmin?.uid;

    if (!userId) {
      navigate('/adminLogin');
      return;
    }

    try {
      const favQuery = collection(fireDB, "favorite", userId, "favoritesBlog");
      const snapshot = await getDocs(favQuery);

      let existingDocId = null;
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        if (data.blogId === id) {
          existingDocId = docSnap.id;
        }
      });

      if (existingDocId) {
        const confirmDelete = window.confirm("Already bookmarked. Do you want to remove it?");
        if (confirmDelete) {
          await deleteDoc(doc(fireDB, "favorite", userId, "favoritesBlog", existingDocId));
          setBookmark(false);
          toast.info("Removed from Favorites");
        }
      } else {
        await addDoc(collection(fireDB, "favorite", userId, "favoritesBlog"), {
          ...blogs,
          bookmarkedAt: Timestamp.now(),
          blogId: id,
        });
        setBookmark(true);
        toast.success("Added to Favorites!");
      }
    } catch (err) {
      console.error("Bookmark error:", err);
      toast.error("Something went wrong");
    }
  };

  // ================== currentBlog ====================
  useEffect(() => {
    const fetchCurrentBlog = async () => {
      try {
        const blogRef = doc(fireDB, 'blogPost', id);
        const res = await getDoc(blogRef);
        if (res.exists()) {
          const data = res.data();
          setBlogs({
            title: data.title,
            category: data.category,
            content: data.content,
            likes: data.likes || 0,
            time: data.time || Timestamp.now(),
          });
        }
      } catch (e) {
        console.error('Error fetching blog:', e.message);
      }
    };
    fetchCurrentBlog();
  }, [id]);

  //==================== Handle Like ===================
  const handleLike = async () => {
    const adminData = localStorage.getItem("admin");
    const parsedAdmin = JSON.parse(adminData);
    const userId = parsedAdmin?.uid;
    // console.log(userId)
    if (!userId) {
      navigate('/adminLogin');
      return;
    }

    const likesRef = collection(fireDB, "blogPost", id, "likes");

    try {
      let likedDocId = null;
      const snapshot = await getDocs(likesRef);
      snapshot.forEach((docSnap) => {
        if (docSnap.data().userId === userId) {
          likedDocId = docSnap.id;
        }
      });

      if (likedDocId) {
        await deleteDoc(doc(fireDB, "blogPost", id, "likes", likedDocId));
        setLiked(false);
      } else {
        await addDoc(likesRef, {
          userId: userId,
          timestamp: Timestamp.now()
        });
        setLiked(true);
        
        for (let i = 0; i < 15; i++) {
          createFallingHeart();
        }
      }
      const updatedSnapshot = await getDocs(likesRef);
      setLikeCount(updatedSnapshot.size);
    } catch (err) {
      console.error('Error updating likes:', err);
      toast.error("Error updating like");
    }
  };

  useEffect(() => {
    const checkStatus = async () => {
      const adminData = localStorage.getItem("admin");
      const parsedAdmin = JSON.parse(adminData);
      const userId = parsedAdmin?.uid;

      if (!userId) return;

      try {
        // Bookmarked
        const favQuery = collection(fireDB, "favorite", userId, "favoritesBlog");
        const favSnapshot = await getDocs(favQuery);
        const isBookmarked = favSnapshot.docs.some(doc => doc.data().blogId === id);
        setBookmark(isBookmarked);

        //Liked
        const likesRef = collection(fireDB, "blogPost", id, "likes");
        const likeSnapshot = await getDocs(likesRef);
        const likedByUser = likeSnapshot.docs.some(doc => doc.data().userId === userId);
        setBlogs(prev => ({ ...prev, likes: likeSnapshot.size }));
        setLiked(likedByUser);
        setLikeCount(likeSnapshot.size);
      } catch (error) {
        console.error("Error checking blog status:", error);
      }
    };

    checkStatus();
  }, [id]);


  const createFallingHeart = () => {
    const heart = document.createElement('div');
    heart.className = 'falling-heart';
    heart.innerText = '💖';

    heart.style.left = `${Math.random() * 100}vw`;
    heart.style.fontSize = `${Math.random() * 10 + 20}px`;

    document.body.appendChild(heart);

    setTimeout(() => {
      heart.remove();
    }, 1500);
  };

  //======= shows comment below the comment icon ======
  useEffect(() => {
    const commentRef = collection(fireDB, "blogPost", id, "comments");
    const q = query(commentRef, orderBy('timestamp', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const allComments = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setComments(allComments);
    });

    return () => unsubscribe();
  }, [id]);

  useEffect(() => {
    if (comment) {
      const commentSection = document.querySelector(".comments-list");
      commentSection?.scrollIntoView({ behavior: "smooth" });
    }
  }, [comment]);


  return (
    <Layout>
      <div className="container mt-5 py-5 px-3 px-md-5 " style={{ minHeight: "80vh" }}>
        <div className="bg-white shadow-lg p-4 p-md-5 rounded position-relative">
          <button onClick={handleBookMark} className='position-absolute top-1 end-0 bookmark'>
            {bookmark ? (
              <FontAwesomeIcon icon={faStar} className="text-warning border-none"></FontAwesomeIcon>
            ) : (
              <FontAwesomeIcon icon={faStar}></FontAwesomeIcon>
            )}
          </button>
          <h1 className="mb-3 text-primary fw-bold">{blogs.title}</h1>
          <div className="d-flex justify-content-between mb-3">
            <span className="badge bg-secondary fs-6">{blogs.category}</span>
            <small className="text-muted">
              Posted on: {blogs.time?.toDate().toLocaleString()}
            </small>
          </div>
          <hr />
          <div
            className="blog-content mt-4"
            dangerouslySetInnerHTML={{ __html: blogs.content }}
          />
          <hr />
          <div className='d-flex gap-4'>
            <div className="like-container">
              <FontAwesomeIcon
                icon={liked ? solidHeart : regularHeart}
                className={`me-2 heart-icon ${liked ? 'text-danger animate-heart' : 'text-dark'}`}
                onClick={handleLike}
              />
              <small className="like-count">{likeCount}</small>
            </div>

            <div>
              <FontAwesomeIcon
                icon={faCommentDots}
                onClick={() => setComment(!comment)}
                className={`me-2 ${comment ? 'text-primary' : 'text-dark'}`}
                style={{ fontSize: '2rem', cursor: 'pointer' }}
              />
              <small>{comments.length}</small>

            </div>

          </div>
          <div className="comments-list mt-4">
            <h5 className="mb-3">All Comments</h5>
            {comments.length === 0 ?
              (
                <p className="text-muted">No comments yet.</p>
              )
              :
              (
                comments.map((c) => (
                  <div key={c.id} className="mb-3 p-3 bg-light rounded shadow-sm">
                    <div className="d-flex justify-content-between align-items-center">
                      <strong>{c.name}</strong>
                      <small className="text-muted">
                        {c.timestamp?.toDate()?.toLocaleString() || 'Just now'}
                      </small>
                    </div>
                    <p className="mt-2 mb-0">{c.text}</p>
                  </div>
                ))
              )
            }
          </div>
          {comment && (
            <Comment />
          )}
          <button className='btn btn-secondary mt-4 rounded-pill px-4' onClick={() => navigate('/allBlogs')}>
            ← Back
          </button>
        </div>
      </div>
    </Layout>
  );
}

export default ViewBlog;
