import React, { useEffect, useState } from 'react'
import loginImg from '/assets/login1.jpg'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { NavLink, useNavigate } from 'react-router-dom';
import { auth, fireDB } from '../../../firebase/FirebaseConfig';
import BtnLoader from '../../../components/loader/BtnLoader/BtnLoader';
import "./login.css";
import UseGoogleLoginStore from '../../../store/LoginGoogleStore';
import googleImg from "/assets/googleImg.png"
import { addDoc, collection } from 'firebase/firestore';

function Register() {

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loader, setLoader] = useState(false);
    const [isGoogleLoading,setIsGoogleLoading] = useState(false);
    const { loginWithGoogle, getUser } = UseGoogleLoginStore();


    const navigate = useNavigate();
    useEffect(() => {
        const storedUser = getUser();
        if (storedUser) {
            console.log("User loaded from localStorage:", storedUser);
            navigate("/admin/dashboard");
        }
    }, []);
    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            setLoader(true);
            const credential = await createUserWithEmailAndPassword(auth, email, password);
            const user = credential.user;

            await addDoc(collection(fireDB, 'users'), {
                uid: user.uid,
                name: name,
                email: email,
            });
            setLoader(false);
            navigate('/adminLogin');


        } catch (e) {
            setLoader(false);

            console.log(e.message);

        }
    }
    const handleGoogleLogin = async () => {
        setIsGoogleLoading(true);
        await loginWithGoogle();
        setIsGoogleLoading(false);
        navigate('/admin/dashboard');
    }

    return (
        <div className="login-container d-flex justify-content-center align-items-center">
            <div className="login-box d-flex">
                <div className="login-form p-4">
                    <div className="card text-white bg-transparent border-0 shadow-none" style={{ width: '22rem' }}>

                        <div className="card-body">
                            <form>
                                <h2 className="text-center mb-4">Register</h2>
                                <div className="form-floating mb-3">
                                    <input type="text" className="form-control bg-secondary text-white" id="floatingInput"
                                        placeholder="Username"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                    />
                                    <label htmlFor="floatingInput">Username</label>
                                </div>
                                <div className="form-floating mb-3">
                                    <input type="email" className="form-control bg-secondary text-white" id="floatingInput"
                                        placeholder="name@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                    <label htmlFor="floatingInput">Email address</label>
                                </div>
                                <div className="form-floating mb-3">
                                    <input type="password" className="form-control bg-secondary text-white" id="floatingPassword"
                                        placeholder="Password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                    <label htmlFor="floatingPassword">Password</label>
                                </div>
                                <div className="checkbox mb-3 text-white">
                                    <label className='d-flex justify-content-between'>
                                        <p><input type="checkbox" value="remember-me" /> Remember me</p>
                                        <p><NavLink to={'/adminLogin'}>Login</NavLink></p>
                                    </label>
                                </div>
                                <button className="w-100 btn btn-lg btn-primary" onClick={handleRegister} type="button">
                                    {loader ? <BtnLoader /> : 'Register'}
                                </button>
                                <h6 className='text-center loginLine text-white'>or</h6>
                                <button className="d-flex align-items-center justify-content-between w-100 btn btn-light p-0" type="button" onClick={handleGoogleLogin}>
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

                {/* Right: Cute Image */}
                <div className="login-image d-none d-md-block">
                    <img src={loginImg} alt="Cute" height={500} />
                </div>
            </div>
        </div>
    );
}

export default Register
