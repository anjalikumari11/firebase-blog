import React, { useEffect, useState } from 'react'
import Layout from '../../components/layout/Layout'
import HeroSection from '../../components/heroSection/HeroSection'
import BlogPostCard from '../../components/blogPostCard/BlogPostCard'
import Loader from '../../components/loader/Loader'

function Home() {
  const [loader, setLoader] = useState(true);
  useEffect(() => {
    setTimeout(() => setLoader(false), 2000);
  })
  return (
    <>
      {loader ?
        <Loader />
        :
        <Layout>
             <HeroSection />
              <BlogPostCard />
        </Layout>
      }
    </>
  )
}

export default Home
