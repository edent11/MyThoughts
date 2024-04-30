import express from 'express'

import { addNotification, getOtherUsers, getUnReadNotificationsCountDB, getUserBySessionToken, getUserByUsernameDB, getUserNotificationsDB, getUsers } from '../db/user'
import { ObjectId } from 'mongodb';
import { getUserCommentsCountDB, getUserCommentsReceivedCountDB, getUserLikesCountDB, getUserLikesReceivedCountDB, getUserTaggedCountDB, getUserThoughtsCountDB } from '../db/thought';
import mongoose from 'mongoose';

export const getUsersByString = async (req: express.Request, res: express.Response) => {

    try {

        const { session_token, usernameSubstring, already_tagged } = req.body;
        let query: any;

        if (!session_token)
            return res.status(400).send('Unrecognized session token');

        const user = await getUserBySessionToken(session_token);

        if (!user) {

            return res.status(400).send('Cannot auth user');
        }

        if (usernameSubstring.trim() === "")
            // If searchString is empty, retrieve all users
            query = { _id: { $ne: user._id }, username: { $nin: already_tagged } };
        else
            // Otherwise, search for users where the username contains the substring
            query = { _id: { $ne: user._id }, username: { $regex: `^${usernameSubstring}`, $options: 'i', $nin: already_tagged } };


        var usersList = await getOtherUsers(query);

        return res.status(200).json(usersList).send();


    } catch (error) {
        if (error instanceof Error)
            return res.status(400).send(error.message);
    }

}


export const getAllUsers = async (req: express.Request, res: express.Response) => {

    try {

        const usersList = await getUsers();

        return res.status(200).json(usersList).send();
    }
    catch (error) {
        if (error instanceof Error)
            return res.status(400).send(error.message);
    }
}

export const addNotificationToUser = async (userID: ObjectId | mongoose.Schema.Types.ObjectId, notificationID: ObjectId) => {

    return await addNotification(userID, notificationID);

}


export const getUserNotifications = async (req: express.Request, res: express.Response) => {

    try {

        const { session_token } = req.body;

        if (!session_token)
            return res.status(400).send('Unrecognized session token');

        const user = await getUserBySessionToken(session_token);

        if (!user) {

            return res.status(400).send('Cannot auth user');
        }

        const notifications = await getUserNotificationsDB(user._id)

        return res.status(200).json(notifications).send();
    }
    catch (error) {
        if (error instanceof Error)
            return res.status(400).send(error.message);
    }
}


export const getUserByUsername = async (req: express.Request, res: express.Response) => {

    try {

        const { username } = req.params;

        const user = await getUserByUsernameDB(username);

        if (!user) {

            return res.status(400).send('Username is not exist');
        }

        return res.status(200).json(user);
    }
    catch (error) {
        if (error instanceof Error)
            return res.status(400).send(error.message);
    }
}

export const getUserCommentsCount = async (req: express.Request, res: express.Response) => {

    try {

        const { username } = req.params;

        const user = await getUserByUsernameDB(username);

        if (!user) {

            return res.status(400).send('Username is not exist');
        }

        const count = await getUserCommentsCountDB(user._id);

        return res.status(200).json(count);
    }
    catch (error) {
        if (error instanceof Error)
            return res.status(400).send(error.message);
    }
}

export const getUserLikesCount = async (req: express.Request, res: express.Response) => {

    try {

        const { username } = req.params;

        const user = await getUserByUsernameDB(username);

        if (!user) {

            return res.status(400).send('Username is not exist');
        }

        const count = await getUserLikesCountDB(user._id);

        return res.status(200).json(count);
    }
    catch (error) {
        if (error instanceof Error)
            return res.status(400).send(error.message);
    }
}

export const getUserThoughtsCount = async (req: express.Request, res: express.Response) => {

    try {

        const { username } = req.params;

        const user = await getUserByUsernameDB(username);

        if (!user) {

            return res.status(400).send('Username is not exist');
        }

        const count = await getUserThoughtsCountDB(user._id);

        return res.status(200).json(count);
    }
    catch (error) {
        if (error instanceof Error)
            return res.status(400).send(error.message);
    }
}

export const getUserTaggedCount = async (req: express.Request, res: express.Response) => {

    try {

        const { username } = req.params;

        const user = await getUserByUsernameDB(username);

        if (!user) {

            return res.status(400).send('Username is not exist');
        }

        const count = await getUserTaggedCountDB(user._id);

        return res.status(200).json(count);
    }
    catch (error) {
        if (error instanceof Error)
            return res.status(400).send(error.message);
    }
}

export const getUserProfileDetails = async (req: express.Request, res: express.Response) => {

    try {

        const { username } = req.params;

        const user = await getUserByUsernameDB(username);

        if (!user) {

            return res.status(400).send('Username is not exist');
        }

        const tags = await getUserTaggedCountDB(user._id);
        const likes = await getUserLikesCountDB(user._id);
        const comments = await getUserCommentsCountDB(user._id);
        const thoughts = await getUserThoughtsCountDB(user._id);
        const likesReceived = await getUserLikesReceivedCountDB(user._id);
        const commentsReceived = await getUserCommentsReceivedCountDB(user._id);


        return res.status(200).json({ user, tags, likes, comments, thoughts, likesReceived, commentsReceived });
    }
    catch (error) {
        if (error instanceof Error)
            return res.status(400).send(error.message);
    }
}

export const getUnreadNotificationsCount = async (req: express.Request, res: express.Response) => {

    try {

        const { session_token } = req.body;

        const user = await getUserBySessionToken(session_token);

        if (!user) {

            return res.status(400).send('Username is not exist');
        }

        const unReadCount: Number = await getUnReadNotificationsCountDB(user._id).then(count => count);


        return res.status(200).json(unReadCount);
    }
    catch (error) {
        if (error instanceof Error)
            return res.status(400).send(error.message);
    }
}