"use client"
import { BarList } from "@tremor/react"

interface TimesArray {
    name: string,
    value: number
}

interface BarGraphProps {
    times: TimesArray[]
}

export default function BarGraph({ times }: BarGraphProps) {
    const data = times.map(time => {
        return {
            name: time.name,
            value: Math.floor(time.value / 60000)
        }
    })

    return <BarList data={data} />
}