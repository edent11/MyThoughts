import express from 'express'

import { createThought, getThoughts, getThoughtsByUsername } from '../db/thought'
import { getUserBySessionToken } from '../db/user'


export const displayAllThoughts = async (req: express.Request, res: express.Response) => {

    return res.status(200).json(getThoughts()).send()

}

export const createNewThought = async (req: express.Request, res: express.Response) => {

    try {
        const { username, content, session_token } = req.body;

        if (!username || !content || !session_token)
            return res.status(400).send('Failed getting thought data');

        const userCheck = await getUserBySessionToken(session_token);

        if (!userCheck || userCheck?.username != username)
            throw new Error("Can't valid user");


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