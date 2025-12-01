import { Link, useNavigate } from 'react-router'
import { useAuth } from '../context/AuthContext'
import { useEffect } from 'react';
import Loading from '../components/Loading';
import { Plus, User } from 'lucide-react';
import EventList from '../components/CampaignList';

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
                    {user?.role == "ADMIN" && <Link to="/create-campaign" className='primary-btn rounded-full'>
                        <Plus className='inline-block md:hidden' size={16} />
                        <span className='md:inline hidden'>Create event</span>
                    </Link>}
                </div>
                <div className='grid-container mt-6'>
                    {events.map(event => (
                        <EventList key={event.id} event={event} />
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Profile;

const events = [
    {
        "id": "692c92fc7d1feca948818d21",
        "title": "GVHJBKIOK",
        "location": "HVBJUIJOXAPS",
        "date": "2025-12-29T00:00:00.000Z",
        "category": "Health",
        "status": "DRAFT",
        "createdBy": "6927fc7ceba4980512d7b0ae",
        "createdAt": "2025-11-30T18:54:52.201Z",
        "attachments": [
            {
                "url": "https://res.cloudinary.com/dqkmdoskj/image/upload/v1764528891/campaign_attachments/ixuweekdhabrjpm365dh.png",
                "public_id": "campaign_attachments/ixuweekdhabrjpm365dh",
                "type": "image",
                "_id": "692c92fc7d1feca948818d22"
            }
        ]
    },
    {
        "id": "692c8db0604dba51679b6211",
        "title": "ASERTYUIOKNBVGYU",
        "location": "rtiofvlkew",
        "date": "2025-12-23T00:00:00.000Z",
        "category": "Health",
        "status": "DRAFT",
        "createdBy": "6927fc7ceba4980512d7b0ae",
        "createdAt": "2025-11-30T18:32:16.563Z",
        "attachments": []
    }]