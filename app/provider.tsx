"use client"
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useUser } from '@clerk/nextjs';
import { UserDetailContext } from '@/context/UserDetailContext';

export type UsersDetail = {
    name: string,
    email: string,
    credits: number
}

function Provider({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {

    const { user } = useUser();
    const [userDetail, setUserDetail] = useState<any>();
    useEffect(() => {
        if (user && !userDetail) {
            CreateNewUser();
        }
    }, [user, userDetail])

    const CreateNewUser = async () => {
        try {
            const result = await axios.post('/api/users');
            if (typeof result.data === 'object') {
                setUserDetail(result.data);
            } else {
                console.error("Received non-JSON response from /api/users");
            }
        } catch (error) {
            console.error("Error creating/fetching user:", error);
        }
    }

    return (
        <div>
            <UserDetailContext.Provider value={{ userDetail, setUserDetail }}>
                {children}
            </UserDetailContext.Provider></div>
    )
}

export default Provider