import { MapPin, X } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router'
import { useAuth } from '../context/AuthContext'
import EventList from '../components/EventList'
import Comment from '../components/Comment'

function Home() {
    const navigate = useNavigate()
    const { user } = useAuth()
    const [event, selectEvent] = useState(null)

    const handleRegister = async () => {
        if (!user) {
            navigate('/login')
            return;
        }
        await registerEventVolunteer(user.id)
    }

    return (
        <div>
            <div className='mx-auto'>
                <h1 className='text-5xl font-bold'>Discover Events</h1>
                <p className='text-lg'>Explore what's happening around you.</p>
            </div>

            {/* Main Content */}
            <div className='grid-container mt-4'>
                {events.map(event => (
                    <EventList key={event._id} event={event} selectEvent={selectEvent} handleRegister={handleRegister} />
                ))}

                {/* Comment Box */}
                <Comment event={event} selectEvent={selectEvent} />
            </div>
        </div>
    )
}

export default Home

const events = [
    {
        _id: 12345,
        name: 'Concert',
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
        name: 'Concert',
        location: 'Yak & Yeti Ground',
        organizer: 'Biplav Group of Company',
        comments: [
            { user: 'jackson', comment: 'Yei ho para?' },
            { user: 'v10', comment: "Cylinder padkaidim kya ho?" }
        ]
    },
    {
        _id: 75,
        name: 'Concert',
        location: 'Yak & Yeti Ground',
        organizer: 'Biplav Group of Company'
    },
    {
        _id: 55,
        name: 'Concert',
        location: 'Yak & Yeti Ground',
        organizer: 'Biplav Group of Company'
    },
    {
        _id: 65,
        name: 'Concert',
        location: 'Yak & Yeti Ground',
        organizer: 'Biplav Group of Company'
    },
    {
        _id: 82,
        name: 'Concert',
        location: 'Yak & Yeti Ground',
        organizer: 'Biplav Group of Company'
    },
    {
        _id: 98,
        name: 'Concert',
        location: 'Yak & Yeti Ground',
        organizer: 'Biplav Group of Company'
    },
    {
        _id: 68,
        name: 'Concert',
        location: 'Yak & Yeti Ground',
        organizer: 'Biplav Group of Company'
    },
    {
        _id: 23,
        name: 'Concert',
        location: 'Yak & Yeti Ground',
        organizer: 'Biplav Group of Company'
    },
    {
        _id: 18,
        name: 'Concert',
        location: 'Yak & Yeti Ground',
        organizer: 'Biplav Group of Company'
    },
]