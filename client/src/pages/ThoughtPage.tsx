import { useEffect, useRef, useState } from "react"
import Thought from "../components/card/Thought"
import { useNavigate, useParams } from "react-router-dom"
import { fetcher } from "../components/shared/utils"
import { ThoughtType } from "../components/shared/types/ThoughtTypes"
import useSWR from "swr"

type Props = {

}

const ThoughtPage: React.FC<Props> = () => {

    const { combinedParams } = useParams<{ combinedParams?: string }>();

    const navigate = useNavigate();

    const divRef = useRef<HTMLDivElement>(null);

    const [thoughtID, commentID] = (combinedParams || '').split('_');


    useEffect(() => {

        setTimeout(() => {
            if (divRef.current) {
                window.scrollTo(0, divRef.current.offsetTop + 50);
            }


        }, 2000)

    }, [])

    const { data: thought, isLoading, error } = useSWR<ThoughtType>
        (`http://localhost:5000/thoughts/${thoughtID}`, fetcher)

    if (error)
        window.location.href = "/PageNotFound";



    return (
        <div className="min-h-[calc(100vh-4rem)]" ref={divRef}>

            {
                thought &&
                <Thought thought={thought} highlightComment={commentID} />

            }


        </div>
    )
}

export default ThoughtPage;   