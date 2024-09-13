import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './stylesheet.scss';

const Main = () => {
    const [text, setText] = useState('');
    const [imageData, setImageData] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const base64Image = sessionStorage.getItem('imageData');
        setImageData(base64Image);
    }, []);

    const writing = (event) => {
        setText(event.target.value);
    };

    const onSubmit = () => {
        const encodedText = encodeURIComponent(text);
        navigate(`/page3/${encodedText}`);
    };

    return (
        <div className='Main'>
            <div className='image'>
                <img src={imageData} alt="read" />
            </div>
            <div className='text'>
                <textarea onChange={writing}></textarea>
                <p>名前を決定してください</p>
            </div>
            <button onClick={onSubmit}>決定</button>
        </div>
    );
};

export default Main;
