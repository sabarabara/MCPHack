import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Main = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const navigate = useNavigate();

  const onFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        sessionStorage.setItem('imageData', base64String);
        navigate('/page2');
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div>
      <h2>Upload Image</h2>
      <input type="file" onChange={onFileChange} />
    </div>
  );
};

export default Main;