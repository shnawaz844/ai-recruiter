"use client"
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import React, { useEffect, useState } from 'react'
import AddNewSessionDialog from './AddNewSessionDialog';
import axios from 'axios';
import { SessionDetail } from '../recruiter/[sessionId]/page';
import HistoryTable from './HistoryTable';
import { Loader2 } from 'lucide-react';

/**
 * HistoryList Component
 * 
 * Displays the user's previous recruitment sessions.
 * - If no sessions exist: shows a placeholder UI and CTA to start a new recruitment session.
 * - If sessions exist: displays them in a table using <HistoryTable />.
 */
function HistoryList() {
    const [historyList, setHistoryList] = useState<SessionDetail[]>([]); // stores recruitment session history
    const [loading, setLoading] = useState(false); // loading state for data fetch

    // ⏳ Load session history when the component mounts
    useEffect(() => {
        GetHistoryList();
    }, [])

    // 📥 Fetch all recruitment sessions from the backend
    const GetHistoryList = async () => {
        setLoading(true);
        try {
            const result = await axios.get('/api/session-chat?sessionId=all');
            console.log(result.data);
            setHistoryList(result.data || []); // update state with the response data
        } catch (error) {
            console.error("Error fetching history:", error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className='mt-10'>
            {/* 📦 If no history, show empty state UI */}
            {loading ? (
                <div className='flex items-center justify-center p-20'>
                    <Loader2 className='animate-spin h-10 w-10 text-primary' />
                    <h2 className='ml-3 text-lg font-medium text-slate-500'>Loading recruitment history...</h2>
                </div>
            ) : historyList.length == 0 ? (
                <div className='flex items-center flex-col justify-center p-7 border border-dashed rounded-2xl border-2'>
                    <Image
                        src={'/medical-assistance.png'}
                        alt='empty'
                        width={150}
                        height={150}
                    />
                    <h2 className='font-bold text-xl mt-2'>No Recent Recruitment Sessions</h2>
                    <p>“You haven’t started your recruitment journey yet. Let’s begin!”</p>

                    {/* ➕ Trigger to start a new recruitment session */}
                    <AddNewSessionDialog />
                </div>
            ) : (
                // 📊 Show recruitment history table
                <div className='max-h-[300px] overflow-y-auto' style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                    <style jsx>{`
                        div::-webkit-scrollbar {
                            display: none;
                        }
                    `}</style>
                    <HistoryTable historyList={historyList} />
                </div>
            )}
        </div>
    )
}

export default HistoryList
