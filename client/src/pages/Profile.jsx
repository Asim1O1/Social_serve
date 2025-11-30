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
                    <span className='block'>{user?.email?.split("@")[0]}</span>
                    <span className='text-gray-400'>{user?.role == "ADMIN" ? user?.role.toLowerCase() : 'volunteer'}</span>
                </div>
                <button className='ml-auto secondary-btn' onClick={logout}>Logout</button>
            </div>
            <div className='mt-8'>
                <div className='flex items-center justify-between'>
                    <h1 className='font-bold text-2xl'>My Events</h1>
                    {user?.role == "ADMIN" && <Link to="/create-campain" className='primary-btn rounded-full'>
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
        "id": "692c5abf51144f65854e9125",
        "title": "test",
        "location": "test",
        "date": "2026-12-12T00:00:00.000Z",
        "category": "Health",
        "status": "DRAFT",
        "createdAt": "2025-11-30T14:54:55.767Z"
    },
    {
        "id": "692c5a9d51144f65854e9123",
        "title": "test",
        "location": "test",
        "date": "2026-12-12T00:00:00.000Z",
        "category": "Health",
        "status": "DRAFT",
        "createdAt": "2025-11-30T14:54:21.095Z"
    },
    {
        "id": "692c5a6851144f65854e9121",
        "title": "test",
        "location": "test",
        "date": "2026-12-12T00:00:00.000Z",
        "category": "Health",
        "status": "DRAFT",
        "createdAt": "2025-11-30T14:53:28.891Z"
    },
    {
        "id": "692c5a0b51144f65854e911f",
        "title": "test",
        "location": "test",
        "date": "2030-12-12T00:00:00.000Z",
        "category": "Health",
        "status": "DRAFT",
        "createdAt": "2025-11-30T14:51:55.553Z"
    },
    {
        "id": "692c59c251144f65854e911d",
        "title": "test",
        "location": "test",
        "date": "2026-12-12T00:00:00.000Z",
        "category": "Health",
        "status": "DRAFT",
        "createdAt": "2025-11-30T14:50:42.532Z"
    },
    {
        "id": "692c599d51144f65854e911b",
        "title": "test",
        "location": "test",
        "date": "2026-12-12T00:00:00.000Z",
        "category": "Health",
        "status": "DRAFT",
        "createdAt": "2025-11-30T14:50:05.246Z"
    },
    {
        "id": "692c57cb51144f65854e9100",
        "title": "test",
        "location": "test",
        "date": "2026-12-12T00:00:00.000Z",
        "category": "Health",
        "status": "DRAFT",
        "createdAt": "2025-11-30T14:42:19.324Z"
    },
    {
        "id": "692c57bd51144f65854e90fe",
        "title": "test",
        "location": "esrfs",
        "date": "2026-12-12T00:00:00.000Z",
        "category": "Health",
        "status": "DRAFT",
        "createdAt": "2025-11-30T14:42:05.686Z"
    },
    {
        "id": "692c574051144f65854e90fc",
        "title": "test",
        "location": "test",
        "date": "2026-12-12T00:00:00.000Z",
        "category": "Health",
        "status": "DRAFT",
        "createdAt": "2025-11-30T14:40:00.352Z"
    }]