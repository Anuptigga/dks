// src/components/ErrorMessage.jsx - Error message component
import './Message.css';

const ErrorMessage = ({ message, onClose }) => {
    return (
        <div className="message error-message">
            <div className="message-content">
                <span className="message-icon">⚠️</span>
                <p className="message-text">{message}</p>
            </div>
            {onClose && (
                <button className="message-close" onClick={onClose} aria-label="Close">
                    ✕
                </button>
            )}
        </div>
    );
};

export default ErrorMessage;