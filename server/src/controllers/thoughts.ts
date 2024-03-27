import express from 'express'

import { createThought, getThoughtById, getThoughts, getThoughtsByUsername } from '../db/thought'
import { getUserBySessionToken } from '../db/user'


export const displayAllThoughts = async (req: express.Request, res: express.Response) => {

    await getThoughts()
        .then(thoughts => {
            return res.status(200).json(thoughts).send();
        })
        .catch(err => {
            return res.status(400).send(err);
        })



}

export const createNewThought = async (req: express.Request, res: express.Response) => {

    try {
        const { username, content, session_token } = req.body;

        if (!username || !content || !session_token)
            throw new Error(`Failed getting thought's data`);

        const userCheck = await getUserBySessionToken(session_token);

        if (!userCheck || userCheck?.username != username)
            throw new Error('Cannot authenticate user');


        const newThought = await createThought({
            user: userCheck,
            content:
            {
                header: content.header,
                body: content.body,
                imageSource: content.imageSource
            }
        });

        return res.status(200).json(newThought).send();

    } catch (error) {
        if (error instanceof Error)
            return res.status(400).send(error.message);
    }

}

export const addLike = async (req: express.Request, res: express.Response) => {

    try {

        const { thoughtID } = req.body;

        if (!thoughtID)
            throw new Error(`Failed getting  data`);

        const thought = await getThoughtById(thoughtID);

        if (!thought)
            throw new Error(`Could not find requested thought`);

        thought.likes = thought.likes + 1;

        thought.save();

        return res.status(200).send("Like was added successfully");

    }
    catch (err) {
        if (err instanceof Error)
            return res.status(400).send(err.message);
    }
}

export const unLike = async (req: express.Request, res: express.Response) => {

    try {

        const { thoughtID } = req.body;

        if (!thoughtID)
            throw new Error(`Failed getting  data`);

        const thought = await getThoughtById(thoughtID);

        if (!thought)
            throw new Error(`Could not find requested thought`);

        thought.likes = thought.likes - 1;

        thought.save();

        return res.status(200).send("Like was added successfully");

    }
    catch (err) {
        if (err instanceof Error)
            return res.status(400).send(err.message);
    }
}

export const addComment = async (req: express.Request, res: express.Response) => {

    try {


        const { thoughtID, session_token, comment } = req.body;

        if (!thoughtID || !comment || !session_token)
            throw new Error(`Failed getting data`);

        const thought = await getThoughtById(thoughtID);

        if (!thought)
            throw new Error(`Could not find requested thought`);
        console.log("1");

        const user = await getUserBySessionToken(session_token);

        if (!user)
            throw new Error(`Could not authenticate user`);
        console.log("1");
        thought.comments.push({
            author: user,
            text: comment
        });

        thought.save();

        return res.status(200).send("Comment was added successfully");

    }
    catch (err) {
        if (err instanceof Error)
            return res.status(400).send(err.message);

    }
}