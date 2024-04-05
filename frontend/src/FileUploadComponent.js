import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation

function FileUploadComponent() {
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState('');
    const [uploadSuccess, setUploadSuccess] = useState(false); // Track upload success
    const navigate = useNavigate();

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleUpload = async () => {
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await axios.post('http://localhost:5000/upload', formData);
            setMessage(response.data.message);
            setUploadSuccess(true); // Update upload success state
        } catch (error) {
            setMessage(error.response ? error.response.data.error : 'An unexpected error occurred');
            setUploadSuccess(false);
        }
    };

    // Trigger the backend process to generate the chart
    const processChart = async (chartName) => {
        try {
            await axios.post(`http://localhost:5000/process-and-chart/${chartName}`);
            // Navigate to view the chart
            navigate(`/view-charts/${chartName}`);
        } catch (error) {
            setMessage('Error processing chart:', error);
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '20px' }}>
            <h1 style={{ color: '#555' }}>Upload your financial data CSV file here</h1>
            <input type="file" onChange={handleFileChange} style={{ margin: '20px 0' }} />
            <button onClick={handleUpload} style={{ marginBottom: '20px', backgroundColor: '#4CAF50', color: 'white', padding: '10px 24px', border: 'none', cursor: 'pointer', borderRadius: '5px' }}>Click To Upload</button>
            <p style={{ color: '#d32f2f' }}>{message}</p>
            {uploadSuccess && (
                <div style={{ marginTop: '20px' }}>
                    <h2 style={{ color: '#555' }}>Select graph to generate:</h2>
                    <button onClick={() => processChart('average_spend_by_category.jpg')} style={buttonStyle}>Average Spend by Category</button>
                    <button onClick={() => processChart('monthly_expenditure_over_time.jpg')} style={buttonStyle}>Monthly Expenditure Over Time</button>
                    <button onClick={() => processChart('total_spend_by_category_over_5_years.jpg')} style={buttonStyle}>Total Spend by Category Over 5 Years</button>
                </div>
            )}
        </div>
    );
}

const buttonStyle = {
    margin: '10px',
    backgroundColor: '#008CBA',
    color: 'white',
    padding: '10px 24px',
    border: 'none',
    cursor: 'pointer',
    borderRadius: '5px',
    display: 'block'
};
export default FileUploadComponent;
