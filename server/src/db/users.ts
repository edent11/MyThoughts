import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    avatar: { type: Number, required: true },
    authentication: {

        password: { type: String, required: true, select: false },
        salt: { type: String, required: true, select: false },
        sessionToken: { type: String, required: false, select: false },
    }
});

export const UserModel = mongoose.model('users', userSchema);

export const getUsers = () => UserModel.find();

export const getUserByUsername = (username: string) => UserModel.findOne({ username });



export const getUserBySessionToken = (sessionToken: string) => UserModel.findOne({ 'authentication.sessionToken': sessionToken });

export const getUserById = (uid: string) => UserModel.findById(uid);


export const createUser = (values: Record<string, any>) => new UserModel(values)
    .save().then((user) => user.toObject());


export const deleteUserById = (uid: string) => UserModel.findOneAndDelete({ _id: uid });

export const updateUserById = (uid: string, values: Record<string, any>) => UserModel.findByIdAndUpdate(uid, values);
