import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Signin.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axiosInstance from '../../services/authService';

const Signin = ({ setShowSigninPopup, setShowLoginPopup }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState({});
    const [agreeToTerms, setAgreeToTerms] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { registerUser } = useContext(AuthContext);

    const validateForm = () => {
        const errors = {};

        if (!agreeToTerms) {
            errors.agreeToTerms = 'You must agree to the Privacy Policy and Terms of Use.';
        }

        if (password !== confirmPassword) {
            errors.password = 'Passwords do not match.';
        }

        if (password.length < 8) {
            errors.password = 'Password must be at least 8 characters long.';
        }

        if (!email.match(/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/)) {
            errors.email = 'Please enter a valid email address.';
        }

        if (!name) {
            errors.name = 'Name is required.';
        }

        return errors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formErrors = validateForm();
        setError(formErrors);

        if (Object.keys(formErrors).length > 0) return;

        setLoading(true);

        try {
            const response = await registerUser(name, email, password);
            if (response.status === 201) {
                toast.success(response.data.message || 'Registration successful!', {
                    position: 'top-right',
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
                navigate('/questionnaire');
            } else if (response.status === 400) {
                toast.error(response.data.message || 'Invalid input. Please try again.', {
                    position: 'top-right',
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            } else {
                toast.error('Unexpected error. Please try again later.', {
                    position: 'top-right',
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            }
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Registration failed. Please try again.';
            toast.error(errorMessage, {
                position: 'top-right',
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        } finally {
            setLoading(false);
        }
    };

    const handleCredentialResponse = async (response) => {
        try {
            const { data } = await axiosInstance.post('/auth/google/', { token: response.credential });
            localStorage.setItem('access_token', data.access);
            toast.success('You are signed in successfully!', {
                position: 'top-right',
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            setTimeout(() => {
                navigate('/');
            }, 3000);
        } catch (error) {
            toast.error('Google login failed. Please try again.', { position: 'top-right' });
        }
    };

    useEffect(() => {
        window.google.accounts.id.initialize({
            client_id: 'YOUR_GOOGLE_CLIENT_ID',
            callback: handleCredentialResponse,
        });

        window.google.accounts.id.renderButton(
            document.getElementById('googleSignInButton'),
            { theme: 'outline', size: 'large', type: 'standard', text: 'Continue with Google' }
        );
    }, []);

    const handleLoginClick = () => {
        setShowSigninPopup(false);
        setShowLoginPopup(true);
    };

    return (
        <div className='signin'>
            <div className='login-text'>Join Us Today</div>
            <button className='google-login-button'>
                <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M23.8281 12.3926C23.8281 19.3018 19.0967 24.2188 12.1094 24.2188C5.41016 24.2188 0 18.8086 0 12.1094C0 5.41016 5.41016 0 12.1094 0C15.3711 0 18.1152 1.19629 20.2295 3.16895L16.9336 6.33789C12.6221 2.17773 4.60449 5.30273 4.60449 12.1094C4.60449 16.333 7.97852 19.7559 12.1094 19.7559C16.9043 19.7559 18.7012 16.3184 18.9844 14.5361H12.1094V10.3711H23.6377C23.75 10.9912 23.8281 11.5869 23.8281 12.3926Z" fill="white" />
                </svg>
                <div>Continue with Google</div>
            </button>
            <div className='or-text'>or</div>
            <form onSubmit={handleSubmit} className='signin-form'>
                <div className='signin-input-div'>
                    <div>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder='Name'
                            className='login-input'
                        />
                        {error.name && <p className='errormessage'>{error.name}</p>}
                    </div>

                    <div>
                        <input
                            type="text"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder='E-mail'
                            className='login-input'
                        />
                        {!error.name && error.email && <p className='errormessage'>{error.email}</p>}
                    </div>

                    <div>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder='Password'
                            className='login-input'
                        />
                        {!error.name && !error.email && error.password && <p className='errormessage'>{error.password}</p>}
                    </div>

                    <div>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder='Confirm password'
                            className='login-input'
                        />
                        {!error.name && !error.email && error.password && <p className='errormessage'>{error.password}</p>}
                    </div>
                </div>

                <div className='terms-container'>
                    <label className='terms-label'>
                        <input
                            type="checkbox"
                            checked={agreeToTerms}
                            onChange={(e) => setAgreeToTerms(e.target.checked)}
                            className='terms-checkbox'
                        />
                        I agree to the <a href="/privacy-policy" target="_blank" className="terms-link">Privacy Policy</a> and <a href="/terms-of-use" target="_blank" className="terms-link">Terms of Use</a>.
                    </label>
                    {!error.name && !error.email && !error.password && error.agreeToTerms && <p className='errormessage'>{error.agreeToTerms}</p>}
                </div>

                <button type="submit" className='login-form-button' disabled={loading}>
                    {loading ? 'Please wait...' : 'Register'}
                </button>
            </form>
            <div className='form-text-button-group'>
                <div className='signin-to-login'>
                    <div className='login-label'>Already signed?</div>
                    <button className='login-create-account' onClick={handleLoginClick}>
                        Login
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Signin;
