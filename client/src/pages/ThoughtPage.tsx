import { useState } from "react"
import Thought from "../components/card/Thought"
import { useParams } from "react-router-dom"
import { fetcher } from "../components/shared/utils"
import { ThoughtType } from "../components/shared/types/ThoughtTypes"
import useSWR from "swr"

type Props = {

}

const ThoughtPage: React.FC<Props> = () => {

    const { thoughtID } = useParams();
    const { commentID } = useParams();


    const { data: thought, isLoading, error } = useSWR<ThoughtType>
        (`http://localhost:5000/thoughts/${thoughtID}`, fetcher)


    return (
        <div className="min-h-[calc(100vh-4rem)]">
            {
                thought &&

                <Thought thought={thought} highlightComment={commentID} />

            }

        </div>
    )
}

export default ThoughtPage;   