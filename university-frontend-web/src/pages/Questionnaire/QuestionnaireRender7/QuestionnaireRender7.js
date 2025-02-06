import React, { useState, useEffect } from 'react';
import './QuestionnaireRender7.css';

const QuestionnaireRender7 = ({
    country,
    setCountry,
    setIsStepValid,
}) => {

    const countries = [
        'Afghanistan', 'Albania', 'Algeria', 'Andorra', 'Angola', 'Antigua and Barbuda', 'Argentina', 'Armenia', 'Australia', 'Austria', 'Azerbaijan', 'Bahamas', 'Bahrain', 'Bangladesh', 'Barbados', 'Belarus', 'Belgium', 'Belize', 'Benin', 'Bhutan', 'Bolivia', 'Bosnia and Herzegovina', 'Botswana', 'Brazil', 'Brunei', 'Bulgaria', 'Burkina Faso', 'Burundi', 'Cabo Verde', 'Cambodia', 'Cameroon', 'Canada', 'Central African Republic', 'Chad', 'Chile', 'China', 'Colombia', 'Comoros', 'Congo (Congo-Brazzaville)', 'Costa Rica', 'Croatia', 'Cuba', 'Cyprus', 'Czechia (Czech Republic)', 'Democratic Republic of the Congo', 'Denmark', 'Djibouti', 'Dominica', 'Dominican Republic', 'Ecuador', 'Egypt', 'El Salvador', 'Equatorial Guinea', 'Eritrea', 'Estonia', 'Eswatini (fmr. "Swaziland")', 'Ethiopia', 'Fiji', 'Finland', 'Gabon', 'Gambia', 'Georgia', 'Germany', 'Ghana', 'Greece', 'Grenada', 'Guatemala', 'Guinea', 'Guinea-Bissau', 'Guyana', 'Haiti', 'Holy See', 'Honduras', 'Hungary', 'Iceland', 'India', 'Indonesia', 'Iran', 'Iraq', 'Ireland', 'Israel', 'Italy', 'Jamaica', 'Japan', 'Jordan', 'Kazakhstan', 'Kenya', 'Kiribati', 'Kuwait', 'Kyrgyzstan', 'Laos', 'Latvia', 'Lebanon', 'Lesotho', 'Liberia', 'Libya', 'Liechtenstein', 'Lithuania', 'Luxembourg', 'Madagascar', 'Malawi', 'Malaysia', 'Maldives', 'Mali', 'Malta', 'Marshall Islands', 'Mauritania', 'Mauritius', 'Mexico', 'Micronesia', 'Moldova', 'Monaco', 'Mongolia', 'Montenegro', 'Morocco', 'Mozambique', 'Myanmar (formerly Burma)', 'Namibia', 'Nauru', 'Nepal', 'Netherlands', 'New Zealand', 'Nicaragua', 'Niger', 'Nigeria', 'North Korea', 'North Macedonia (formerly Macedonia)', 'Norway', 'Oman', 'Pakistan', 'Palau', 'Palestine State', 'Panama', 'Papua New Guinea', 'Paraguay', 'Peru', 'Philippines', 'Poland', 'Portugal', 'Qatar', 'Romania', 'Russia', 'Rwanda', 'Saint Kitts and Nevis', 'Saint Lucia', 'Saint Vincent and the Grenadines', 'Samoa', 'San Marino', 'Sao Tome and Principe', 'Saudi Arabia', 'Senegal', 'Serbia', 'Seychelles', 'Sierra Leone', 'Singapore', 'Slovakia', 'Slovenia', 'Solomon Islands', 'Somalia', 'South Africa', 'South Korea', 'South Sudan', 'Spain', 'Sri Lanka', 'Sudan', 'Suriname', 'Sweden', 'Switzerland', 'Syria', 'Tajikistan', 'Tanzania', 'Thailand', 'Timor-Leste', 'Togo', 'Tonga', 'Trinidad and Tobago', 'Tunisia', 'Turkey', 'Turkmenistan', 'Tuvalu', 'Uganda', 'Ukraine', 'Uruguay', 'Uzbekistan', 'Vanuatu', 'Vatican City (Holy See)', 'Venezuela', 'Vietnam', 'Yemen', 'Zambia', 'Zimbabwe'
    ];

    const [selectedCountry, setSelectedCountry] = useState('');
    const [otherCountry, setOtherCountry] = useState('');
    const [filteredCountries, setFilteredCountries] = useState([]);

    // Handle the change for predefined countries (radio buttons)
    const handleOptionChange = (event) => {
        const { id } = event.target;
        setSelectedCountry(id);
        setOtherCountry(''); // Clear the "Other" input when selecting a predefined option

        // Set the country and validate
        setCountry(id);
        setIsStepValid(true);  // Set validation to true when a valid country is selected
    };

    // Handle change for "Other" input field
    const handleOtherCountryChange = (event) => {
        const value = event.target.value;
        setOtherCountry(value);
        setSelectedCountry('other'); // Set "Other" as the selected option

        // Filter countries based on the input value
        const filtered = countries.filter(country =>
            country.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredCountries(filtered);

        // Set the country to the input value (assuming it's valid)
        setCountry(value);

        // Validate if any country is selected or inputted
        setIsStepValid(value.length > 0);  // If the input is empty, mark invalid
    };

    // Handle selection from the filtered list of countries
    const handleSelectCountry = (country) => {
        setOtherCountry(country);
        setFilteredCountries([]);
        setCountry(country);
        setIsStepValid(true); // Mark step as valid once a country is selected
    };

    // Ensure that step is valid when a country is selected or entered manually
    useEffect(() => {
        if (selectedCountry !== 'other' && selectedCountry) {
            setCountry(selectedCountry);
            setIsStepValid(true);  // Mark valid when predefined country is selected
        } else if (!selectedCountry && !otherCountry) {
            setIsStepValid(false);  // Mark invalid if no country is selected or entered
        }
    }, [selectedCountry, otherCountry, setCountry, setIsStepValid]);

    return (
        <>
            <div className='questionnaire-question-rect'>
                <div className='questionnaire-question-text'>
                    Which country would you like to study in?
                </div>
                <div className="checkbox-group-container2">
                    <div className="checkbox-container">
                        <input
                            type="radio"
                            id="USA"
                            name="country"
                            className="fancy-checkbox"
                            checked={selectedCountry === 'USA'}
                            onChange={handleOptionChange}
                        />
                        <label htmlFor="USA">United States</label>
                    </div>
                    <div className="checkbox-container">
                        <input
                            type="radio"
                            id="UnitedKingdom"
                            name="country"
                            className="fancy-checkbox"
                            checked={selectedCountry === 'UnitedKingdom'}
                            onChange={handleOptionChange}
                        />
                        <label htmlFor="UnitedKingdom">United Kingdom</label>
                    </div>
                    <div className="checkbox-container">
                        <input
                            type="radio"
                            id="France"
                            name="country"
                            className="fancy-checkbox"
                            checked={selectedCountry === 'France'}
                            onChange={handleOptionChange}
                        />
                        <label htmlFor="France">France</label>
                    </div>
                    <div className="checkbox-container">
                        <input
                            type="radio"
                            id="UAE"
                            name="country"
                            className="fancy-checkbox"
                            checked={selectedCountry === 'UAE'}
                            onChange={handleOptionChange}
                        />
                        <label htmlFor="UAE">United Arab Emirates</label>
                    </div>
                    <div className="checkbox-container">
                        <input
                            type="radio"
                            id="other"
                            name="country"
                            className="fancy-checkbox"
                            checked={selectedCountry === 'other'}
                            onChange={handleOptionChange}
                        />
                        <label htmlFor="other">Other</label>
                        {selectedCountry === 'other' && (
                            <div>
                                <input
                                    type="text"
                                    placeholder="Enter a response"
                                    style={{
                                        fontSize: "12px",
                                        border: "none",
                                        outline: "none",
                                        backgroundColor: "White",
                                        padding: "3px",
                                        borderRadius: "5px",
                                        marginLeft: "20px",
                                    }}
                                    value={otherCountry}
                                    onChange={handleOtherCountryChange}
                                />
                                {filteredCountries.length > 0 && otherCountry.length > 1 && (
                                    <ul
                                        style={{
                                            border: '1px solid #ccc',
                                            marginTop: '5px',
                                            padding: '5px',
                                            maxHeight: '130px',
                                            overflowY: 'auto',
                                            position: 'absolute',
                                            backgroundColor: 'white',
                                            color: 'black',
                                        }}
                                    >
                                        {filteredCountries.map((country, index) => (
                                            <li
                                                key={index}
                                                onClick={() => handleSelectCountry(country)}
                                                style={{ cursor: 'pointer', padding: '5px' }}
                                            >
                                                {country}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default QuestionnaireRender7;
