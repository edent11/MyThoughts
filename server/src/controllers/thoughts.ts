import express from 'express'

import { createThought, getThoughtById, getThoughts, getLikesByThoughtID, isUserLiked, getComments, addCommentToThought, unLike, getCommentsNumber, createComment, addUserLike } from '../db/thought'
import { getUserBySessionToken } from '../db/user'
import mongoose, { ObjectId } from 'mongoose';
import { CLIENT_RENEG_WINDOW } from 'tls';


//wit
export const allThoughtsWithoutLikes = async (req: express.Request, res: express.Response) => {


    const thoughts = await getThoughts()
        .then(data => {
            return data;
        });
    return res.status(200).json(thoughts);



}

export const isUserLikedThought = async (req: express.Request, res: express.Response) => {

    try {
        const thoughtID = req.params.thoughtID;
        const session_token = req.body.session_token;

        if (!session_token || !thoughtID)
            throw new Error("Cant get session_token or thoughtID");

        const user = await getUserBySessionToken(session_token);

        if (!user)
            throw new Error("Cant get user");

        console.log(session_token);

        const likes = await isUserLiked(thoughtID, user.id);

        return res.status(200).send(likes ? true : false);
    }
    catch (err) {
        return res.status(400).send(err);
    }



}

export const getThoughtLikesByID = async (req: express.Request, res: express.Response) => {

    try {
        const thoughtID = req.params.thoughtID;

        const likes = await getLikesByThoughtID(thoughtID);

        return res.status(200).json(likes[0].likesCount);
    }
    catch (err) {
        console.log('error')
    }

}

// export const getAllThoughts = async (req: express.Request, res: express.Response) => {

//     const thoughts = await getAllThoughtsID()
//         .then(data => {
//             return data;
//         });

//     return res.status(200).json(thoughts);

// }

export const getThoughtByID = async (req: express.Request, res: express.Response) => {

    const thoughtID = req.params.thoughtID;
    const thought = await getThoughtById(thoughtID)
        .then(data => {
            return data;
        });

    return res.status(200).json(thought);

}

export const getCommentsLength = async (req: express.Request, res: express.Response) => {

    const thoughtID = req.params.thoughtID;
    const comments = await getCommentsNumber(thoughtID)
        .then(data => {
            return data;
        });

    return res.status(200).json(comments);
}

export const getAllComments = async (req: express.Request, res: express.Response) => {


    try {
        const thoughtID = req.params.thoughtID;
        const comments = await getComments(thoughtID);
        if (!comments)
            throw new Error("Can't find comments");

        return res.status(200).json(comments);
    }

    catch (error) {
        console.log(error);
    }
}




export const createNewThought = async (req: express.Request, res: express.Response) => {

    try {
        const { username, content, session_token } = req.body;

        if (!username || !content || !session_token)
            return res.status(400).send(`Failed getting thought's data`);

        const userCheck = await getUserBySessionToken(session_token);

        if (!userCheck || userCheck?.username != username)
            return res.status(400).send('Cannot authenticate user');


        const newThought = await createThought({
            user: userCheck._id,
            content:
            {
                body: content.body,
                imageSource: content.imageSource
            }
        });

        return res.status(200).json(newThought).send();

    } catch (error) {
        console.log(error);
    }

}

export const addLike = async (req: express.Request, res: express.Response) => {

    try {

        const thoughtID = req.params.thoughtID;
        const session_token = req.body.session_token;

        const user = await getUserBySessionToken(session_token);

        if (!thoughtID || !user)
            return res.status(400).send(`Failed getting  data`);

        const thought = await getThoughtById(thoughtID);


        if (!thought)
            return res.status(400).send(`Could not find requested thought`);



        await addUserLike(user._id, thought.id);

        return res.status(200).send("Like was added successfully");

    }
    catch (error) {
        console.error('Error caught:', error); // Log the entire error object
        // res.status(500).send('Internal Server Error');
    }
}




export const makeUnLike = async (req: express.Request, res: express.Response) => {

    try {

        const thoughtID = req.params.thoughtID;
        const session_token = req.body.session_token;

        if (!thoughtID || !session_token)
            return res.status(400).send(`Failed getting data`);

        const thought = await getThoughtById(thoughtID);
        const user = await getUserBySessionToken(session_token);

        if (!thought || !user)
            return res.status(400).send(`Could not find requested thought`);

        await unLike(thought._id, user._id);
        return res.status(200).send("Unliked Successfully");

    }
    catch (err) {
        console.log(err);
    }
}

export const addComment = async (req: express.Request, res: express.Response) => {

    try {


        const { session_token, text } = req.body;
        const thoughtID = req.params.thoughtID;

        if (!thoughtID || !text || !session_token)
            return res.status(400).send(`Failed getting data`)

        const thought = await getThoughtById(thoughtID);

        if (!thought)
            return res.status(400).send(`Could not find requested thought`);

        const user = await getUserBySessionToken(session_token);

        if (!user)
            return res.status(400).send(`Could not authenticate user`);

        const comment = await createComment({
            user: user._id,
            text: text,
            created_at: Date.now()
        })

        const newComment = await addCommentToThought(thought._id, comment._id);

        return res.status(200).send(newComment);

    }
    catch (err) {
        console.log(err);

    }
}