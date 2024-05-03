import express from 'express'

import {
    createThought, getThoughtById, getThoughts, getThoughtsLik,
    getLikesByThoughtID, isUserLiked, getComments, addCommentToThought,
    unLike, getCommentsNumber, createComment, addUserLike, getThoughtsByUsername,
    ThoughtsModel,
    Thought
} from '../db/thought'
import { getUserBySessionToken, getUserByUsernameDB, getUserIDByUsername } from '../db/user'

import { ObjectId } from 'mongodb';
import { createNotification } from './notifications';
import { addNotificationToUser } from './users';
import { Notification } from '../db/notification';





export const allThoughtsWithoutLikes = async (req: express.Request, res: express.Response) => {

    try {
        const { startIndex } = req.params;



        if (startIndex && +startIndex >= 0) {

            const thoughts = await getThoughts(+startIndex);

            return res.status(200).json(thoughts);
        }
        else throw new Error("Invalid index")

    }
    catch (err) {
        return res.status(404).send(err);
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
            return res.status(404).send("Thought wasn't found");

        // if (thoughtID.length != 24)
        //     return res.status(404).send("Thought wasn't found");


        const thought = await getThoughtById(thoughtID);

        if (!thought)
            return res.status(404).send("Thought wasn't found");


        return res.status(200).json(thought);
    }
    catch (err) {
        res.status(404).send(err);
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

        console.log(comments);

        return res.status(200).json(comments);
    }

    catch (error) {
        console.log(error);
    }
}




export const createNewThought = async (req: express.Request, res: express.Response) => {


    try {
        const { text, session_token, tags } = req.body;
        const image = req.file?.filename;


        var userIDTags: ObjectId[] = [];

        if (!text || !session_token)
            return res.status(400).send(`Failed getting thought's data`);

        const authorUser = await getUserBySessionToken(session_token);

        if (!authorUser)
            return res.status(400).send('Cannot authenticate user');

        const tagsArray = tags.split(',');

        await Promise.all(tagsArray.map(async (username: string) => {


            const taggedUser = await getUserByUsernameDB(username);
            if (taggedUser) {

                userIDTags.push(taggedUser._id);

            }

        }));

        const newThought = await createThought({
            user: authorUser._id,
            content:
            {
                text: text,
                imageSource: image ? `http://localhost:5000/assets/images/${image}` : undefined,
                tags: userIDTags
            },

        });

        const notificationData: Notification = {
            sender: authorUser._id,
            type: "tag",
            thoughtID: newThought._id,
            commentID: null
        }

        await Promise.all(userIDTags.map(async (userID) => {

            const notification = await createNotification(notificationData)
            await addNotificationToUser(userID, notification._id)

        }));


        return res.status(200).json(newThought).send();

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


        const { session_token, text, tags } = req.body;
        const thoughtID = req.params.thoughtID;
        var userIDTags: ObjectId[] = [];


        if (!thoughtID || !text || !session_token)
            return res.status(400).send(`Failed getting data`)

        const thought = await getThoughtById(thoughtID);

        if (!thought)
            return res.status(400).send(`Could not find requested thought`);

        const commentUser = await getUserBySessionToken(session_token);

        if (!commentUser)
            return res.status(400).send(`Could not authenticate user`);

        if (tags.length > 0) {
            for (const username of tags) {
                const taggedUser = await getUserByUsernameDB(username);
                if (taggedUser) {
                    userIDTags.push(taggedUser._id);
                }
            }
        }

        const comment = await createComment({
            user: commentUser._id,
            text: text,
            created_at: Date.now(),
            tags: userIDTags

        })

        const newComment = await addCommentToThought(thought._id, comment._id);

        const notificationData: Notification = {
            sender: commentUser._id,
            type: "tag",
            thoughtID: thought._id,
            commentID: comment._id
        }

        await Promise.all(userIDTags.map(async (userID) => {

            const notification = await createNotification(notificationData)
            await addNotificationToUser(userID, notification._id)

        }));

        if (String(thought.user) !== String(comment.user)) {

            console.log(thought.user, comment.user)

            const notificationDataComment: Notification = {
                sender: commentUser._id,
                type: "comment",
                thoughtID: thought._id,
                commentID: comment._id
            }

            const notification = await createNotification(notificationDataComment)
            await addNotificationToUser(thought.user, notification._id)
        }





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

        await addUserLike(user._id, thought.id);


        return res.status(200).send("Liked successfully");

    }
    catch (err) {
        console.log(err);

    }
}