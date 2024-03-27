import express from 'express'
import { displayAllThoughts, createNewThought } from '../controllers/thoughts'


const router = express.Router();


// Route to render all images
router.get('/thoughts', displayAllThoughts);
router.post('/newThought', createNewThought);



export default router;