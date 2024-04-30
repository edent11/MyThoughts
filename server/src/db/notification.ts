import mongoose from "mongoose";
import { ObjectId } from "mongodb"

export type Notification = {

    sender: ObjectId;
    type: "tag" | "comment" | "like";
    timestamp?: Date;
    thoughtID: ObjectId;
    commentID?: ObjectId | null;
    wasRead?: boolean;
}

const notificationSchema = new mongoose.Schema<Notification>({

    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true },
    type: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    thoughtID: { type: mongoose.Schema.Types.ObjectId, required: true },
    commentID: { type: mongoose.Schema.Types.ObjectId, required: false, default: null },
    wasRead: { type: Boolean, default: false },
});

const NotificationModel = mongoose.model('Notifications', notificationSchema);


export const createNotificationDB = (values: Record<string, any>) => new NotificationModel(values).save();



