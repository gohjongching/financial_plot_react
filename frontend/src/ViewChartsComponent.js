// ViewChartsComponent.js
import React from 'react';
import { useParams } from 'react-router-dom';

function ViewChartsComponent() {
    const { chartName } = useParams();
    const imageUrl = `http://localhost:5000/charts/${chartName}`;

    return (
        <div>
            <h2>Chart: {chartName}</h2>
            <img src={imageUrl} alt={`Chart ${chartName}`} />
        </div>
    );
}

export default ViewChartsComponent;
