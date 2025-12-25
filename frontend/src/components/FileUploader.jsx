// src/components/FileUploader.jsx - File upload component with drag & drop
import { useRef, useState } from 'react';
import './FileUploader.css';

const FileUploader = ({ onFileSelect, disabled }) => {
    const fileInputRef = useRef(null);
    const [dragActive, setDragActive] = useState(false);

    // Handle file input change
    const handleChange = (e) => {
        e.preventDefault();
        if (e.target.files && e.target.files.length > 0) {
            onFileSelect(e.target.files);
        }
    };

    // Handle drag events
    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    // Handle drop event
    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            onFileSelect(e.dataTransfer.files);
        }
    };

    // Trigger file input click
    const handleClick = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className="file-uploader">
            {/* Drop Zone */}
            <div
                className={`drop-zone ${dragActive ? 'active' : ''} ${disabled ? 'disabled' : ''}`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={handleClick}
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    onChange={handleChange}
                    disabled={disabled}
                    style={{ display: 'none' }}
                />

                <div className="drop-zone-content">
                    <div className="upload-icon">📁</div>
                    <p className="drop-zone-text">
                        {dragActive ? 'Drop images here' : 'Drag & drop images here'}
                    </p>
                    <p className="drop-zone-subtext">or</p>
                    <button
                        type="button"
                        className="browse-button"
                        disabled={disabled}
                    >
                        Browse Files
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FileUploader;