import { UserButton } from '@clerk/nextjs'
import { IconRobot } from '@tabler/icons-react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const menuOptions = [
    {
        id: 1,
        name: 'Home',
        path: '/dashboard'
    },
    {
        id: 2,
        name: 'History',
        path: '/dashboard/history'
    },

]
function AppHeader() {
    return (
        <div className='flex items-center justify-between p-3 shadow px-10 md:px-20 lg:px-10'>
            <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                <div className="bg-[#ff6600] p-1.5 rounded-lg">
                    <IconRobot stroke={2} className="text-white h-5 w-5" />
                </div>
                <div className="flex flex-col">
                    <span className="font-bold text-xl text-neutral-900 dark:text-white leading-none">AI Recruiter</span>
                    <span className="text-[10px] font-bold text-[#ff6600] dark:text-blue-400 uppercase tracking-widest mt-0.5 bg-blue-50 dark:bg-blue-900/30 px-1.5 py-0.5 rounded-md w-fit">
                        Parth gautam Foundation
                    </span>
                </div>
            </Link>
            {/* <div className='hidden md:flex gap-12 items-center'>
                {menuOptions.map((option, index) => (
                    <Link key={index} href={option.path}>
                        <h2 className='hover:font-bold cursor-pointer transition-all'>{option.name}</h2>
                    </Link>
                ))}
            </div> */}
            <UserButton />
        </div>
    )
}

export default AppHeader