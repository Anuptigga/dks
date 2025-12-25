// src/components/LoadingSpinner.jsx - Loading indicator component
import './LoadingSpinner.css';

const LoadingSpinner = () => {
    return (
        <div className="loading-container">
            <div className="spinner"></div>
            <p className="loading-text">Converting images to PDF...</p>
            <p className="loading-subtext">This may take a few moments</p>
        </div>
    );
};

export default LoadingSpinner;