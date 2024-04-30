import { ObjectId } from "mongodb"
import { User } from "../../../contexts/UserAuth"

export type SubmitComment = {
    session_token: string,
    text: string
    tags: string[],

}

export type TagData = {
    session_token: string | undefined,
    usernameSubstring?: string,
    already_tagged?: string[] | null
}

export type UserData = {
    session_token: string | undefined;
    text?: string;
}

export type ThoughtType = {
    _id: string
    user: User
    content: {
        text: string
        imageSource: string
        tags: [{ username: string }]

    }
    createdAt: Date

}

export type SubmitThought = SubmitComment & {

    image: File | null

}

export type CommentType = {
    _id: string
    user: User
    text: string
    createdAt: Date
    tags: [{ username: string }]
}

export type NotificationType = {
    _id: string
    sender: User;
    type: "tag" | "comment" | "like";
    timestamp?: Date;
    thoughtID: string;
    commentID?: string | null;
    wasRead?: boolean;
}


