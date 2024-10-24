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
    cb(null, './uploads'); // Ensure this folder exists
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
      const extractedData = {
        text: result.data.text,
        // You can implement additional parsing logic here for specific details
      };
      res.json(extractedData); // Send extracted data back to frontend
    })
    .catch(err => res.status(500).json({ message: 'OCR failed', error: err }));
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
