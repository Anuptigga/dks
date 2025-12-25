// src/components/FileUploader.jsx - File upload component with drag & drop
import { useRef, useState } from 'react';
import './FileUploader.css';

const FileUploader = ({ files, onFileSelect, onRemoveFile, disabled }) => {
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

    // Format file size
    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
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

            {/* File List */}
            {files.length > 0 && (
                <div className="file-list">
                    <h3>Selected Images ({files.length})</h3>
                    <div className="file-items">
                        {files.map((file, index) => (
                            <div key={index} className="file-item">
                                <div className="file-info">
                                    <span className="file-icon">🖼️</span>
                                    <div className="file-details">
                                        <p className="file-name">{file.name}</p>
                                        <p className="file-size">{formatFileSize(file.size)}</p>
                                    </div>
                                </div>
                                <button
                                    className="remove-button"
                                    onClick={() => onRemoveFile(index)}
                                    disabled={disabled}
                                    aria-label="Remove file"
                                >
                                    ✕
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default FileUploader;