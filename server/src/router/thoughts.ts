import express from 'express'
import { allThoughtsWithoutLikes, createNewThought, addLike, addComment, isUserLikedThought, getThoughtByID, makeUnLike, getThoughtLikesByID, getAllComments, getCommentsLength } from '../controllers/thoughts'


const router = express.Router();


// Route to render all images
// router.get('/feed', displayAllThoughts);
router.get('/thoughts', allThoughtsWithoutLikes);
// Responses represent likes and comments number
router.get('/thoughts/:thoughtID/likes', getThoughtLikesByID);
router.get('/thoughts/:thoughtID', getThoughtByID);
router.post('/newThought', createNewThought);
router.post('/thoughts/:thoughtID/addLike', addLike);
router.post('/thoughts/:thoughtID/unLike', makeUnLike);
router.post('/thoughts/:thoughtID/addComment', addComment);
router.get('/thoughts/:thoughtID/comments', getAllComments);
router.get('/thoughts/:thoughtID/commentsLength', getCommentsLength);
router.get('/thoughts/:thoughtID/isUserLiked', isUserLikedThought);





export default router;