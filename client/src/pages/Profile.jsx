import { Link, useNavigate } from 'react-router'
import { useAuth } from '../context/AuthContext'
import { useEffect } from 'react';
import Loading from '../components/Loading';
import { Plus, User } from 'lucide-react';
import EventList from '../components/EventList';

function Profile() {
    const navigate = useNavigate()
    const { user, loading, logout } = useAuth()

    useEffect(() => {
        if (!loading && !user) {
            navigate('/login');
        }
    }, [loading, user]);

    if (loading) {
        return (
            <Loading />
        )
    }

    return (
        <div>
            <div className='flex items-center gap-2'>
                <div className='bg-accent/50 w-fit p-3 text-white rounded'><User /></div>
                <div>
                    <span className='block'>{user?.email.split("@")[0]}</span>
                    <span className='text-gray-400'>{user?.role == "ADMIN" ? user?.role.toLowerCase() : 'volunteer'}</span>
                </div>
                <button className='ml-auto secondary-btn' onClick={logout}>Logout</button>
            </div>
            <div className='mt-8'>
                <div className='flex items-center justify-between'>
                    <h1 className='font-bold text-2xl'>My Events</h1>
                    {user?.role == "ADMIN" && <Link to="/dashboard" className='primary-btn rounded-full'>
                        <Plus className='inline-block md:hidden' size={16} />
                        <span className='md:inline hidden'>Create event</span>
                    </Link>}
                </div>
                <div className='grid-container mt-6'>
                    {events.map(event => (
                        <EventList event={event} />
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Profile;

const events = [
    {
        _id: 12345,
        orgId: "6927fcfdeba4980512d7b0b2",
        volId: ["6927fcfdeba4980512d7b0b2", "15", "20"],
        name: 'Arijit',
        location: 'Yak & Yeti Ground',
        organizer: 'Biplav Group of Company',
        time: '2025-Nov-12 12:00pm',
        comments: [
            { user: "biplav", comment: 'This was thrilling concert.' },
            { user: "biplav", comment: 'This was thrilling concert.' },
            { user: "biplav", comment: 'This was thrilling concert.' }
        ]
    },
    {
        _id: 45,
        name: 'Dhinchak Pooja',
        orgId: "6927fcfdeba4980512d7b0b2",
        volId: ["6927fcfdeba4980512d7b0b2", "15", "20"],
        location: 'Yak & Yeti Ground',
        organizer: 'Biplav Group of Company'
    },
    {
        _id: 75,
        name: 'Kale Hapsi Aka Akon',
        orgId: "6927fcfdeba4980512d7b0b2",
        volId: ["6927fcfdeba4980512d7b0b2", "15", "20"],
        location: 'Yak & Yeti Ground',
        organizer: 'Biplav Group of Company'
    }
]