import { ObjectId } from "mongodb";
import mongoose from "mongoose";


export interface User {
    username: string;
    avatar: string
}



const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    avatar: { type: String, required: true },
    authentication: {

        password: { type: String, required: true, select: false },
        salt: { type: String, required: true, select: false },
        sessionToken: { type: String, required: false, select: false },
    },

    notifications: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Notifications', select: false }]

});



export const UserModel = mongoose.model('Users', userSchema);

export const getUsers = () => UserModel.find();

export const getOtherUsers = (query: any) => UserModel.find(query);


export const getUserByUsernameDB = (username: string) => UserModel.findOne({ 'username': username });

export const addNotification = (uid: ObjectId, notificationId: ObjectId) => UserModel.updateOne({ _id: uid },
    { $push: { notifications: notificationId } });

export const getUserBySessionToken = (sessionToken: string) => UserModel.findOne({ 'authentication.sessionToken': sessionToken });

export const getUserIDByUsername = (username: string) => UserModel.findOne({ 'username': username }).select('_id');


export const getUserById = (uid: string) => UserModel.findById(uid);

export const createUser = (values: Record<string, any>) => new UserModel(values)
    .save().then((user) => user.toObject());

export const deleteUserById = (uid: string) => UserModel.findOneAndDelete({ _id: uid });

export const updateUserById = (uid: string, values: Record<string, any>) => UserModel.findByIdAndUpdate(uid, values);


export const getUserNotificationsDB = (uid: ObjectId) => UserModel.findById(uid).select("notifications").populate("notifications").populate("notifications.sender")