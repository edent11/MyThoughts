import React, { useEffect, useState } from 'react'
import { NotificationType } from './shared/types/ThoughtTypes'
import { calcTimePassed } from './shared/utils'
import { useFetcher } from 'react-router-dom'


type Props = {
    className?: string
    notification: NotificationType
    onClick?: () => void
}




const Notification: React.FC<Props> = ({ className, notification, onClick }) => {

    const [message, setMessage] = useState<string>('')
    var timePassed: string | undefined;

    if (notification.timestamp)
        timePassed = calcTimePassed(notification?.timestamp);

    const onLoad = () => {



        switch (notification.type) {

            case "tag": {
                if (notification.commentID)
                    setMessage(`has tagged you in his comment`);
                else setMessage(`has tagged you in his thought`);
                break;

            }

            case "like": { setMessage(`has liked your thought`); break; }

            case "comment": {

                setMessage(`has commented in your thought`);

                break;
            }
        }

    }


    useEffect(() => {

        onLoad();


    }, [])






    return (
        <div
            className={`w-full bg-purple-500 dark:bg-blue-500 dark:bg-opacity-30 flex flex-col justify-center font-info_story rounded-md ${className}`}
            onClick={onClick}>

            <div
                id="userArea"
                className="rounded-3xl p-1 select-none flex flex-row gap-2 items-center">

                <div className='flex flex-row items-center bg-blue-900 dark:bg-purple-700 bg-opacity-80 rounded-lg p-1 gap-2'>

                    <img
                        className="rounded-full size-8 ring-white ring-2"
                        src={notification?.sender.avatar}
                        alt="avatar"
                    />

                    <p className=" select-none light:text-black font-bold">
                        {notification?.sender.username}
                    </p>
                </div>

                <p className=" select-none light:text-black">
                    {message}
                </p>

                <label className=" select-none light:text-gray-700 opacity-60 text-sm">
                    {timePassed}
                </label>

            </div>
        </div>
    )
}

export default Notification