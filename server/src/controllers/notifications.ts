import { ObjectId } from "mongodb";
import { createNotificationDB, Notification } from "../db/notification"




export const createNotification = async (notification: Notification): Promise<any> => {


    return await createNotificationDB({
        sender: notification.sender,
        type: notification.type,
        thoughtID: notification.thoughtID,
        commentID: notification.commentID,
    });
}



