import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import axios from 'axios';

const ImageUploader = () => {
    const [selectedImage, setSelectedImage] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');
    const [imageUrl, setImageUrl] = useState('');

    const handleImageChange = (e) => {
        if (e.target.files[0]) {
            setSelectedImage(e.target.files[0]);
        }
    };

    const handleUpload = async () => {
        if (!selectedImage) {
            setError('Please select an image to upload.');
            return;
        }
        setUploading(true);
        const formData = new FormData();
        formData.append('image', selectedImage);

        try {
            const response = await axios.post('http://localhost:5000/api/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            setImageUrl(response.data.url);
            setError('');
        } catch (err) {
            setError('Failed to upload image.');
            console.error(err);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div>
            <Form.Group>
                <Form.Label>Upload Image</Form.Label>
                <Form.Control type="file" accept="image/*" onChange={handleImageChange} />
                <Button onClick={handleUpload} disabled={uploading} className="mt-2">
                    {uploading ? 'Uploading...' : 'Upload'}
                </Button>
            </Form.Group>
            {error && <Alert variant="danger" className="mt-2">{error}</Alert>}
            {imageUrl && <img src={imageUrl} alt="Uploaded" style={{ width: '200px', height: 'auto', marginTop: '10px' }} />}
        </div>
    );
};

export default ImageUploader;
