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

export const getNotificationDB = (notificationID: string) => NotificationModel.findById(notificationID)


export const checkIfNotificationReadDB = (notificationID: ObjectId): Promise<boolean> => NotificationModel.findById(notificationID)
    .then((notification: Notification | null) => {
        if (!notification) {
            console.log('Notification not found');
            return false; // Return false if notification is not found
        }
        return notification.wasRead; // Return the value of the wasRead property
    })
    .then((wasRead: boolean | undefined) => {
        if (wasRead === undefined) {
            console.log('Notification wasRead property is undefined');
            return false;
        }
        return wasRead; // Return the value of wasRead
    })
    .catch(error => {
        console.error('Error:', error);
        return false; // Return false if there's an error
    });


export const setNotificationReadDB = (notificationID: ObjectId): Promise<Boolean> => NotificationModel.updateOne(
    { _id: notificationID }, // Match the notification with the given ID
    { $set: { wasRead: true } } // Set the wasRead property to true for the matched notification
)

    .then((result) => result)
    .catch(error => error);







