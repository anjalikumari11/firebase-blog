import React, { useEffect, useState } from 'react';
import QuillEditor from '../../quillEditor/QuillEditor';
import Layout from '../../../components/layout/Layout';
import { addDoc, collection, getDoc, getDocs, Timestamp } from 'firebase/firestore';
import { fireDB } from '../../../firebase/FirebaseConfig';
import { useNavigate } from 'react-router-dom';
import UseGoogleLoginStore from '../../../store/LoginGoogleStore';

const CreateBlog = () => {
  const [content, setContent] = useState('');
  const [user, setUser] = useState({});
  const [isDraft, setIsDraft] = useState(false);
  const [blogs, setBlogs] = useState({
    title: '',
    category: '',
    content: '',
    time: Timestamp.now(),
  });
  const [loading, setLoading] = useState(false);
  const { getUser } = UseGoogleLoginStore();

  const navigate = useNavigate();

  useEffect(() => {
    const storeData = getUser();
    if (storeData) {
      setUser(storeData);
    }
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (blogs.title === '' || blogs.category === '' || blogs.content === '') {
      alert('Please fill all fields!');
      return;
    }

    try {
      setLoading(true);
      const blogRef = collection(fireDB, 'blogPost');
      if (user.uid == undefined) {
        const storeData = getUser();
        if (storeData) {
          setUser(storeData);
        }
      }
      console.log(user);
      await addDoc(blogRef, {
        title: blogs.title,
        category: blogs.category,
        content: blogs.content,
        time: Timestamp.now(),
        userId: user.uid,
        date: new Date().toLocaleString(),
        status: isDraft ? "draft" : "published",
      });
      setLoading(false);
      navigate('/admin/dashboard');
    } catch (error) {
      setLoading(false);
      console.error('Error adding blog:', error);
      alert('Something went wrong while creating the blog.');
    }
  };
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const querySnapshot = await getDocs(collection(fireDB, "category"));
        const categoryList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        setCategories(categoryList);
      } catch (err) {
        console.log(err);
      }
    }
    fetchCategory();
  }, [])

  return (
    <Layout>
      <div className='container py-5 mt-5'>
        <h2>Create Blog</h2>
        <form onSubmit={handleSubmit} >
          <label>title</label>
          {/* <input className='form-control mb-4'   /> */}
          <input
            className='form-control mb-4'
            value={blogs.title}
            onChange={(e) => setBlogs({ ...blogs, title: e.target.value })}
          />

          <label>Category</label>
          <select className='form-select mb-3' value={blogs.category} onChange={(e) => setBlogs({ ...blogs, category: e.target.value })}>
            <option>Select Category</option>
            {categories.map((cat) => (
              <option value={cat.name} key={cat.id}>{cat.name}</option>
            ))}
          </select>

          <QuillEditor
            onContentChange={(val) => {
              setContent(val);
              setBlogs((prev) => ({ ...prev, content: val }));
            }}
          />

          <div class="form-check form-switch mt-3">
            <input class="form-check-input" type="checkbox" role="switch" checked={isDraft} onChange={(e) => setIsDraft(!isDraft)} />
            <label class="form-check-label" for="switchCheckChecked">Save & Draft</label>
          </div>

          <button type='submit' disabled={loading} className='btn btn-success px-4 mt-3' >
            {isDraft ? "Draft Blog" : "Submit Blog"}
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default CreateBlog;
