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
            await axios.get(`http://localhost:5000/process-and-chart?chart=${chartName}`);
            // Navigate to view the chart
            navigate(`/view-charts/${chartName}`);
        } catch (error) {
            console.error('Error processing chart:', error);
        }
    };

    return (
        <div>
            <h1>Upload your csv file here</h1>
            <input type="file" onChange={handleFileChange} />
            <button onClick={handleUpload}>Upload</button>
            <p>{message}</p>
            {uploadSuccess && (
                <div>
                    <button onClick={() => processChart('average_spend_by_category.jpg')}>average_spend_by_category</button>
                    <button onClick={() => processChart('monthly_expenditure_over_time.jpg')}>monthly expenditure over time</button>
                    <button onClick={() => processChart('total_spend_by_category_over_5_years.jpg')}>total spend by category over 5 years</button>
                </div>
            )}
        </div>
    );
}

export default FileUploadComponent;
