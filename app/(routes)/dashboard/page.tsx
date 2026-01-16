import React from 'react'
import HistoryList from './_components/HistoryList'
import { Button } from '@/components/ui/button'
import RecruitersAgentList from './_components/RecruitersAgentList'
import AddNewSessionDialog from './_components/AddNewSessionDialog'

function Dashboard() {
    return (
        <div className='min-h-screen'>
            {/* Hero Section with Gradient Background */}
            <div className='bg-gradient-to-r from-primary/10 via-primary/5 to-transparent rounded-3xl p-8 mb-8'>
                <div className='flex justify-between items-center'>
                    <div>
                        <h2 className='font-bold text-3xl bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent'>
                            My Dashboard
                        </h2>
                        <p className='text-gray-500 mt-2'>
                            Manage your recruitment sessions and connect with AI recruiters
                        </p>
                    </div>
                    <AddNewSessionDialog />
                </div>
            </div>

            {/* Recent Sessions Section */}
            <div className='mb-10'>
                <div className='flex items-center gap-3 mb-4'>
                    <div className='h-8 w-1 bg-primary rounded-full'></div>
                    <h3 className='font-semibold text-xl'>Recent Sessions</h3>
                </div>
                <HistoryList />
            </div>

            {/* Recruiters Section */}
            <div className='bg-gradient-to-b from-secondary/50 to-transparent rounded-3xl p-6'>
                <RecruitersAgentList />
            </div>
        </div>
    )
}

export default Dashboard
