import express from 'express'
import { displayAllThoughts, createNewThought, addLike, addComment, getAllThoughts, getThoughtByID, unLike } from '../controllers/thoughts'


const router = express.Router();


// Route to render all images
router.get('/feed', displayAllThoughts);
router.get('/thoughts', getAllThoughts);
router.get('/thoughts/:thoughtID', getThoughtByID);
router.post('/newThought', createNewThought);
router.post('/thoughts/:thoughtID/addLike', addLike);
router.post('/thoughts/:thoughtID/unLike', unLike);
router.post('/addComment', addComment);



export default router;