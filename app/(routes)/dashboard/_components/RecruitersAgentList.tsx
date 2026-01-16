import { AIRecruiterAgents } from '@/shared/list'
import React from 'react'
import RecruiterCard from './RecruiterCard'

/**
 * RecruitersAgentList Component
 * Displays a grid of AI-powered recruiter agent cards using data from AIRecruiterAgents.
 */
function RecruitersAgentList() {
    return (
        <div className='mt-10'>
            {/* 💼 Section Title */}
            <h2 className='font-bold text-xl'>AI Recruitment Specialists</h2>

            {/* 👔 Responsive grid layout for recruiter cards */}
            <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8 mt-5'>
                {AIRecruiterAgents.map((recruiter, index) => (
                    <div key={index}>
                        <RecruiterCard recruiterAgent={recruiter} />
                    </div>
                ))}
            </div>
        </div>
    )
}

export default RecruitersAgentList
