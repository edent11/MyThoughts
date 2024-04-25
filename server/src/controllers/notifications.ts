import { ObjectId } from "mongodb";
import { createNotificationDB } from "../db/notification"



export const createNotification = async (recipient: ObjectId, sender: ObjectId, type: string, content: string): Promise<any> => {


    return await createNotificationDB({
        recipient: recipient,
        sender: sender,
        type: type,
        content: content,

    });
}

