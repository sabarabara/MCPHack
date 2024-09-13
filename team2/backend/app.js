const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const mysql = require('mysql');
const fs = require('fs');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(bodyParser.json({ limit: '10mb' }));
app.use(cors());

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

connection.connect(error => {
  if (error) {
    console.error('Database connection failed:', error.stack);
    return;
  }
  console.log('Connected to database.');
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // req にあるパラメータやヘッダーで判断
    if (req.body.folder === 'screenshot') {
      // screenshot フォルダに保存
      cb(null, path.join(__dirname, 'images/screenshot'));
    } else {
      // デフォルトは readimages フォルダに保存
      cb(null, path.join(__dirname, 'images/readimages'));
    }
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// データを保存するPOSTエンドポイント
app.post('/api/data/post', (req, res) => {
  const { image, text, fX, fY, sX, sY } = req.body;

  // 画像を保存するための処理
  const base64Data = image.replace(/^data:image\/\w+;base64,/, '');
  const filePath = path.join(__dirname, 'images/readimages', `${Date.now()}-${text}.png`);

  fs.writeFile(filePath, base64Data, 'base64', err => {
    if (err) {
      console.error('Image save error:', err);
      return res.status(500).json({ error: 'Image save error' });
    }

    // SQLデータベースにデータを保存
    const sql = 'INSERT INTO data (image, text, fX, fY, sX, sY) VALUES (?, ?, ?, ?, ?, ?)';
    connection.query(sql, [filePath, text, fX, fY, sX, sY], (error, results) => {
      if (error) {
        console.error('Error executing query:', error.stack);
        return res.status(500).json({ error: 'An error occurred while inserting data.' });
      }
      res.json({ results });
    });
  });
});

// データを取得してフロントに返すGETエンドポイント
app.get('/api/data/get', (req, res) => {
  connection.query('SELECT * FROM data', (error, results) => {
    if (error) {
      console.error('Error executing query:', error.stack);
      return res.status(500).json({ error: 'An error occurred while retrieving data.' });
    }

    // 結果に対して画像をBase64に変換して返す
    const promises = results.map(row => {
      return new Promise((resolve, reject) => {
        fs.readFile(row.image, 'base64', (err, base64Image) => {
          if (err) {
            reject('Failed to read image file');
          }
          resolve({
            id: row.id,
            text: row.text,
            fX: row.fX,
            fY: row.fY,
            sX: row.sX,
            sY: row.sY,
            image: `data:image/png;base64,${base64Image}`
          });
        });
      });
    });

    Promise.all(promises)
      .then(data => {
        res.status(200).json({ data });
      })
      .catch(err => {
        res.status(500).json({ error: 'Error processing data' });
      });
  });
});


//screenshot post
// データを保存するPOSTエンドポイント
app.post('/api/screenshot/post', (req, res) => {
  const imageData=req.body.imageData;
  //console.log(req.body);
  const textarray=req.body.textarray;

  // 画像を保存するための処理
  const base64Data = imageData.replace(/^data:image\/\w+;base64,/, '');
  const filePath = path.join(__dirname, 'images/screenshot', `${Date.now()}.png`);

  fs.writeFile(filePath, base64Data, 'base64', err => {
    if (err) {
      console.error('Image save error:', err);
      return res.status(500).json({ error: 'Image save error' });
    }

    // タグをデータベースに保存するためのクエリを準備
    const sql = 'INSERT INTO screenshot (image, tag) VALUES ?';
    const values = textarray.map(tag => [filePath, tag]);

    connection.query(sql, [values], (error, results) => {
      if (error) {
        console.error('Error executing query:', error.stack);
        return res.status(500).json({ error: 'An error occurred while inserting data.' });
      }
      res.json({ results });
    });
  });
});

// スクリーンショットデータの取得
app.get('/api/screenshot/get', (req, res) => {
  const sql = `
    SELECT image, GROUP_CONCAT(tag SEPARATOR ',') AS tags
    FROM screenshot
    GROUP BY image
  `;

  connection.query(sql, (error, results) => {
    if (error) {
      console.error('Error executing query:', error.stack);
      return res.status(500).json({ error: 'An error occurred while retrieving data.' });
    }

    // 結果に対して画像をBase64に変換して返す
    const promises = results.map(row => {
      return new Promise((resolve, reject) => {
        fs.readFile(row.image, 'base64', (err, base64Image) => {
          if (err) {
            reject('Failed to read image file');
          }
          resolve({
            image: `data:image/png;base64,${base64Image}`,
            tags: row.tags.split(',')
          });
        });
      });
    });

    Promise.all(promises)
      .then(images => res.json(images))
      .catch(err => res.status(500).json({ error: 'Failed to read image files' }));
  });
});


// 画像ファイルを公開
//app.use('/images/readimages', express.static(path.join(__dirname, 'images/readimages')));
//app.use('/images/readimages', express.static(path.join(__dirname, 'images/readimages')));

module.exports = app;