import React, { useState } from 'react'
import { useParams } from 'react-router-dom';
import { User, UserProfileData } from '../contexts/UserAuth'
import useSWR from 'swr'
import { fetcher } from '../components/shared/utils';
import { FaRegCommentAlt } from "react-icons/fa";
import CountableNumber from '../components/Graphical/CountableNumber';
import { FaUserTag } from "react-icons/fa6";
import { FcLike } from "react-icons/fc";
import { BsFillPostcardFill } from "react-icons/bs";
// const settings = {
//     width: 200,
//     height: 200,
//     value: 10,
// };



type Props = {}

const UserPage: React.FC<Props> = () => {

    const [settings, setSettings] = useState<{ width: number, height: number, value: number }>({
        width: 200,
        height: 200,
        value: 10
    })


    const { username } = useParams();

    const { data: userProfileData, isLoading, error } = useSWR<UserProfileData>
        (`http://localhost:5000/users/${username}`, fetcher);



    return (
        <div className={`h-[calc(100vh-4rem)] w-full flex flex-row justify-center font-info_story`}>


            <div id='comments&thoughts' className=' bg-gradient-to-br text-2xl  dark:from-blue-800 to-blue-950 flex flex-col justify-center items-center flex-1 divide-y-4 divide-purple-500'>

                <div className=' flex-1 w-full flex gap-2 flex-col items-center justify-center '>
                    <p>Thoughts</p>

                    <div className=' bg-blue-500 size-[120px] flex flex-col items-center justify-center gap-2 rounded-full'>
                        <BsFillPostcardFill size={50} />

                        <CountableNumber value={userProfileData?.thoughts ? userProfileData?.thoughts : 0} className='font-bold text-2xl' />


                    </div>



                    {/* <AnimatedGauge width={150} height={150} value={5} /> */}

                </div>

                <div id='comments&thoughts' className=' bg-gradient-to-br text-2xl dark:from-blue-900 to-blue-950 w-full flex flex-col gap-4 justify-center items-center flex-1 '>

                    <p>Comments</p>
                    <div className='bg-blue-500 size-[120px] flex flex-col items-center justify-center gap-2 rounded-full'>



                        <FaRegCommentAlt size={50} />

                        <CountableNumber value={userProfileData?.commentsReceived ? userProfileData?.commentsReceived : 0} className='font-bold text-2xl' />


                    </div>

                </div>


            </div>


            <div className='bg-gradient-to-br  from-blue-900 to-blue-950 font-bold text-2xl flex flex-col flex-1
             h-full rounded-lg shadow-lg'>

                <div className='flex flex-col flex-1 items-center justify-center gap-4 w-full'>

                    <img src={userProfileData?.user.avatar ? userProfileData?.user.avatar : "http://localhost:5000/assets/images/no-user.png"}
                        alt="" className='size-[150px] rounded-full' />

                    <p className='text-strong '>{userProfileData?.user.username}</p>

                </div>

                <div className='flex flex-row flex-1 justify-center items-center gap-2 '>
                    <div className='flex w-[100px] flex-col gap-2 justify-center items-center'>
                        <FcLike size={50} />
                        Liked
                        <CountableNumber value={userProfileData?.comments ? userProfileData?.comments : 0} className='font-bold text-2xl' />
                    </div>

                    <div className='flex w-[100px] flex-col gap-2 justify-center items-center translate-y-[4px]'>
                        <FaRegCommentAlt size={43} />
                        Commented
                        <CountableNumber value={userProfileData?.comments ? userProfileData?.comments : 0} className='font-bold text-2xl' />
                    </div>


                </div>
            </div>



            <div id='comments&thoughts' className=' bg-gradient-to-br text-2xl  dark:from-blue-900 dark:to-blue-950 flex flex-col
             justify-center items-center flex-1  divide-y-4 divide-purple-500'>

                <div className=' flex-1 w-full flex flex-col gap-4 items-center justify-center '>

                    <p>Likes</p>

                    <div className=' bg-blue-500 size-[120px] flex flex-col items-center justify-center gap-2 rounded-full'>

                        <FcLike size={50} />

                        <CountableNumber value={userProfileData?.likesReceived ? userProfileData?.likesReceived : 0} className='font-bold text-2xl' />




                    </div>



                </div>

                <div id='comments&thoughts' className=' bg-gradient-to-br text-2xl dark:from-blue-900 dark:to-blue-950 w-full flex flex-col gap-4
                 justify-center items-center flex-1 '>

                    <p>Tagged</p>

                    <div className='bg-blue-500 size-[120px] flex flex-col items-center justify-center gap-2 rounded-full'>

                        <FaUserTag size={50} />
                        <CountableNumber value={userProfileData?.tags ? userProfileData?.tags : 0} className='font-bold text-2xl' />


                    </div>

                </div>


            </div>




        </div>
    )
}

export default UserPage