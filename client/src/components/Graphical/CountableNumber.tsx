import React, { useState } from 'react'
import Stack from '@mui/material/Stack';
import { Gauge, gaugeClasses } from '@mui/x-charts/Gauge';
import { fetcher } from '../shared/utils';
import useSWR from 'swr';

type Props = {
    className?: string
    value: number

}




const CountableNumber: React.FC<Props> = ({ className, value }) => {

    const [countValue, setCountValue] = useState<number>(0)
    const speed: number = value && value < 10 ? 200 : value && value < 30 ? 100 : 50;

    const startTimeout = () => {
        const timeoutId = setTimeout(() => {
            setCountValue(countValue + 1);
        }, speed); // Change 5000 to the desired timeout duration in milliseconds

        if (countValue == value)
            clearTimeout(timeoutId)
    };


    startTimeout();






    return (
        <>
            <p className={`${className}`}>{countValue}</p>
        </>
    )
}


export default CountableNumber