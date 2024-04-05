// ProcessChartsComponent.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

function ProcessChartsComponent() {
    const [message, setMessage] = useState('');

    useEffect(() => {
        const processCharts = async () => {
            try {
                const response = await axios.get('http://localhost:5000/process-and-chart');
                setMessage(response.data.message);
            } catch (error) {
                setMessage(error.response.data.error);
            }
        };

        processCharts();
    }, []);

    return (
        <div>{message}</div>
    );
}

export default ProcessChartsComponent;
