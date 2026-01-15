"use client"
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import React, { useEffect, useState } from 'react'
import AddNewSessionDialog from './AddNewSessionDialog';
import axios from 'axios';
import { SessionDetail } from '../recruiter/[sessionId]/page';
import HistoryTable from './HistoryTable';

/**
 * HistoryList Component
 * 
 * Displays the user's previous recruitment sessions.
 * - If no sessions exist: shows a placeholder UI and CTA to start a new recruitment session.
 * - If sessions exist: displays them in a table using <HistoryTable />.
 */
function HistoryList() {
    const [historyList, setHistoryList] = useState<SessionDetail[]>([]); // stores recruitment session history

    // ⏳ Load session history when the component mounts
    useEffect(() => {
        GetHistoryList();
    }, [])

    // 📥 Fetch all recruitment sessions from the backend
    const GetHistoryList = async () => {
        const result = await axios.get('/api/session-chat?sessionId=all');
        console.log(result.data);
        setHistoryList(result.data); // update state with the response data
    }

    return (
        <div className='mt-10'>
            {/* 📦 If no history, show empty state UI */}
            {historyList.length == 0 ? (
                <div className='flex items-center flex-col justify-center p-7 border border-dashed rounded-2xl border-2'>
                    <Image
                        src={'/medical-assistance.png'}
                        alt='empty'
                        width={150}
                        height={150}
                    />
                    <h2 className='font-bold text-xl mt-2'>No Recent Recruitment Sessions</h2>
                    <p>“You haven’t started your learning journey yet. Let’s begin!”</p>

                    {/* ➕ Trigger to start a new recruitment session */}
                    <AddNewSessionDialog />
                </div>
            ) : (
                // 📊 Show recruitment history table
                <div>
                    <HistoryTable historyList={historyList} />
                </div>
            )}
        </div>
    )
}

export default HistoryList
