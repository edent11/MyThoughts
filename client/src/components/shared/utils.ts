import { User } from "../../contexts/UserAuth";
import { TagData, UserData } from "./types/ThoughtTypes";

export const calcTimePassed = (createdAt: Date): string => {

    var postTime: Date;
    var now: Date;

    postTime = new Date(createdAt);
    now = new Date(Date.now());

    // Calculate the difference in milliseconds
    const differenceMs = now.getTime() - postTime.getTime();

    // Convert milliseconds to days
    const differenceDays = Math.floor(differenceMs / (1000 * 60 * 60 * 24));

    if (differenceDays > 0) {
        return `${differenceDays} day${differenceDays > 1 ? 's' : ''} ago`;
    }

    // Convert milliseconds to days
    const differenceSeconds = Math.floor(differenceMs / 1000);

    // Convert seconds to minutes
    const differenceMinutes = Math.floor(differenceSeconds / 60);

    // Convert minutes to hours
    const differenceHours = Math.floor(differenceMinutes / 60);


    if (differenceHours > 0) {
        return `${differenceHours} hour${differenceHours > 1 ? 's' : ''} ago`;
    }

    if (differenceMinutes > 0) {
        return `${differenceMinutes} minute${differenceMinutes > 1 ? 's' : ''} ago`;

    }

    return `${differenceSeconds} second${differenceSeconds > 1 ? 's' : ''} ago`;

}

export const fetcher = (url: string) => fetch(url).then((res) => res.json());

export const fetcherData = async (url: string, body: any) => await fetch(url, {
    method: 'POST', // or 'PUT', 'DELETE', etc. depending on your API
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(body)
})
    .then((res) => res.json())

export const fetchFormData = async (url: string, body: FormData) => await fetch(url, {

    method: 'POST', // or 'PUT', 'DELETE', etc. depending on your API
    body: body
})

