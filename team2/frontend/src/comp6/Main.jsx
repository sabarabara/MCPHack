import React, { useState, useEffect } from 'react'; // useEffectをインポート
import './stylesheet.scss';
import axios from 'axios';

const Main = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/screenshot/get') // エンドポイントの修正
      .then(response => {
        const getdata = response.data.map((res) => ({
          image: res.image,
          tags: res.tags
        }));
        setData(getdata);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  return (
    <div className='Main'>
      <div className='grid'>
        {data.map((item, index) => ( // 変数名をdataからitemに変更
          <div className='grid-item' key={index}> {/* key属性を追加 */}
            <img 
              src={item.image}
              alt={`Screenshot ${index}`} // alt属性を追加
            />
            {item.tags.map((tag, tagIndex) => (
              <p key={tagIndex}>{tag}</p> // key属性を追加
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Main;
