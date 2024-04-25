import React, { useState } from 'react'
import Stack from '@mui/material/Stack';
import { Gauge, gaugeClasses } from '@mui/x-charts/Gauge';

type Props = {
    width: number,
    height: number,
    value: number
}

const AnimatedGauge: React.FC<Props> = ({ width, height, value }) => {


    const [gaugeValue, setGaugeValue] = useState<number>(0);
    const maxValue: number = value < 10 ? 10 : value < 30 ? 50 : 100;
    const speed: number = value < 10 ? 200 : value < 30 ? 50 : 100;

    const startTimeout = () => {
        const timeoutId = setTimeout(() => {
            setGaugeValue(gaugeValue + 1);
        }, speed); // Change 5000 to the desired timeout duration in milliseconds

        if (gaugeValue >= value)
            clearTimeout(timeoutId)
    };

    startTimeout();

    return (
        <>
            <Gauge

                value={gaugeValue}
                valueMax={maxValue}
                cornerRadius="50%"
                width={width}
                height={height}
                sx={(theme) => ({
                    [`& .${gaugeClasses.valueText}`]: {
                        fontSize: 30,
                    },
                    [`& .${gaugeClasses.valueArc}`]: {
                        fill: 'purple',
                    },
                    [`& .${gaugeClasses.referenceArc}`]: {
                        fill: "theme.palette.text.disabled",
                    },
                })}
            />
        </>
    )
}


export default AnimatedGauge