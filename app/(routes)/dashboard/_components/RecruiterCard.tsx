"use client"
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useAuth } from '@clerk/nextjs'
import { IconArrowRight } from '@tabler/icons-react'
import axios from 'axios'
import { Loader2Icon } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'

/**
 * Type definition for each recruiter agent card
 */
export type recruiterAgent = {
    id: number,
    specialist: string,
    description: string,
    image: string,
    agentPrompt: string,
    voiceId?: string,
    gender: "male" | "female",
    subscriptionRequired: boolean
}

type props = {
    recruiterAgent: recruiterAgent
}

/**
 * RecruiterCard Component
 * Renders a recruiter card with image, name, description,
 * and a button to start a new recruitment session.
 */
function RecruiterCard({ recruiterAgent }: props) {
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { has } = useAuth();

    // ✅ Check if the user has a 'pro' plan using Clerk's has() helper
    //@ts-ignore
    const paidUser = has && has({ plan: 'pro' });

    /**
     * 📞 Handle Start Recruitment Button Click
     * Creates a new session with the selected recruiter and redirects to the call page.
     */
    const onStartRecruitment = async () => {
        setLoading(true);

        // Post the new session to backend API
        const result = await axios.post('/api/session-chat', {
            notes: 'New Recruitment Session',
            selectedRecruiter: recruiterAgent
        });

        if (result.data?.sessionId) {
            // Navigate to the new recruitment call page
            router.push('/dashboard/recruiter/' + result.data.sessionId);
        }

        setLoading(false);
    }

    return (
        <div className='relative'>
            {/* 🔒 Premium badge if recruiter requires subscription */}
            {recruiterAgent.subscriptionRequired && (
                <Badge className='absolute m-2 right-0'>Premium</Badge>
            )}

            {/* 👔 Recruiter image */}
            <Image
                src={recruiterAgent.image}
                alt={recruiterAgent.specialist}
                width={200}
                height={300}
                className='w-full h-[230px] object-cover rounded-xl'
            />

            {/* 💼 Specialist title */}
            <h2 className='font-bold mt-1 min-h-[48px]'>{recruiterAgent.specialist}</h2>

            {/* 📋 Recruiter description */}
            <p className='line-clamp-2 text-sm text-gray-500'>
                {recruiterAgent.description}
            </p>

            {/* 🚀 Start recruitment button */}
            <Button
                className='w-full mt-2'
                onClick={onStartRecruitment}
            // disabled={!paidUser && recruiterAgent.subscriptionRequired} // disable if recruiter is premium & user isn't
            >
                Start Recruitment{' '}
                {loading ? (
                    <Loader2Icon className='animate-spin' />
                ) : (
                    <IconArrowRight />
                )}
            </Button>
        </div>
    )
}

export default RecruiterCard
