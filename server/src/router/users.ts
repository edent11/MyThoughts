import express from 'express'

import {
    getAllUsers, getUserNotifications, getUsersByString, getUserByUsername,
    getUserCommentsCount, getUserLikesCount, getUserThoughtsCount, getUserTaggedCount,
    getUserProfileDetails,
    getUnreadNotificationsCount,
    setNotificationRead
} from '../controllers/users'


const router = express.Router();

router.get('/allUsers', getAllUsers);
router.post('/taggedUsers', getUsersByString);
router.post('/users/notifications', getUserNotifications);
router.post('/users/unreadNotificationsCount', getUnreadNotificationsCount);
router.get('/users/:username', getUserProfileDetails);
router.post('/users/notificationRead', setNotificationRead);
// router.get('/users/:username/commentsCount', getUserCommentsCount);
// router.get('/users/:username/likesCount', getUserLikesCount);
// router.get('/users/:username/thoughtsCount', getUserThoughtsCount);
// router.get('/users/:username/taggedCount', getUserTaggedCount);
// router.get('/users/:username/profileDetails', getUserProfileDetails);



export default router;