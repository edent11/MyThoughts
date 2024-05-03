import express from 'express'
import multer from 'multer';
import {
    allThoughtsWithoutLikes, createNewThought, addLike, addComment, isUserLikedThought,
    getThoughtByID, makeUnLike, getThoughtLikesByID, getAllComments, getCommentsLength
} from '../controllers/thoughts'
import bodyParser from 'body-parser';


const router = express.Router();

// Set up multer to handle multipart/form-data
const upload = multer({ dest: 'assets/images' }); // Specify the directory to which files will be uploaded

router.use(bodyParser.urlencoded({ extended: true }));
// Route to render all images
// router.get('/feed', displayAllThoughts);
router.get('/thoughts/:startIndex', allThoughtsWithoutLikes);
router.get('/thoughts/:thoughtID', getThoughtByID);
// Responses represent likes and comments number
router.get('/thoughts/:thoughtID/likes', getThoughtLikesByID);

router.post('/newThought', upload.single('image'), createNewThought);
router.post('/thoughts/:thoughtID/addLike', addLike);
router.post('/thoughts/:thoughtID/unLike', makeUnLike);
router.post('/thoughts/:thoughtID/addComment', addComment);
router.get('/thoughts/:thoughtID/comments', getAllComments);
router.get('/thoughts/:thoughtID/commentsLength', getCommentsLength);
router.post('/thoughts/:thoughtID/isUserLiked', isUserLikedThought);




export default router;