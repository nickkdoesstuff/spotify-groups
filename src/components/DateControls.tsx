"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "./ui/button"
import { useContext } from "react"
import { DateContext } from "./DateWrapper"
import { addWeeks, endOfWeek, format, startOfWeek, subWeeks } from "date-fns"


export function DateControls() {

    const {date, setDate} = useContext(DateContext)

    function subtractDate() {
        if (setDate) {
            setDate(prevDate => subWeeks(prevDate, 1))
        }
    }

    function addDate() {
        if(setDate) {
            setDate(prevDate => addWeeks(prevDate, 1))
        }
    }

    return (
        <div className="flex gap-2 col-span-1 sm:col-span-2">
            <Button onClick={subtractDate} size={'icon'} variant={"outline"}><ChevronLeft className="h-5 w-5" /></Button>
            <div className="border w-full rounded-md flex items-center justify-center">
                <p className="text-xs text-muted-foreground text-center">{format(startOfWeek(date!, { weekStartsOn: 1 }), 'do MMMM')} - {format(endOfWeek(date!, { weekStartsOn: 1 }), 'do MMMM')}</p>
            </div>
            <Button disabled={addWeeks(date!, 1) > new Date()} onClick={addDate} size={'icon'} variant={"outline"}><ChevronRight className="h-5 w-5" /></Button>
        </div>
    )
}