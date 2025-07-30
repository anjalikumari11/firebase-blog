import React, { useEffect, useState } from 'react'
import loginImg from '/assets/login1.jpg'
import { signInWithEmailAndPassword } from 'firebase/auth';
import { NavLink, useNavigate } from 'react-router-dom';
import { auth } from '../../../firebase/FirebaseConfig';
import BtnLoader from '../../../components/loader/BtnLoader/BtnLoader';
import "./login.css";
import UseGoogleLoginStore from '../../../store/LoginGoogleStore';
import googleImg from '/assets/googleImg.png'

function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loader, setLoader] = useState(false);
  const [isGoogleLoading,setIsGoogleLoading] = useState(false);
  const { loginWithGoogle, getUser } = UseGoogleLoginStore();

  const Navigate = useNavigate();
  useEffect(() => {
    const storedUser = getUser();
    if (storedUser) {
      console.log("User loaded from localStorage:", storedUser);
      Navigate("/admin/dashboard");
    }
  }, []);

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    await loginWithGoogle();
    setIsGoogleLoading(false);

    Navigate('/admin/dashboard');
  }
  const login = async () => {
    try {
      setLoader(true);
      const result = await signInWithEmailAndPassword(auth, email, password);
      setLoader(false);
      localStorage.setItem('admin', JSON.stringify(result.user));
      Navigate('/admin/dashboard');
    } catch (error) {
      setLoader(false);
      console.log(error.message);
    }
  }
  return (
    <div className="login-container d-flex justify-content-center align-items-center">
      <div className="login-box d-flex">
        {/* Left: Login Form */}
        <div className="login-form p-4">
          <div className="card text-white bg-transparent border-0 shadow-none" style={{ width: '22rem' }}>

            <div className="card-body">
              <form>
                <h2 className="text-center mb-4">Login</h2>
                <div className="form-floating mb-3">
                  <input type="email" className="form-control bg-secondary text-white" id="floatingInput"
                    placeholder="name@example.com"
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                    required
                  />
                  <label htmlFor="floatingInput">Email address</label>
                </div>
                <div className="form-floating mb-3">
                  <input type="password" className="form-control bg-secondary text-white" id="floatingPassword"
                    placeholder="Password"
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                    required
                  />
                  <label htmlFor="floatingPassword">Password</label>
                </div>
                <div className="checkbox mb-3 text-white">
                  <label className='d-flex justify-content-between'>
                    <p><input type="checkbox" value="remember-me" /> Remember me</p>
                    <p>New User? <NavLink to={'/register'}>Register</NavLink></p>
                  </label>
                </div>
                <button className="w-100 btn btn-lg btn-primary" onClick={login} type="button">
                  {loader ? <BtnLoader /> : 'Login'}
                </button>
                <h6 className='text-center loginLine text-white'>or</h6>
              
                <button className="d-flex align-items-center justify-content-between w-100 btn btn-light p-0" type="button" onClick={handleGoogleLogin} >
                  <img src={googleImg} height={45} />
                  {isGoogleLoading ? <BtnLoader /> : 'Login with google'}
                  <img src={googleImg} height={45} style={{
                    opacity: 0
                  }} />
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Right:  Image */}
        <div className="login-image d-none d-md-block">
          <img src={loginImg} alt="Cute" height={500} />
        </div>
      </div>
    </div>
  );
}

export default AdminLogin
