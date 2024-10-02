import React, { useState } from 'react';
import axios from 'axios';
import './multer.css';
import { ipAddress } from '../../../../config';

function ImageUpload() {
    const [selectedFile, setSelectedFile] = useState(null);
    const [imagePath, setImagePath] = useState(null);
    const [copied, setCopied] = useState(false);

    const fileSelectedHandler = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const fileUploadHandler = async () => {
        const formData = new FormData();
        formData.append('image', selectedFile);

        try {
            const response = await axios.post(`${ipAddress}/upload/multer`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            // Modify the imagePath to ensure it's using http instead of https
            let modifiedPath = response.data.replace(/^https:\/\//, 'http://');
            setImagePath(modifiedPath);
            console.log('Image uploaded:', modifiedPath);
        } catch (error) {
            console.error('Error uploading image:', error);
        }
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(imagePath);
        setCopied(true);
        setTimeout(() => {
            setCopied(false);
            setImagePath(null); // Clear imagePath after 2 seconds
        }, 2000);
    };

    return (
        <div className="containermulter">
            <input type="file" onChange={fileSelectedHandler} className="file-input" id="file-input" />
            <label htmlFor="file-input" className="file-label upload-btn">Choose Image/Video</label>
            <button onClick={fileUploadHandler} className="upload-btn">Upload</button>
            {imagePath && (
                <div>
                    <p className="code-block">Image uploaded successfully:</p>
                    <pre className="code-block" onClick={handleCopy}>{imagePath}</pre>
                    {copied && <div className="code-block">Link copied! </div>}
                </div>
            )}
            {/* {imagePath && <img src={imagePath} alt="Uploaded" className="image-preview" />} */}
        </div>
    );
}

export default ImageUpload;
