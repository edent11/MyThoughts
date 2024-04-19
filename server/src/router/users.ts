import express from 'express'

import { getAllUsers, getUsersByString } from '../controllers/users'


const router = express.Router();

router.get('/allUsers', getAllUsers);
router.post('/taggedUsers', getUsersByString);

export default router;