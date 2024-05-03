import React, { useEffect, useRef, useState } from 'react'
import { UserProfileData, useAuth } from '../contexts/UserAuth';
import useSWR, { SWRConfiguration } from 'swr';
import { useNavigate } from 'react-router-dom';
import { fetcher, fetcherData } from './shared/utils';
import Notification from './Notification';
import axios from 'axios';
import { NotificationType } from './shared/types/ThoughtTypes';


type Props = {
    className?: string
}



const NotificationsBar: React.FC<Props> = ({ className }) => {



    const user = useAuth();
    const navigate = useNavigate();

    const updateNotificationRead = async (notificationID: string): Promise<any> => {

        return axios.post('http://localhost:5000/users/notificationRead', {
            // Data you want to send in the request body
            session_token: user.getUser()?.session_token,
            notificationID: notificationID


        }).then(() => console.log("first"))


    }

    const { data: notificationsList, error, isLoading } = useSWR<NotificationType[]>('http://localhost:5000/users/notifications/',
        (url: string) => fetcherData(url, { session_token: user.getUser()?.session_token }));


    if (isLoading)
        return <div>hhh</div>



    return (
        <div className={`w-[400px] p-2 bg-gradient-to-br from-slate-200 to-slate-400  dark:from-slate-700 dark:to-slate-900 z-50 rounded-md ${className}`}>


            <div className='flex flex-col gap-2 items-center max-h-[250px] overflow-y-auto'>

                {
                    notificationsList?.map((notification: NotificationType) => {
                        return <Notification
                            notification={notification}
                            key={notification._id}
                            className={`hover:text-purple-500 ${notification.wasRead ? 'dark:bg-blue-300' : 'dark:bg-blue-100'} transition-colors delay-100`}
                            onClick={async () => {
                                await updateNotificationRead(notification._id);
                                window.location.href = `/thoughts/${notification.thoughtID}_${notification.commentID}`;

                            }
                            } />
                    })
                }


            </div>
        </div>
    )
}

export default NotificationsBar