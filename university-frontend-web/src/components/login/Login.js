import React, { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import { toast } from 'react-toastify';

const Login = ({ setShowLoginPopup, setShowSigninPopup }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState({});
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { loginUser } = useContext(AuthContext);

    const validateForm = () => {
        const errors = {};

        if (!username.trim()) {
            errors.username = 'Username is required.';
        }

        if (password.length < 8) {
            errors.password = 'Password must be at least 8 characters long.';
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
            const response = await loginUser(username, password);

            if (response.status === 200) {
                toast.success(response.data.message || 'Login successful!', { position: 'top-right' });
                localStorage.setItem('access_token', response.data.token);
                navigate('/');
            } else if (response.status === 400 || response.status === 401) {
                toast.error(response.data.message || 'Invalid credentials. Please try again.', { position: 'top-right' });
            } else {
                toast.error('Unexpected error. Please try again later.', { position: 'top-right' });
            }
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Login failed. Please try again.';
            toast.error(errorMessage, { position: 'top-right' });
        } finally {
            setLoading(false);
        }
    };

    const handleSignupClick = () => {
        setShowLoginPopup(false);
        setShowSigninPopup(true);
    };

    return (
        <div className='login'>
            <div className='login-text'>Welcome Back</div>
            <button className='google-login-button'>
                <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M23.8281 12.3926C23.8281 19.3018 19.0967 24.2188 12.1094 24.2188C5.41016 24.2188 0 18.8086 0 12.1094C0 5.41016 5.41016 0 12.1094 0C15.3711 0 18.1152 1.19629 20.2295 3.16895L16.9336 6.33789C12.6221 2.17773 4.60449 5.30273 4.60449 12.1094C4.60449 16.333 7.97852 19.7559 12.1094 19.7559C16.9043 19.7559 18.7012 16.3184 18.9844 14.5361H12.1094V10.3711H23.6377C23.75 10.9912 23.8281 11.5869 23.8281 12.3926Z" fill="white" />
                </svg>
                <div>Continue with Google</div>
            </button>
            <div className='or-text'>or</div>
            <form onSubmit={handleSubmit} className='login-form'>
                <div className='login-input-div'>
                    <div>
                        <input
                            type="text" // Changed input type from email to text
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder='Username' // Changed placeholder from E-mail to Username
                            className='login-input'
                        />
                        {error.username && <div className='errormessage'>{error.username}</div>}
                    </div>

                    <div>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder='Password'
                            className='login-input'
                        />
                        {!error.username && error.password && <div className='errormessage'>{error.password}</div>}
                    </div>

                </div>
                <button
                    type="submit"
                    className={`login-form-button ${loading ? 'loading' : ''}`}
                    disabled={loading}
                >
                    {loading ? (
                        <>
                            <span className="spinner"></span> Logging in...
                        </>
                    ) : (
                        'Login'
                    )}
                </button>
            </form>

            <div className='form-text-button-group'>
                <div className='login-to-signup'>
                    <div className='login-label'>don't have an account? </div>
                    <button className='login-create-account' onClick={handleSignupClick}>Create an account</button>
                </div>
                <button className='login-forgot-password'>Forgot password?</button>
            </div>
        </div>
    );
};

export default Login;
