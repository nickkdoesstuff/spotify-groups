"use client"
import { CopyIcon } from "@radix-ui/react-icons"
import { Button } from "../ui/button"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { toast } from "sonner"
import { useState } from "react"

interface ShareModalProps {
    username: string
}

export default function ShareModal({ username }: ShareModalProps) {
    const [open, setOpen] = useState(false)

    const copyToClipboard = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
            setOpen(false)
            return toast("Success!", { description: 'Link copied to your clipboard' })
        } catch (error) {
            setOpen(false)
            return toast("Uh oh!", { description: 'Unable to copy link, please allow clipboard permissions or manually copy link' })
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>Share Profile</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Share Profile</DialogTitle>
                    <DialogDescription>A shareable link for anyone to view your profile</DialogDescription>
                </DialogHeader>
                <div className="flex items-center space-x-2">
                    <div className="grid flex-1 gap-2">
                        <Label htmlFor="link" className="sr-only">Link</Label>
                        <Input id="link" readOnly defaultValue={`https://sync.nickkirkwood.cc/profile/${username}`} />
                    </div>
                    
                    <Button type="submit" size="sm" className="px-3" onClick={() => copyToClipboard(`https://sync.nickkirkwood.cc/profile/${username}`)}>
                        <span className="sr-only">Copy</span>
                        <CopyIcon className="h-4 w-4" />
                    </Button>
                </div>
                <DialogFooter className="sm:justify-start">
                    <DialogClose asChild>
                        <Button type="button" variant={"secondary"}>
                            Close
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}