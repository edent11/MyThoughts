import mongoose, { Model, Types } from "mongoose";
import { User, getUserBySessionToken } from "./user";
import { ObjectId } from "mongodb";


export interface Comment {
    user: mongoose.Schema.Types.ObjectId;
    text: string;
    createdAt: Date;
    tags: [mongoose.Schema.Types.ObjectId];

}

export interface Thought {
    user: mongoose.Schema.Types.ObjectId;
    createdAt: Date;
    content: {
        text: string;
        imageSource: string | null;
        tags: [mongoose.Schema.Types.ObjectId]
    }

    comments: [mongoose.Schema.Types.ObjectId];
    likes: [mongoose.Schema.Types.ObjectId];


}

const THOUGHTS_THRESHOLD: number = 2;

// Extend the Document interface to include the fields from the Thought interface
interface ThoughtDocument extends Thought, Document { }

const commentSchema = new mongoose.Schema<Comment>({

    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Users',

    },
    text: {
        type: String,
        required: true
    },

    createdAt: {
        type: Date,
        default: Date.now
    },

    tags: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Users', default: [] }],

});



const thoughtSchema = new mongoose.Schema<ThoughtDocument>({

    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Users'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    content: {
        text: { type: String, required: true },
        imageSource: { type: String, required: false },
        tags: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Users', default: [] }],
    },
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comments', default: [] },],

    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Users', default: [] }],



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

thoughtSchema.path('likes').validate(duplicateValues);

export const ThoughtsModel: Model<ThoughtDocument> = mongoose.model<ThoughtDocument>('Thoughts', thoughtSchema);

export const CommentModel = mongoose.model('Comments', commentSchema);







export const getThoughts = (startIndex: number) => ThoughtsModel.find().select('-comments -likes').populate('user').populate({
    path: 'content.tags', // Specify the field to populate
    select: '-_id username' // Specify the fields to include from the populated documents
}).sort({ createdAt: 1 }).limit(THOUGHTS_THRESHOLD).skip(startIndex);


export const getUserCommentsCountDB = (userID: ObjectId): Promise<Number> => ThoughtsModel.aggregate([

    // Unwind the comments array to create a separate document for each comment
    { $unwind: '$comments' },
    // Match comments made by the user
    { $match: { user: userID } },
    // Count the number of comments made by the user
    { $count: 'totalCommentsMade' }

]).then((result) => result[0] ? result[0].totalCommentsMade : 0)
    .catch(error => error);


export const getUserCommentsReceivedCountDB = (userID: ObjectId): Promise<Number> => ThoughtsModel.aggregate([

    { $match: { user: userID } },
    // Unwind the comments array to create a separate document for each comment
    { $unwind: '$comments' },
    // Match comments made by the user
    { $match: { user: userID } },
    // Count the number of comments made by the user
    { $count: 'totalCommentsMade' }

]).then((result) => result[0] ? result[0].totalCommentsMade : 0)
    .catch(error => error);

export const getUserLikesCountDB = (userID: ObjectId): Promise<Number> => ThoughtsModel.aggregate([
    // Match thoughts where the user has liked
    { $match: { likes: userID } },
    // Unwind the likes array to create a separate document for each like
    { $unwind: '$likes' },
    // Group by thought ID to count the number of distinct thoughts liked by the user
    { $group: { _id: '$_id' } },
    // Count the number of distinct thoughts liked by the user
    { $count: 'totalThoughtsLiked' }

]).then((result) => result[0] ? result[0].totalThoughtsLiked : 0)
    .catch(error => error);


export const getUserLikesReceivedCountDB = (userID: ObjectId): Promise<Number> => ThoughtsModel.aggregate([
    // Match thoughts where the user has liked
    { $match: { user: userID } },
    // Unwind the likes array to create a separate document for each like
    { $unwind: '$likes' },
    // Count the number of distinct thoughts liked by the user
    { $count: 'totalThoughtsLiked' }

]).then((result) => result[0] ? result[0].totalThoughtsLiked : 0)
    .catch(error => error);

export const getUserTaggedCountDB = (userID: ObjectId): Promise<Number> => ThoughtsModel.aggregate([
    // Match thoughts where the user has liked
    { $match: { 'content.tags': userID } },
    // Unwind the likes array to create a separate document for each like
    { $unwind: '$likes' },
    // Group by thought ID to count the number of distinct thoughts liked by the user
    { $group: { _id: '$_id' } },
    // Count the number of distinct thoughts liked by the user
    { $count: 'totalTagsCount' }

]).then((result) => result[0] ? result[0].totalTagsCount : 0)
    .catch(error => error);



export const getUserThoughtsCountDB = (userID: ObjectId): Promise<Number> => ThoughtsModel.aggregate([
    // Match thoughts created by the user
    { $match: { user: userID } },
    // Count the number of thoughts created by the user
    { $count: 'totalThoughtsCreated' }

]).then((result) => result[0] ? result[0].totalThoughtsCreated : 0)
    .catch(error => error);



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

export const getComments = async (thoughtID: string) => ThoughtsModel.findById(thoughtID).populate('comments').then(thought => {

    const populatedComments = CommentModel.populate(thought?.comments, { path: 'user' }).then(comments => {

        return CommentModel.populate(comments, {
            path: 'tags', // Specify the field to populate
            select: '-_id username' // Specify the fields to include from the populated documents
        }).then(comments => {
            //console.log(comments)
            return comments;
        })
    });





    return populatedComments;

}).catch(error => console.log(error));



export const getThoughtsByUsername = (username: string) => ThoughtsModel.findOne({ 'user.username': username });

export const getThoughtsLik = () => ThoughtsModel.find({ likes: undefined });


export const getThoughtById = (tid: string) => ThoughtsModel.findById(tid).select('-comments -likes').populate('user').populate({
    path: 'content.tags', // Specify the field to populate
    select: '-_id username' // Specify the fields to include from the populated documents
});;


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


