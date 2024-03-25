import express from 'express'
import fs from 'fs';
import path from 'path';


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



export default router;