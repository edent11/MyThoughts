import React, { useEffect, useRef, useState } from 'react'
import { UserProfileData, useAuth } from '../contexts/UserAuth';
import useSWR from 'swr';
import { fetcher, fetcherData } from './shared/utils';
import Notification from './Notification';
import axios from 'axios';
import { NotificationType } from './shared/types/ThoughtTypes';

type Props = {
    className?: string
}



const NotificationsBar: React.FC<Props> = ({ className }) => {

    const [notificationsList, setNotificationsList] = useState<NotificationType[]>([])

    const user = useAuth();
    const options = {
        url: 'http://localhost:5000/users/notifications',
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json;charset=UTF-8'
        },
        userData: {
            session_token: user?.getUser()?.session_token
        }
    };

    axios(options)
        .then(response => {
            setNotificationsList(response.data);
        });

    return (
        <div className={`w-[400px] bg-gradient-to-br from-slate-200 to-slate-400  dark:from-slate-700 dark:to-slate-900 z-50 rounded-md ${className}`}>


            NotificationsBar

            <div className='flex flex-col gap-2 items-center mb-4'>

                {
                    notificationsList.map((notification: NotificationType, index) => {
                        return <Notification notification={notification} key={notification._id} />
                    })
                }


            </div>
        </div>
    )
}

export default NotificationsBar