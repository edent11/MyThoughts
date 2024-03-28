import mongoose from "mongoose";
import { User } from "./user";
import { ObjectId } from "mongodb";


interface Comment {
    user: mongoose.Schema.Types.ObjectId;
    text: string;
    createdAt: Date;
}

// interface Like {
//     number: Number;
//     users: [User];

// }

const commentSchema = new mongoose.Schema<Comment>({

    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'users',

    },
    text: {
        type: String,
        required: true
    },

    createdAt: {
        type: Date,
        default: Date.now
    }

});

// const likeSchema = new mongoose.Schema<Like>({

//     number: {
//         type: Number,
//         default: 0
//     },
//     users: [User],

// });

const thoughtSchema = new mongoose.Schema({

    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'users'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    content: {
        body: { type: String, required: true },
        imageSource: { type: String, required: false },
    },
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],

    likes: {
        type: Number,
        default: 0
    }
});



export const ThoughtsModel = mongoose.model('thoughts', thoughtSchema);

export const CommentModel = mongoose.model('Comment', commentSchema);

export const getThoughts = () => ThoughtsModel.find().populate('user');
export const getThoughtLikes = (thoughtID: string) => ThoughtsModel.findById(thoughtID).select('likes');


export const getCommentsNumber = (thoughtID: string) => ThoughtsModel.findById(thoughtID).then(thought => {

    if (thought)
        return thought?.comments.length;

    throw new Error('Cant find thought');

}).catch(error => console.log(error));

export const getLikes = (thoughtID: string) => ThoughtsModel.findById(thoughtID).then(thought => {

    try {
        if (thought)
            return thought?.likes;
        throw new Error('Cant find thought');
    }

    catch (error) {
        console.log(error);
    }
});

export const getComments = (thoughtID: string) => ThoughtsModel.findById(thoughtID).populate('comments').then(thought => {

    const populatedComments = CommentModel.populate(thought?.comments, { path: 'user' }).then(comments => {
        return comments;
    });

    return populatedComments;

}).catch(error => console.log(error));

// export const getAllThoughtsID = () => ThoughtsModel.find().select('_id');

export const getThoughtsByUsername = (username: string) => ThoughtsModel.findOne({ 'user.username': username });


// export const getThoughtByKeyword = (sessionToken: string) => UserModel.findOne({ 'authentication.sessionToken': sessionToken });

export const getThoughtById = (tid: string) => ThoughtsModel.findById(tid);


export const createThought = (values: Record<string, any>) => new ThoughtsModel(values)
    .save().then((thought) => thought.toObject());


export const createComment = (values: Record<string, any>) => new CommentModel(values)
    .save().then((comment) => comment.toObject());

export const addCommentToThought = (thoughtID: ObjectId, commentID: ObjectId) => {
    return ThoughtsModel.findOneAndUpdate(
        { _id: thoughtID }, // Replace with the ObjectId of the post
        { $push: { comments: commentID } }, // Push the ID of the new comment to the comments array
        { new: true }) // Return the updated post document after the update operation
}





// export const deleteUserById = (uid: string) => UserModel.findOneAndDelete({ _id: uid });

// export const updateUserById = (uid: string, values: Record<string, any>) => UserModel.findByIdAndUpdate(uid, values);
