import React, { useState } from 'react'
import { CiHeart } from "react-icons/ci";
import { FaHeart, FaCommentAlt } from "react-icons/fa";

interface Props {

}

const Thought: React.FC<Props> = () => {

    const [isLiked, setIsLiked] = useState<Boolean>(false);
    return (
        <div className='flex flex-col gap-2 font-signika backdrop-contrast-150  py-2 px-1 mt-10 bg-blue-200 w-[300px] h-[350px] shadow-lg rounded-lg'>

            <div id="picArea" className='relative text-center select-none'>

                <div className='absolute bottom-0 w-full bg-gray-900 bg-opacity-30'>
                    <div className='flex flex-row items-center justify-center gap-2'>

                        15
                        <FaHeart size={15} color='red' className='relative' onClick={() => setIsLiked(false)} />

                        <div className='font-bold'>
                            |
                        </div>
                        17
                        <FaCommentAlt size={14} className='relative'  onClick={() => setIsLiked(false)} />
                    </div>
                </div>

                <img
                    className='w-80 h-52 shadow-lg rounded-xl'
                    src="https://media.istockphoto.com/id/578801514/photo/silhouette-of-woman-on-lakeside-jetty-with-majestic-sunset-cloudscape.webp?b=1&s=170667a&w=0&k=20&c=xKw_tPce-salqERo_EB_1joWJSpnWOXLIX7Vc7fCnG4=" alt="" />


            </div>

            <div className='ml-3 select-none flex flex-row gap-2 items-center' id="userArea">
                <img className='rounded size-8 ' src="http://localhost:5000/avatars/1.png" alt="" />
                <p className=' select-none text-black font-bold' >edent</p>
                <p className=' select-none text-gray-700 opacity-60 text-sm'>15 seconds ago</p>

                <div className='cursor-pointer'>
                    {
                        isLiked ?
                            <FaHeart size={20} color='red' className='relative left-[2px] animate-ping_slow' onClick={() => setIsLiked(false)} />
                            :
                            <CiHeart size={27} color='red' className='duration-75 animate-bounce' onClick={() => setIsLiked(true)} />
                    }
                </div>



            </div>

            <div className='px-8 text-blue-900 line-clamp-3' id="textArea">

                sdfsdfsdfsdfsdfsdfsdfsdfsdfsdfsdf
                sdfsdfsdfsdfsdfsdf
                sdfsdfsdfsdfsdfsdf
                sdfsdfsdfsdfsdfsdf
            </div>


        </div>
    )
}

export default Thought