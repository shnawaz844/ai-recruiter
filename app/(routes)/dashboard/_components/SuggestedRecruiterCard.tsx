import React from 'react'
import { recruiterAgent } from './RecruiterCard'
import Image from 'next/image'

type props = {
    recruiterAgent: recruiterAgent,             // recruiter data to display
    setSelectedRecruiter: (recruiter: recruiterAgent) => void, // function to set selected recruiter
    selectedRecruiter: recruiterAgent          // currently selected recruiter
}

/**
 * SuggestedRecruiterCard Component
 * 
 * Displays a clickable card for a suggested recruiter.
 * Highlights the card if it is the currently selected recruiter.
 */
function SuggestedRecruiterCard({ recruiterAgent, setSelectedRecruiter, selectedRecruiter }: props) {
    return (
        <div
            className={`flex flex-col items-center
            border rounded-2xl shadow p-5
            hover:border-blue-500 cursor-pointer
            ${selectedRecruiter?.id == recruiterAgent?.id && 'border-blue-500'}`}
            onClick={() => setSelectedRecruiter(recruiterAgent)} // select this recruiter on click
        >
            {/* 👤 Recruiter image */}
            <Image
                src={recruiterAgent?.image}
                alt={recruiterAgent?.specialist}
                width={70}
                height={70}
                className='w-[50px] h-[50px] rounded-4xl object-cover'
            />

            {/* 💼 Recruiter name */}
            <h2 className='font-bold text-sm text-center'>
                {recruiterAgent?.specialist}
            </h2>

            {/* 📝 Short description */}
            <p className='text-xs text-center line-clamp-2'>
                {recruiterAgent?.description}
            </p>
        </div>
    )
}

export default SuggestedRecruiterCard
