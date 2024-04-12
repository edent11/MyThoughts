import express from 'express'

import {
    createThought, getThoughtById, getThoughts, getThoughtsLik,
    getLikesByThoughtID, isUserLiked, getComments, addCommentToThought,
    unLike, getCommentsNumber, createComment, addUserLike, getThoughtsByUsername
} from '../db/thought'
import { getUserBySessionToken } from '../db/user'
import { get } from 'http';





export const allThoughtsWithoutLikes = async (req: express.Request, res: express.Response) => {

    try {
        const thoughts = await getThoughts()
            .then(data => {
                return data;
            });
        return res.status(200).json(thoughts);

    }
    catch (err) {
        console.log(err);
    }



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

        const thought = await getThoughtById(thoughtID);

        if (!thought)
            throw new Error("error")

        const likes = await getLikesByThoughtID(thought._id);

        return res.status(200).json(likes);
    }
    catch (err) {
        return res.status(400).send(err);
    }

}

export const getThoughtsByUser = async (req: express.Request, res: express.Response) => {

    try {
        const session_token = req.params.session_token;

        const thoughtID = req.params.thoughtID;

        const thought = await getThoughtById(thoughtID);

        if (!thought)
            throw new Error("error")

        const likes = await getLikesByThoughtID(thought._id);

        return res.status(200).json(likes);
    }
    catch (err) {
        return res.status(400).send(err);
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

    try {

        const thoughtID = req.params.thoughtID;

        if (!thoughtID)
            return res.status(404).send("Thought Not Found");


        const thought = await getThoughtById(thoughtID)
            .then(data => {
                return data;
            });

        return res.status(200).json(thought);
    }
    catch (err) {
        console.log(err);
    }

}

export const getCommentsLength = async (req: express.Request, res: express.Response) => {



    try {

        const thoughtID = req.params.thoughtID;

        if (!thoughtID)
            return res.status(404).send("Thought Not Found");

        const comments = await getCommentsNumber(thoughtID)
            .then(data => {
                return data;
            });

        return res.status(200).json(comments);
    } catch (err) {
        return res.status(400).send(err);
    }

}




export const getAllComments = async (req: express.Request, res: express.Response) => {


    try {
        const thoughtID = req.params.thoughtID;
        const comments = await getComments(thoughtID);

        if (!comments || !thoughtID)

            throw new Error("Can't find comments");

        return res.status(200).json(comments);
    }

    catch (error) {
        console.log(error);
    }
}




export const createNewThought = async (req: express.Request, res: express.Response) => {


    try {
        const { body, session_token } = req.body;
        const image = req.file?.filename;


        if (!body || !image || !session_token)
            return res.status(400).send(`Failed getting thought's data`);

        const user = await getUserBySessionToken(session_token);

        if (!user)
            return res.status(400).send('Cannot authenticate user');




        const newThought = await createThought({
            user: user._id,
            content:
            {
                body: body,
                imageSource: `http://localhost:5000/assets/images/${image}`
            },

        });

        return res.status(200).json("newThought").send();

    } catch (error) {
        console.log(error);
    }

}





export const makeUnLike = async (req: express.Request, res: express.Response) => {

    try {

        const session_token = req.body.session_token;
        const thoughtID = req.params.thoughtID;

        if (!session_token || thoughtID)
            return res.status(400).send(`Failed getting data`);

        const thought = await getThoughtById(thoughtID);

        if (!thought)
            return res.status(400).send(`Could not find requested thought`);


        const user = await getUserBySessionToken(session_token);

        if (!user)
            return res.status(400).send(`Unrecognized session token`);

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

export const addLike = async (req: express.Request, res: express.Response) => {

    try {


        const { session_token } = req.body;
        const thoughtID = req.params.thoughtID;

        if (!thoughtID || !session_token)
            return res.status(400).send(`Failed getting data`)

        const thought = await getThoughtById(thoughtID);

        if (!thought)
            return res.status(400).send(`Could not find requested thought`);

        const user = await getUserBySessionToken(session_token);

        if (!user)
            return res.status(400).send(`Could not authenticate user`);

        const newThought = await addUserLike(user._id, thought.id).catch(err => console.log("error"));


        return res.status(200).send(newThought);

    }
    catch (err) {
        console.log(err);

    }
}