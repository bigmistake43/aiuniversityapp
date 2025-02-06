import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ShowAIRecommendations = () => {
    const [recommendationsHtml, setRecommendationsHtml] = useState('');
    const navigate = useNavigate();

    // Function to clean HTML content by parsing and returning clean innerHTML
    const cleanHtmlContent = (htmlContent) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlContent, 'text/html');
        return doc.body.innerHTML; // Returns clean HTML without escaped characters
    };

    useEffect(() => {
        // Retrieve the recommendations from localStorage
        const recommendations = localStorage.getItem('courseRecommendations');

        if (recommendations) {
            // Clean the HTML content before setting the state
            const cleanContent = cleanHtmlContent(recommendations);
            setRecommendationsHtml(cleanContent);
        } else {
            // If no recommendations found, redirect to the form page
            navigate('/ai_course_matching');
        }
    }, [navigate]);

    return (
        <div className="show_recommendations_container">
            <h1>AI Course Recommendations</h1>
            {recommendationsHtml ? (
                <div
                    className="recommendations-content"
                    dangerouslySetInnerHTML={{ __html: recommendationsHtml }}
                />
            ) : (
                <p>No recommendations available. Please try again later.</p>
            )}
        </div>
    );
};

export default ShowAIRecommendations;
