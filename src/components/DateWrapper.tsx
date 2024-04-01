"use client"

import { createContext, useState } from "react";
import type { Dispatch, SetStateAction } from "react";

interface DateWrapperProps {
    children: React.ReactNode
}

export const DateContext = createContext<{ date: Date | null, setDate: Dispatch<SetStateAction<Date>> | null }>({ date: null, setDate: null })

export function DateWrapper({ children }: DateWrapperProps) {

    const [date, setDate] = useState(new Date())

    return (
        <DateContext.Provider value={{date, setDate}}>
            {children}
        </DateContext.Provider>
    )
}