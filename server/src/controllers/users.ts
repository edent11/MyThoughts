import express from 'express'

import { getOtherUsers, getUserBySessionToken, getUsers } from '../db/user'

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