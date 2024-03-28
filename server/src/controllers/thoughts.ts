import express from 'express'

import { createThought, getThoughtById, getThoughts, getLikes, getThoughtsByUsername, getComments, getCommentsNumber } from '../db/thought'
import { getUserBySessionToken } from '../db/user'


//wit
export const allThoughtsWithoutLikes = async (req: express.Request, res: express.Response) => {


    const thoughts = await getThoughts()
        .then(data => {
            return data;
        });
    return res.status(200).json(thoughts);


}

export const getThoughtLikesByID = async (req: express.Request, res: express.Response) => {


    const thoughtID = req.params.thoughtID;

    const likes = await getLikes(thoughtID)
        .then(data => {
            return data;
        });
    return res.status(200).json(likes);


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

    const thoughtID = req.params.thoughtID;
    const comments = await getComments(thoughtID)
        .then(data => {
            return data;
        });

    return res.status(200).json(comments);
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
            user: userCheck,
            content:
            {
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

        const thoughtID = req.params.thoughtID;

        if (!thoughtID)
            return res.status(400).send(`Failed getting  data`);

        const thought = await getThoughtById(thoughtID);

        if (!thought)
            return res.status(400).send(`Could not find requested thought`);

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

        const thoughtID = req.params.thoughtID;

        if (!thoughtID)
            return res.status(400).send(`Failed getting  data`);

        const thought = await getThoughtById(thoughtID);

        if (!thought)
            return res.status(400).send(`Could not find requested thought`);

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


        const { session_token, text } = req.body;
        const thoughtID = req.params.thoughtID;

        if (!thoughtID || !text || !session_token)
            return res.status(400).send(`Failed getting data`);

        const thought = await getThoughtById(thoughtID);

        if (!thought)
            return res.status(400).send(`Could not find requested thought`);

        const user = await getUserBySessionToken(session_token);

        if (!user)
            return res.status(400).send(`Could not authenticate user`);

        thought.comments.push({
            author: user,
            text: text,
            createdAt: Date.now()
        });

        thought.save();

        return res.status(200).send(thought);

    }
    catch (err) {
        if (err instanceof Error)
            return res.status(400).send(err.message);

    }
}