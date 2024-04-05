import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function ViewChartsComponent() {
    const { chartName } = useParams();
    const navigate = useNavigate();
    const [message, setMessage] = useState('');
    const imageUrl = `http://localhost:5000/charts/${chartName}`;


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
        <div style={{ textAlign: 'center' }}>
            <h2>Chart: {chartName}</h2>
            <img src={imageUrl} alt={`Chart ${chartName}`} style={{ maxWidth: '100%', height: 'auto' }} />
            {message && <p style={{ color: 'red' }}>{message}</p>}
            <div>
                <h2 style={{ color: '#555' }}>Select other charts:</h2>
                <button onClick={() => processChart('average_spend_by_category.jpg')} style={buttonStyle}>Average Spend by Category</button>
                <button onClick={() => processChart('monthly_expenditure_over_time.jpg')} style={buttonStyle}>Monthly Expenditure Over Time</button>
                <button onClick={() => processChart('total_spend_by_category_over_5_years.jpg')} style={buttonStyle}>Total Spend by Category Over 5 Years</button>
            </div>
        </div>
    );
}

const buttonStyle = {
    margin: '10px',
    backgroundColor: '#008CBA',
    color: 'white',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
};

export default ViewChartsComponent;
