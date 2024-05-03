import React from 'react'

type Props = {}

const PageNotFound = (props: Props) => {
    return (
        <div className='min-h-[calc(100vh-4rem)] text-3xl font-info_story flex items-center text-black dark:text-white'>

            <h1>Oops.. It seems that Something went wrong...Maybe you should
                <span ><a href="/newThought" className='underline mx-2 text-blue-600 dark:text-blue-300'>thought</a></span>
                about it
            </h1>

        </div>
    )
}

export default PageNotFound