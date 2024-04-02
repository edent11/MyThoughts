import React, { useState } from 'react'



type Props = {
    className?: string;
    onClick?: () => void | Promise<void> | undefined;
    isLoading: boolean;
    buttonText: string;
}


const LoadingButton: React.FC<Props> = ({ className, onClick, isLoading, buttonText }) => {

    const [spin, setSpin] = useState<Boolean>(false);

    const handleClick = () => {
        setSpin(true);
        if (onClick)
            onClick();
    };

    return (
        <div className=''>
            <button
                className={`relative inline-flex gap-4 items-center justify-center px-4 py-2 border
                 border-transparent text-base font-medium rounded-md  ${className} ${isLoading ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                onClick={handleClick}
                disabled={isLoading}
            >
                {

                    isLoading && <div

                        className="inline-block h-5 w-5 animate-spin rounded-full border-4 border-solid
                         border-current border-r-transparent align-[-0.125em] text-primary motion-reduce:animate-[spin_1.5s_linear_infinite]"
                        role="status">

                    </div>
                }

                {isLoading ? '' : buttonText}
            </button>
        </div>
    )
}

export default LoadingButton
