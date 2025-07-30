import { doc, getDoc, Timestamp, updateDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { fireDB } from '../../../firebase/FirebaseConfig';
import Layout from '../../../components/layout/Layout';
import QuillEditor from '../../quillEditor/QuillEditor';

function EditBlog() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);
    const [isDraft,setIsDraft] = useState(false);
    const [blogs, setBlogs] = useState({
        title: '',
        category: '',
        content: '',
        time: Timestamp.now(),
    });
    const fetchCurrentBlog = async () => {
        const blogRef = doc(fireDB, 'blogPost', id);
        const res = await getDoc(blogRef);
        const data = res.data();
        setBlogs({
            title: data.title,
            category: data.category,
            content: data.content,
            time: Timestamp.now(),
        });
        setContent(data.content);
    }

    useEffect(() => {
        fetchCurrentBlog();
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (blogs.title === '' || blogs.category === '' || blogs.content === '') {
            alert('Please fill all fields!');
            return;
        }

        try {
            setLoading(true);
            const blogRef = doc(fireDB, 'blogPost', id);
            await updateDoc(blogRef, {
                title: blogs.title,
                category: blogs.category,
                content: blogs.content,
                status:  isDraft?"draft" : "published",
                time: Timestamp.now(),
            });
            setLoading(false);
            navigate('/admin/dashboard');
        } catch (error) {
            setLoading(false);
            console.error('Error adding blog:', error);
            alert('Something went wrong while creating the blog.');
        }
    };

    return (
        <Layout>
            <div className='container py-5 mt-5'>
                <h2>Create Blog</h2>
                <form onSubmit={handleSubmit} >
                    <label>Title</label>
                    <input
                        className='form-control mb-4'
                        value={blogs.title}
                        onChange={(e) => setBlogs({ ...blogs, title: e.target.value })}
                    />

                    <label>Category</label>
                    <input
                        className='form-control mb-4'
                        value={blogs.category}
                        onChange={(e) => setBlogs({ ...blogs, category: e.target.value })}
                    />

                    <QuillEditor
                        value={content}
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
    )
}

export default EditBlog
