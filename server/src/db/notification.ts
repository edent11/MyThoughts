import mongoose, { ObjectId } from "mongoose";

export type Notification = {

    sender: ObjectId;
    type: string;
    timestamp: Date;
    content: string;
    wasRead: boolean;
}

const notificationSchema = new mongoose.Schema<Notification>({

    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true },
    type: { type: String, required: true },
    content: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    wasRead: { type: Boolean, default: false },
});

const NotificationModel = mongoose.model('Notifications', notificationSchema);


export const createNotificationDB = (values: Record<string, any>) => new NotificationModel(values).save();



