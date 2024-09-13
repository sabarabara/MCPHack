import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './stylesheet.scss';

const Main = () => {
    const [textarray, setTextarray] = useState([]);
    const [imageData, setImageData] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const base64Image = sessionStorage.getItem('imageData');
        setImageData(base64Image);
    }, []);

    const handleInputChange = (event, index) => {
        const newArray = [...textarray];
        newArray[index] = event.target.value;
        setTextarray(newArray);
    }

    const increase = () => {
        setTextarray([...textarray, '']);
    }

    const onSubmit = () => {
        console.log("ok1");
        const submitData = {
            imageData,
            textarray,
            folder: 'screenshot'
        };

        console.log(submitData);

        axios.post('http://localhost:5000/api/screenshot/post', submitData)
            .then(() => {
                console.log(imageData);
                sessionStorage.removeItem('imageData');
                setImageData(null);
                navigate('/page6');
            })
            .catch(error => {
                console.error('Error submitting data:', error);
            });
    }

    return (
        <div className='Main'>
            <div className='submain'>
                <div className='image'>
                    {imageData && <img src={`data:image/jpeg;base64,${imageData}`} alt='Uploaded preview' />}
                </div>
                <div className='tag'>
                    {textarray.map((tag, index) => (
                        <textarea
                            key={index}
                            value={tag}
                            onChange={(e) => handleInputChange(e, index)}
                        />
                    ))}
                    <div className='button'>
                        <button onClick={increase}>お気に入りのタグを追加する</button>
                    </div>
                </div>
            </div>
            <div className='subsub'>
                <button onClick={onSubmit}>投稿する</button>
            </div>
        </div>
    )
}

export default Main;
