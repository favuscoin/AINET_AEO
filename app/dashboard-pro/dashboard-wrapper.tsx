export default function DashboardProPage() {
    const router = useRouter();
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
        // Check invite code
        const inviteCode = localStorage.getItem('ainet_invite_code');

        if (inviteCode === 'INTERNETOFAGENTS') {
            setIsAuthorized(true);
            setIsChecking(false);
        } else {
            router.push('/login');
        }
    }, [router]);

    if (isChecking || !isAuthorized) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    // Create a mock session object for components that expect it
    const mockSession = {
        user: {
            id: 'invite-user',
            email: 'invite@ainet.com',
            name: 'AINET User'
        }
    };

    return <DashboardProContent session={mockSession} />;
}
