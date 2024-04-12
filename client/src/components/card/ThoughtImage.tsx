import React, { useState } from 'react'
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { IoCloseCircle } from "react-icons/io5";

type Props = {
    src: string,
    className?: string
    alt?: string
}

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

const ThoughtImage: React.FC<Props> = ({ src, className, alt }) => {

    const [isActive, setIsActive] = useState<boolean>(false);
    const onClickHandler = () => {

        setIsActive(prevState => !prevState);
    }

    const handleOpen = () => setIsActive(true);
    const handleClose = () => setIsActive(false);

    return (
        <>
            <img
                src={src}
                alt={alt}
                onClick={onClickHandler}
                className={` cursor-pointer ${isActive ? 'absolute w-[90vw] h-[90vh]' : className}`} />

            <Modal
                open={isActive}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                className='flex align-middle '
            >
                <div className='relative w-[70vw] h-[90vh] m-auto'>

                    <img
                        src={src}
                        alt={alt}
                        onClick={onClickHandler}
                        className='w-full h-full ring-4 ring-purple-400'
                    />

                    <IoCloseCircle color='white' size={30} className='absolute bg-purple-500 rounded-full right-4 top-4 cursor-pointer' onClick={handleClose} />
                </div>



            </Modal>
        </>

    )
}

export default ThoughtImage