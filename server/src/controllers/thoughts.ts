import express from 'express'

import { createThought, getThoughts, getThoughtsByUsername } from '../db/thought'
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
            return res.status(400).send('Failed getting thought data');

        const userCheck = await getUserBySessionToken(session_token);

        if (!userCheck || userCheck?.username != username)
            return res.status(400).send('Cannot authenticate user');


        const newThought = await createThought({
            user: userCheck,
            content:
            {
                header: content.header,
                body: content.body,
                imageSource: content.imageSource
            }
        });

        return res.status(200).json(newThought).send()

    } catch (error) {
        console.log(error);
    }

} 