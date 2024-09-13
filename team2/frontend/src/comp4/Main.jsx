import React, { useEffect, useState } from 'react';
import axios from 'axios';
import html2canvas from 'html2canvas';
import './stylesheet.scss';
import { useNavigate } from 'react-router-dom';

const Main = () => {
    const [sidedata, setSidedata] = useState([]);
    const [maindata, setMaindata] = useState([]);
    const [inPosition, setInPosition] = useState({ x: -1, y: -1 });
    const [outPosition, setOutPosition] = useState({ x: -1, y: -1 });
    const [inoutarray, setInoutarray] = useState([]);
    const [clickcount, setClickcount] = useState(0);

    const navigate = useNavigate();

    useEffect(() => {
        axios.get('http://localhost:5000/api/data/get')
            .then(response => {
                const getdata = response.data.data.map((res) => ({
                    id: res.id,
                    image: res.image,
                    text: res.text,
                    fX: res.fX,
                    fY: res.fY,
                    sX: res.sX,
                    sY: res.sY
                }));
                setSidedata(getdata);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }, []);

    const handleClickimage = (id) => {
        const clickimages = sidedata.find(item => item.id === id);
        setMaindata([...maindata, clickimages]);
        setSidedata(sidedata.filter(item => item.id !== id));
    };

    const selection = (event, id) => {
        setClickcount((clickcount + 1) % 3);

        const rect = event.currentTarget.getBoundingClientRect();
        const x = rect.left;
        const y = rect.top;

        const clickimages = maindata.find(item => item.id === id);
        if (clickcount % 3 === 0) {
            setInPosition({
                x: x + clickimages.fX,
                y: y + clickimages.fY,
            });
        } else if (clickcount % 3 === 1) {
            setOutPosition({
                x: x + clickimages.sX,
                y: y + clickimages.sY
            });
        } else {
            setInPosition({ x: -1, y: -1 });
            setOutPosition({ x: -1, y: -1 });
        }
    };

    const describe = () => {
        setClickcount(0);

        const position = {
            fX: inPosition.x,
            fY: inPosition.y,
            sX: outPosition.x,
            sY: outPosition.y
        };

        setInoutarray([...inoutarray, position]);

        setInPosition({ x: -1, y: -1 });
        setOutPosition({ x: -1, y: -1 });
    };

    const handleClick = () => {
        const element = document.querySelector('.main-content');
        html2canvas(element).then((canvas) => {
            const imageData = canvas.toDataURL('image/png');
            sessionStorage.setItem('imageData', imageData);
            navigate('/page5');
        }).catch(error => {
            console.error('Error taking screenshot:', error);
        });
    };

    const firstpage=()=>{
        navigate('/');
    }

    return (
        <div className='Main'>
            <p>{clickcount}</p>
            <div className='Container'>
                <div className='sidebar'>
                    {sidedata.map(item => (
                        <div key={item.id} className='image-item'>
                            <img
                                src={item.image}
                                alt={item.text}
                                onClick={() => handleClickimage(item.id)}
                            />
                            <p>{item.text}</p>
                        </div>
                    ))}
                </div>
                <div className='main-content'>
                    {maindata.map(item => (
                        <div key={item.id} className='image-item'>
                            <img
                                src={item.image}
                                alt={item.text}
                                onClick={(event) => selection(event, item.id)}
                            />
                            <p>{item.text}</p>
                        </div>
                    ))}
                    {inPosition.x !== -1 && outPosition.x !== -1 && (
                        <svg
                            width="100%"
                            height="100%"
                            style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                pointerEvents: 'none'
                            }}
                        >
                            <line
                                x1={inPosition.x}
                                y1={inPosition.y}
                                x2={outPosition.x}
                                y2={outPosition.y}
                                stroke="black"
                                strokeWidth="2"
                            />
                        </svg>
                    )}
                </div>
                <button onClick={describe}>決定</button>
                <div className='screenshot'>
                    <button className='image' onClick={handleClick}>この画像で確定する</button>
                </div>
                <button onClick={firstpage}>他の画像を追加する</button>
            </div>
        </div>
    );
};

export default Main;
