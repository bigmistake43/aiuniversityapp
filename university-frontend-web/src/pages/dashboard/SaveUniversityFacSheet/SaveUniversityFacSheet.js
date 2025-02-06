import React, { useState } from 'react';
import './SaveUniversityFacSheet.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const axiosInstance = axios.create({
    baseURL: "http://127.0.0.1:8000/api/",
});

axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response && error.response.status === 401) {
            const authTokens = JSON.parse(localStorage.getItem("authTokens")) || {};
            const refreshToken = authTokens?.refresh;

            if (refreshToken) {
                try {
                    const response = await axios.post("http://127.0.0.1:8000/api/token/refresh/", {
                        refresh: refreshToken,
                    });
                    const newTokens = response.data;
                    localStorage.setItem("authTokens", JSON.stringify(newTokens));
                    error.config.headers["Authorization"] = `Bearer ${newTokens.access}`;
                    return axiosInstance.request(error.config); // Retry the original request
                } catch (refreshError) {
                    console.error("Failed to refresh token:", refreshError.response?.data || refreshError.message);
                    localStorage.removeItem("authTokens");
                    window.location.href = "/login"; // Redirect to login
                }
            } else {
                localStorage.removeItem("authTokens");
                window.location.href = "/login"; // Redirect to login
            }
        }
        return Promise.reject(error);
    }
);

const SaveUniversityFacSheet = () => {
    const navigate = useNavigate(); // React Router navigate function
    const authTokens = JSON.parse(localStorage.getItem("authTokens")) || {};
    const decodedToken = authTokens?.access ? JSON.parse(atob(authTokens.access.split(".")[1])) : null;
    const email = decodedToken?.email || "Ivan@gmail.com";

    const [universityName, setUniversityName] = useState('');
    const [selectedFacts, setSelectedFacts] = useState([]);
    const [error, setError] = useState('');

    const handleUniversityNameChange = (e) => {
        setUniversityName(e.target.value);
    };

    const handleFactChange = (e) => {
        const { value, checked } = e.target;
        if (checked) {
            setSelectedFacts([...selectedFacts, value]);
        } else {
            setSelectedFacts(selectedFacts.filter(fact => fact !== value));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const data = {
            university_name: universityName,
            selected_facts: selectedFacts,
            email: email,
        };

        try {
            const response = await axiosInstance.post('SaveUniversityFacSheet/', data);

            // If successful, redirect to the show page with response data
            const factSheet = response.data.university_fact_sheet;
            console.log('Response from server:', factSheet);

            // Store the university fact sheet data in localStorage
            localStorage.setItem('universityFactSheet', JSON.stringify(factSheet));

            // Navigate to the show page
            navigate('/show_university_facsheet/');
        } catch (error) {
            console.error('Error submitting data:', error);
            setError('There was an error submitting the form. Please try again.');
        }
    };

    return (
        <div className='save-univ-facsheet-page-container'>
            <div className="form-container">
                <h2>University Selection Form</h2>
                <form onSubmit={handleSubmit}>
                    {/* University Name Section */}
                    <div className="form-group">
                        <label htmlFor="university-name">What is the name of your preferred University?</label>
                        <input
                            type="text"
                            id="university-name"
                            value={universityName}
                            onChange={handleUniversityNameChange}
                            required
                            placeholder="Enter University Name"
                        />
                    </div>

                    {/* University Factsheet Section (Table with Checkboxes) */}
                    <table className="factsheet-table">
                        <thead>
                            <tr>
                                <th>Select</th>
                                <th>Fact</th>
                                <th>Description</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>
                                    <input
                                        type="checkbox"
                                        id="fact1"
                                        value="Location"
                                        onChange={handleFactChange}
                                    />
                                </td>
                                <td>Location</td>
                                <td>The geographical location of the university.</td>
                            </tr>
                            <tr>
                                <td>
                                    <input
                                        type="checkbox"
                                        id="fact2"
                                        value="Programs Offered"
                                        onChange={handleFactChange}
                                    />
                                </td>
                                <td>Programs Offered</td>
                                <td>List of undergraduate and graduate programs offered.</td>
                            </tr>
                            <tr>
                                <td>
                                    <input
                                        type="checkbox"
                                        id="fact3"
                                        value="Campus Life"
                                        onChange={handleFactChange}
                                    />
                                </td>
                                <td>Campus Life</td>
                                <td>Details about campus activities, housing, and student life.</td>
                            </tr>
                            <tr>
                                <td>
                                    <input
                                        type="checkbox"
                                        id="fact4"
                                        value="Research Opportunities"
                                        onChange={handleFactChange}
                                    />
                                </td>
                                <td>Research Opportunities</td>
                                <td>Information on research centers and faculty-led projects.</td>
                            </tr>
                            <tr>
                                <td>
                                    <input
                                        type="checkbox"
                                        id="fact5"
                                        value="Tuition Fees"
                                        onChange={handleFactChange}
                                    />
                                </td>
                                <td>Tuition Fees</td>
                                <td>Information about the tuition cost for various programs.</td>
                            </tr>
                            <tr>
                                <td>
                                    <input
                                        type="checkbox"
                                        id="fact6"
                                        value="Scholarships"
                                        onChange={handleFactChange}
                                    />
                                </td>
                                <td>Scholarships</td>
                                <td>Details about available scholarships and financial aid options.</td>
                            </tr>
                            <tr>
                                <td>
                                    <input
                                        type="checkbox"
                                        id="fact7"
                                        value="Student Support Services"
                                        onChange={handleFactChange}
                                    />
                                </td>
                                <td>Student Support Services</td>
                                <td>Support services for students including counseling, career guidance, etc.</td>
                            </tr>
                            <tr>
                                <td>
                                    <input
                                        type="checkbox"
                                        id="fact8"
                                        value="International Students"
                                        onChange={handleFactChange}
                                    />
                                </td>
                                <td>International Students</td>
                                <td>Details about programs and services for international students.</td>
                            </tr>
                            <tr>
                                <td>
                                    <input
                                        type="checkbox"
                                        id="fact9"
                                        value="Accreditation"
                                        onChange={handleFactChange}
                                    />
                                </td>
                                <td>Accreditation</td>
                                <td>Information on the accreditation status of the university.</td>
                            </tr>
                            <tr>
                                <td>
                                    <input
                                        type="checkbox"
                                        id="fact10"
                                        value="Career Services"
                                        onChange={handleFactChange}
                                    />
                                </td>
                                <td>Career Services</td>
                                <td>Career services available to students after graduation.</td>
                            </tr>
                            <tr>
                                <td>
                                    <input
                                        type="checkbox"
                                        id="fact11"
                                        value="Campus Facilities"
                                        onChange={handleFactChange}
                                    />
                                </td>
                                <td>Campus Facilities</td>
                                <td>Information on libraries, sports facilities, and other campus amenities.</td>
                            </tr>
                            <tr>
                                <td>
                                    <input
                                        type="checkbox"
                                        id="fact12"
                                        value="Student Organizations"
                                        onChange={handleFactChange}
                                    />
                                </td>
                                <td>Student Organizations</td>
                                <td>Details about various student organizations and clubs.</td>
                            </tr>
                            {/* Additional Facts */}
                            <tr>
                                <td>
                                    <input
                                        type="checkbox"
                                        id="fact13"
                                        value="University Ranking"
                                        onChange={handleFactChange}
                                    />
                                </td>
                                <td>University Ranking</td>
                                <td>Rankings of the university on global, national, and regional scales.</td>
                            </tr>
                            <tr>
                                <td>
                                    <input
                                        type="checkbox"
                                        id="fact14"
                                        value="Faculty Expertise"
                                        onChange={handleFactChange}
                                    />
                                </td>
                                <td>Faculty Expertise</td>
                                <td>Information about the expertise and qualifications of the university's faculty.</td>
                            </tr>
                            <tr>
                                <td>
                                    <input
                                        type="checkbox"
                                        id="fact15"
                                        value="Internship Opportunities"
                                        onChange={handleFactChange}
                                    />
                                </td>
                                <td>Internship Opportunities</td>
                                <td>Details on internship programs available to students.</td>
                            </tr>
                            <tr>
                                <td>
                                    <input
                                        type="checkbox"
                                        id="fact16"
                                        value="Study Abroad Programs"
                                        onChange={handleFactChange}
                                    />
                                </td>
                                <td>Study Abroad Programs</td>
                                <td>Information on exchange programs and study abroad opportunities.</td>
                            </tr>
                            <tr>
                                <td>
                                    <input
                                        type="checkbox"
                                        id="fact17"
                                        value="Alumni Network"
                                        onChange={handleFactChange}
                                    />
                                </td>
                                <td>Alumni Network</td>
                                <td>Details on the alumni network and how it supports graduates.</td>
                            </tr>
                            <tr>
                                <td>
                                    <input
                                        type="checkbox"
                                        id="fact18"
                                        value="Sustainability Initiatives"
                                        onChange={handleFactChange}
                                    />
                                </td>
                                <td>Sustainability Initiatives</td>
                                <td>Information on the university's efforts towards sustainability and environmental protection.</td>
                            </tr>
                            <tr>
                                <td>
                                    <input
                                        type="checkbox"
                                        id="fact19"
                                        value="Health & Wellness Services"
                                        onChange={handleFactChange}
                                    />
                                </td>
                                <td>Health & Wellness Services</td>
                                <td>Details on health services, mental health support, and wellness programs.</td>
                            </tr>
                            <tr>
                                <td>
                                    <input
                                        type="checkbox"
                                        id="fact20"
                                        value="Cultural Diversity"
                                        onChange={handleFactChange}
                                    />
                                </td>
                                <td>Cultural Diversity</td>
                                <td>Information about the university's cultural diversity and inclusion programs.</td>
                            </tr>
                        </tbody>
                    </table>

                    {/* Submit Button */}
                    <button type="submit" className="submit-button">Submit</button>
                </form>
            </div>
        </div>
    );
};

export default SaveUniversityFacSheet;
