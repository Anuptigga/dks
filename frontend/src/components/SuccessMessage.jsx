// src/components/SuccessMessage.jsx - Success message component
import './Message.css';

const SuccessMessage = ({ message, onClose }) => {
    return (
        <div className="message success-message">
            <div className="message-content">
                <span className="message-icon">✅</span>
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

export default SuccessMessage;