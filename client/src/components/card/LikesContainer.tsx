import React, { useState } from 'react'
import { FaHeart, FaCommentAlt } from "react-icons/fa";
import useSWR, { mutate } from 'swr';
import { User } from "../../contexts/UserAuth";
import Comments from "./CommentsList";
import { CommentType } from "./Comment";



interface Props {
    thoughtID: string;
}

interface likesNComments {
    likes: number;
    comments: [CommentType];
}






const LikesContainer: React.FC<Props> = ({ thoughtID }) => {

    const [showComments, setShowComments] = useState<boolean>(false)

    const fetcher = (url: string) => fetch(url).then((res) => res.json());

    const { data: likes } = useSWR<number>(`http://localhost:5000/thoughts/${thoughtID}/likes`, fetcher);
    const { data: commentsLength } = useSWR<number>(`http://localhost:5000/thoughts/${thoughtID}/commentsLength`, fetcher);


    return (
        <div>
            <div className='w-auto'>
                <div className='flex flex-row items-center justify-center gap-2'>

                    {likes}
                    <FaHeart size={15} color='red' />

                    <div className='font-bold'>
                        |
                    </div>
                    <div className='flex flex-row items-center gap-2 cursor-pointer' onClick={() => setShowComments(prevState => !prevState)}>
                        {commentsLength}
                        <FaCommentAlt size={14} className='' />



                    </div>

                </div>
                <div>
                    {
                        showComments &&
                        (<Comments thoughtID={thoughtID} />)
                    }
                </div>
            </div>

        </div>
    )
}

export default LikesContainer