import mongoose, { Model, Types } from "mongoose";
import { User, getUserBySessionToken } from "./user";
import { ObjectId } from "mongodb";


interface Comment {
    user: mongoose.Schema.Types.ObjectId;
    text: string;
    createdAt: Date;
    likes: [mongoose.Schema.Types.ObjectId];

}

interface Thought {
    user: mongoose.Schema.Types.ObjectId;
    createdAt: Date;
    content: {
        text: string;
        imageSource: string;
    }

    comments: [mongoose.Schema.Types.ObjectId];
    likes: [mongoose.Schema.Types.ObjectId];
    uniqueArrayField: [string]
}

// Extend the Document interface to include the fields from the Thought interface
interface ThoughtDocument extends Thought, Document { }

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



const thoughtSchema = new mongoose.Schema<ThoughtDocument>({

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
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment', default: [] }],

    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'users', default: [] }],

});


// Custom validator function
const duplicateValues = (likes: mongoose.Schema.Types.ObjectId[]) => {

    const stringLikes = likes.map((objectId) => objectId.toString());

    const uniqueValues = new Set(stringLikes);

    console.log(uniqueValues)
    // Compare the size of the Set with the original array length
    if (uniqueValues.size === likes.length)
        return true;
    return false;

};

export const ThoughtsModel: Model<ThoughtDocument> = mongoose.model<ThoughtDocument>('thoughts', thoughtSchema);

thoughtSchema.path('likes').validate(duplicateValues);

export const CommentModel = mongoose.model('Comment', commentSchema);







export const getThoughts = () => ThoughtsModel.find().populate('user');


// .then(async thoughts => {

//     const user = await getUserBySessionToken(session_token);
//     let thoughtsWithLikes: [ThoughtDocument, boolean];
//     if (!user)
//         throw new Error("Error getting user");

//     thoughts.map(thought => {
//         if (thought.likes.includes(user.id))
//             console.log('yes');
//     })

// });

// export const likedThoughts = (userID: string) => ThoughtsModel.find({ likes: { $in: [userID] } }).select('_id');



export const isUserLiked = (thoughtID: string, userID: string) => ThoughtsModel.findOne({ _id: thoughtID, likes: userID });

export const getCommentsNumber = (thoughtID: string) => ThoughtsModel.findById(thoughtID).then(thought => {

    if (thought)
        return thought?.comments.length;

    throw new Error('Cant find thought');

}).catch(error => console.log(error));

export const getLikesByThoughtID = (thoughtID: ObjectId) => ThoughtsModel.aggregate([

    { $match: { _id: thoughtID } }, // Match the thought by its ID
    { $project: { likesCount: { $size: '$likes' } } }


]).then(result => {

    if (result.length > 0)
        return result[0].likesCount;
    return 0;



})
export const addUserLike = (userID: ObjectId, thoughtID: string) => ThoughtsModel.updateOne({ _id: thoughtID }, // Match the thought by its ID
    { $addToSet: { likes: userID } }).then(result => {

        if (result.modifiedCount == 0)
            throw new Error('Could not add like');

    });


export const unLike = (thoughtID: ObjectId, userID: ObjectId) => ThoughtsModel.updateOne({ _id: thoughtID }, // Match the post by its ID
    { $pull: { likes: userID } })
    .then(result => {

        if (result.modifiedCount == 0)
            throw new Error('Could not make unlike')
    })

export const getComments = (thoughtID: string) => ThoughtsModel.findById(thoughtID).populate('comments').then(thought => {

    const populatedComments = CommentModel.populate(thought?.comments, { path: 'user' }).then(comments => {
        return comments;
    });

    return populatedComments;

}).catch(error => console.log(error));

// export const isUserLikedThought = (thoughtID: string, userID: string) => ThoughtsModel.findById(thoughtID).select('likes').then(thought => {

//     const populatedComments = CommentModel.populate(thought?.comments, { path: 'user' }).then(comments => {
//         return comments;
//     });

//     return populatedComments;

// }).catch(error => console.log(error));




// export const getAllThoughtsID = () => ThoughtsModel.find().select('_id');

export const getThoughtsByUsername = (username: string) => ThoughtsModel.findOne({ 'user.username': username });

export const getThoughtsLik = () => ThoughtsModel.find({ likes: undefined });


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

// export const addLikeToThought = (thoughtID: ObjectId, userID: ObjectId) => {
//     return ThoughtsModel.findOneAndUpdate(
//         { _id: thoughtID }, // Replace with the ObjectId of the post
//         { $push: { likes: userID } }, // Push the ID of the new comment to the comments array
//         { new: true, runValidators: true, context: 'query' })
//     // Return the updated post document after the update operation
// }




// export const deleteUserById = (uid: string) => UserModel.findOneAndDelete({ _id: uid });

// export const updateUserById = (uid: string, values: Record<string, any>) => UserModel.findByIdAndUpdate(uid, values);
