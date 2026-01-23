'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Hook to check if user has entered the correct invite code
 * Redirects to /login if not authenticated
 */
export function useInviteCodeAuth() {
    const router = useRouter();

    useEffect(() => {
        const inviteCode = localStorage.getItem('ainet_invite_code');

        if (inviteCode !== 'INTERNETOFAGENTS') {
            router.push('/login');
        }
    }, [router]);
}
