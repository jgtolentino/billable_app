const express = require('express');
const multer = require('multer');
const cors = require('cors');
const Tesseract = require('tesseract.js');
const path = require('path');

const app = express();
app.use(cors());

// Set up multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage: storage });

// Upload route
app.post('/upload', upload.single('receipt'), (req, res) => {
  const filePath = path.join(__dirname, 'uploads', req.file.filename);

  // Perform OCR using Tesseract.js
  Tesseract.recognize(filePath, 'eng')
    .then(result => {
      // Extract text data from receipt
      const extractedText = result.data.text;

      // Return data (you can parse this for specific information like date, amount, etc.)
      res.json({
        message: 'File uploaded and processed successfully',
        text: extractedText,
      });
    })
    .catch(err => res.status(500).json({ message: 'OCR failed', error: err }));
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
