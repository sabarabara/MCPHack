import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import './stylesheet.scss';

const Main = () => {
    const { text } = useParams();
    const [imageData, setImageData] = useState(null);
    const navigate = useNavigate();
    const [position, setPosition] = useState({ fX: -1, fY: -1, sX: -1, sY: -1 });
    const [isDrawing, setIsDrawing] = useState(false);
    const [errortext, setErrortext] = useState('');

    useEffect(() => {
        const base64Image = sessionStorage.getItem('imageData');
        setImageData(base64Image);
    }, []);

    const handleClick = (event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        setPosition(prevPosition => {
            if (isDrawing) {
                return { ...prevPosition, fX: x, fY: y };
            } else {
                return { ...prevPosition, sX: x, sY: y };
            }
        });
    };

    const onSubmit = () => {
        const { fX, fY, sX, sY } = position;
        if (fX === -1 || fY === -1 || sX === -1 || sY === -1) {
            setErrortext("please check all");
        } else {
            const submitdata = {
                image: imageData,
                text: text,
                fX: fX,
                fY: fY,
                sX: sX,
                sY: sY
            };

            axios.post('http://localhost:5000/api/data/post', submitdata)
                .then(() => {
                    sessionStorage.removeItem('imageData');
                    setImageData(null);
                    navigate('/page4');
                })
                .catch(error => {
                    console.error('Error submitting data:', error);
                });
        }
    };

    return (
        <div className='Main'>
            <div className='inout'>
                <button onClick={() => setIsDrawing(false)}>IN</button>
                <button onClick={() => setIsDrawing(true)}>OUT</button>
            </div>
            <div className='image' onClick={handleClick}>
                <img src={imageData} alt="Image" />
            </div>
            <div className='decision'>
                <button onClick={onSubmit}>決定</button>
                <p>{errortext}</p>
            </div>
        </div>
    );
};

export default Main;
