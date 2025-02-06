import React, { useState } from 'react';
import axios from 'axios';

function SendText() {
  const [text, setText] = useState('');

  // Retrieve authTokens object from localStorage
  const authTokens = JSON.parse(localStorage.getItem('authTokens')) || {};

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      console.log('Request headers:', {
        Authorization: `Bearer ${authTokens.access}`,
      });
      console.log('Request data:', { text });

      const response = await axios.post(
        'http://127.0.0.1:8000/api/send-text-before-login/',
        { text }, // Data payload
        // {
        //   headers: {
        //     Authorization: `Bearer ${authTokens.access}`, // Include the access token in the headers
        //   },
        // }
      );

      console.log('Response:', response.data); // Log the response
    } catch (error) {
      // Log detailed error information
      console.error('Error sending text:', error.response?.data || error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter text to send"
      />
      <button type="submit">Send Text</button>
    </form>
  );
}

export default SendText;
