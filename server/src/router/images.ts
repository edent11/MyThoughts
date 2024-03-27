import express, { Request, Response } from 'express'
import fs from 'fs';
import path from 'path';
import multer from 'multer';


const router = express.Router();

// avatar images
router.use('/avatars', express.static(path.join(__dirname, '../assets/avatars')));

// Route to render all images
router.get('/avatars', (req, res) => {
    // Directory path to images folder
    const directoryPath = path.join(__dirname, '../assets/avatars');

    // Read files from the directory
    fs.readdir(directoryPath, (err, files) => {
        if (err) {
            return res.status(500).send('Error reading images folder');
        }

        // Filter out only image files
        const imageFiles = files.filter(file => {
            return /\.(jpg|jpeg|png|gif)$/i.test(file);
        });

        // Send the list of image files to the client
        res.json(imageFiles);
    });
});


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, 'uploads'));
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

// Initialize multer middleware
const upload = multer({ storage: storage });

// Route to handle file upload
router.post('/images/upload', upload.single('image'), (req: Request, res: Response) => {
    // File has been uploaded
    res.send('File uploaded successfully');
});



export default router;