import express from 'express'
import { displayAllThoughts, createNewThought, addLike, addComment } from '../controllers/thoughts'


const router = express.Router();


// Route to render all images
router.get('/thoughts', displayAllThoughts);
router.post('/newThought', createNewThought);
router.post('/addLike', addLike);
router.post('/addComment', addComment);



export default router;