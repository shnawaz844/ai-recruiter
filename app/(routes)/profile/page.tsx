import { UserProfile } from '@clerk/nextjs'
import React from 'react'
import AppHeader from '../dashboard/_components/AppHeader'

function Profile() {
    return (
        <div>
            <AppHeader />
            <div className='px-10 md:px-20 lg:px-40 py-10 flex justify-center'>
                <UserProfile routing="hash" />
            </div>
        </div>
    )
}

export default Profile
