import React, { useEffect, useRef, useState } from 'react'
import { UserProfileData, useAuth } from '../contexts/UserAuth';
import useSWR from 'swr';
import { useNavigate } from 'react-router-dom';
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
    const navigate = useNavigate();

    axios.post('http://localhost:5000/users/notifications/', {
        // Data you want to send in the request body
        session_token: user.getUser()?.session_token,

    }).then(response => setNotificationsList(response.data))

    return (
        <div className={`w-[400px] p-2 bg-gradient-to-br from-slate-200 to-slate-400  dark:from-slate-700 dark:to-slate-900 z-50 rounded-md ${className}`}>


            <div className='flex flex-col gap-2 items-center'>

                {
                    notificationsList.map((notification: NotificationType, index) => {
                        return <Notification
                            notification={notification}
                            key={notification._id}
                            className='hover:text-purple-500 transition-colors delay-100'
                            onClick={() => navigate(`/thoughts/${notification.thoughtID}`)} />
                    })
                }


            </div>
        </div>
    )
}

export default NotificationsBar