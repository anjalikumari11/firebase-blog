import React from 'react'
import "./App.css"
import { Navigate, Route, Routes } from 'react-router-dom'
import Home from './pages/home/Home'
import AllBlogs from './pages/allBlogs/AllBlogs'
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useEffect } from 'react';
import BlogPostCard from './components/blogPostCard/BlogPostCard'
import AdminLogin from './pages/admin/adminLogin/AdminLogin'
import Dashboard from './pages/admin/dashboard/Dashboard'
import 'quill/dist/quill.snow.css';
import CreateBlog from './pages/admin/createBlog/CreateBlog'
import ProtectedAdmin from './components/protectedAdmin/ProtectedAdmin'
import EditBlog from './pages/admin/editBlog/EditBlog'
import ViewBlog from './components/viewBlog/ViewBlog'
import Comment from './components/comment/Comment'
import Register from './pages/admin/adminLogin/Register';
import SaveAndDraft from './pages/save&draft/SaveAndDraft';
import MyFavorites from './pages/favorites/MyFavorites';
import Settings from './pages/admin/settings/Settings'

function App() {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,    
    });
  }, []);

  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/allBlogs" element={<AllBlogs />} />
        <Route path="/blogPostCard" element={<BlogPostCard />} />
        <Route path='/adminLogin' element={<AdminLogin />} />
        <Route path='/register' element={<Register/>} />
        <Route path="/admin/dashboard" element={
          <ProtectedAdmin>
            <Dashboard />
          </ProtectedAdmin>
        } />
        <Route path="/createBlog" element={<ProtectedAdmin><CreateBlog /></ProtectedAdmin>} />
        <Route path="/blog/edit/:id" element={<ProtectedAdmin><EditBlog /></ProtectedAdmin>} />
        <Route path="/blog/view/:id" element={<ViewBlog/>} />
        <Route path="/blog/comment" element={<ProtectedAdmin><Comment/></ProtectedAdmin>}/>
        <Route path="/MyFavorites" element={<ProtectedAdmin><MyFavorites/></ProtectedAdmin>}/>
        <Route path="/settings" element={<ProtectedAdmin><Settings/></ProtectedAdmin>}/>


      </Routes>
    </div>
  )
}

export default App


