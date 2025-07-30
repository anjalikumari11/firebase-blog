import React, { useState, useEffect } from 'react';
import Layout from '../../components/layout/Layout';
import BlogPostCard from '../../components/blogPostCard/BlogPostCard';
import { collection, getDocs } from 'firebase/firestore';
import { fireDB } from '../../firebase/FirebaseConfig';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowAltCircleLeft } from '@fortawesome/free-regular-svg-icons';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

function AllBlogs() {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const navigate = useNavigate();
  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const querySnapshot = await getDocs(collection(fireDB, 'category'));
        const categoryList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCategories(categoryList);
      } catch (err) {
        console.log(err);
      }
    };
    fetchCategory();
  }, []);

  return (
    <Layout>
      <div className="container col-xxl-8 px-4 py-5 mt-5">
        <nav className="nav d-flex justify-content-start flex-wrap gap-3">
          <button className='btn btn-secondary' onClick={() => navigate('/')}><FontAwesomeIcon className='' icon={faArrowLeft} /></button>
          <button
            onClick={() => setSelectedCategory('All')}
            className={`btn btn-sm px-3 ${selectedCategory === 'All' ? 'btn-primary' : 'btn-outline-secondary'}`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.name)}
              className={`btn btn-sm ${selectedCategory === cat.name ? 'btn-primary' : 'btn-outline-secondary'}`}
            >
              {cat.name}
            </button>
          ))}
        </nav>
      </div>
      <main className="container">
        <BlogPostCard selectedCategory={selectedCategory} />
      </main>

    </Layout>
  );
}

export default AllBlogs;
