import express from 'express'

import { register, login, getAllUsers } from '../controllers/authentication'


const router = express.Router();

router.post('/auth/register', register);
router.post('/auth/login', login);
router.get('/users', getAllUsers);




export default router;