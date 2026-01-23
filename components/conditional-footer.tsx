'use client';

import { usePathname } from 'next/navigation';
import { Footer } from './footer';

export function ConditionalFooter() {
    const pathname = usePathname();

    // Hide footer on authentication pages
    const hideFooter = pathname === '/login' || pathname === '/login';

    if (hideFooter) {
        return null;
    }

    return <Footer />;
}
