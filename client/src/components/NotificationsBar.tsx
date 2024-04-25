import React from 'react'
import { UserProfileData, useAuth } from '../contexts/UserAuth';
import useSWR from 'swr';
import { fetcher, fetcherData } from './shared/utils';

type Props = {
    className?: string
}

const NotificationsBar: React.FC<Props> = ({ className }) => {

    const user = useAuth();
    const { data: userProfileData, isLoading, error } = useSWR<UserProfileData>
        (`http://localhost:5000/users/${username}`, fetcherData);

    return (
        <div className={`w-[300px] h-36 flex flex-col items-center bg-red-300 ${className}`}>
            NotificationsBar
        </div>
    )
}

export default NotificationsBar