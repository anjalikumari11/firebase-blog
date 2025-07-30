import React from 'react'
import blog1 from '../../assets/blog1.jpg'
import { useNavigate } from 'react-router-dom'
import "./heroSection.css"

function HeroSection() {
  const navigate = useNavigate();
  const sendToDashboard=()=>{
    navigate('/admin/dashboard')
  }
  return (
    <>     
    <div className="container col-xxl-8 px-4 py-5 ">
      <div className="row flex-lg-row-reverse align-items-center g-5 py-5">
        <div className="col-10 col-sm-8 col-lg-6 hero-sec-img" data-aos="fade-left">
          <img src={blog1} className="d-block mx-lg-auto img-fluid " alt="Bootstrap Themes" width="700" height="500" loading="lazy" />
        </div>
        <div className="col-lg-6"  data-aos="fade-right">
          <h2 className="display-6 fw-bold lh-1 mb-3 heroTitle">📝 Welcome to MetaMinds</h2>
          <p className="lead">Sharing your journey through code, creativity, and continuous learning. Explore practical tutorials, project ideas, and stories that inspire..</p>
          <div className="d-grid gap-2 d-md-flex justify-content-md-start">
            <button type="button" className="btn btn-primary btn-lg px-4 me-md-2" onClick={()=>navigate('/allBlogs')}> Read Blogs  </button>
            <button type="button" className="btn btn-outline-secondary btn-lg px-4" onClick={sendToDashboard}>Start Building </button>
          </div>
        </div>
      </div>
    </div>
      <hr />
    </>

  )
}

export default HeroSection
