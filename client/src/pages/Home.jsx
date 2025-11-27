import { Building2, MapPin, MessageSquareText, X, User, MessageSquare } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { useAuth } from '../context/AuthContext'

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
            {/* Header */}
            <div className='bg-linear-to-r'>
                <div className='mx-auto'>
                    <h1 className='text-5xl font-bold'>Discover Events</h1>
                    <p className='text-lg'>Explore what's happening around you.</p>
                </div>
            </div>

            {/* Main Content */}
            <div className='mx-auto py-8'>
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
                    {events.map(event => (
                        <div
                            key={event._id}
                            className='group relative border border-border rounded-xl overflow-hidden hover:border-purple-500 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/20'
                        >
                            {/* Content */}
                            <div className='p-5 space-y-3'>
                                <h3 className='font-bold text-xl  group-hover:text-purple-800 transition-colors'>{event.name}</h3>

                                <div className='space-y-2'>
                                    <p className='flex gap-2 items-center text-gray-400 text-sm'>
                                        <Building2 size={16} className='text-purple-400' />
                                        <span className='truncate'>{event.organizer}</span>
                                    </p>
                                    <p className='flex gap-2 items-center text-gray-400 text-sm'>
                                        <MapPin size={16} className='text-blue-400' />
                                        <span className='truncate'>{event.location}</span>
                                    </p>
                                </div>

                                {/* Divider */}
                                <div className='h-px bg-linear-to-r from-transparent via-slate-700 to-transparent my-3'></div>

                                {/* Stats and Actions */}
                                <div className='flex gap-2 items-center justify-between pt-2'>
                                    <button onClick={() => selectEvent(event)} className='flex gap-1 items-center text-gray-400 hover:text-purple-800 transition-colors text-sm group/comment cursor-pointer'>
                                        <MessageSquareText size={16} />
                                        <span className='group-hover/comment:text-purple-800'>{event?.comments?.length || 0}</span>
                                    </button>

                                    <Link to={`/event/${event._id}`}
                                        className={`ml-auto px-4 py-2 rounded-lg font-semibold text-sm transition-all bg-border cursor-pointer hover:bg-primary text-black hover:text-white duration-200 flex items-center gap-1 `}>
                                        <span>View</span>
                                    </Link>
                                    <button
                                        onClick={handleRegister}
                                        className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all bg-border cursor-pointer hover:bg-primary text-black hover:text-white duration-200 flex items-center gap-1 `}>
                                        <span>Register</span>

                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Comment Box */}
                    {event && <div className='fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50'>
                        <div className=' bg-white rounded-xl max-w-2xl w-full max-h-96 overflow-hidden border border-slate-700 shadow-2xl'>
                            {/* Header */}
                            <div className='flex items-center justify-between px-3 py-2'>
                                <div>
                                    <h2 className='text-2xl font-bold text-primary'>{event.name}</h2>
                                    <p className='flex items-center gap-1 text-gray-400 text-sm mt-1'>
                                        <span className='text-primary'><MapPin size={12} /></span>
                                        <span>{event.location}</span>
                                    </p>
                                </div>
                                <button
                                    onClick={() => selectEvent(null)}
                                    className='cursor-pointer bg-black/20 hover:bg-black p-2 rounded-full transition-all'
                                >
                                    <X size={20} className='text-white' />
                                </button>
                            </div>

                            {/* Comments Section */}
                            <div className='px-3 overflow-y-auto max-h-72'>
                                {event.comments && event.comments.length > 0 ? (
                                    event.comments.map(comment => (
                                        <div key={comment.id} className='border-t border-border'>
                                            <div className='flex items-center gap-1 py-2'>
                                                <div className='bg-linear-to-br from-primary to-secondary rounded-full p-2 '>
                                                    <User size={16} className='text-white' />
                                                </div>
                                                <div className='flex-1 min-w-0'>
                                                    <div className='flex items-center gap-2'>
                                                        <span className='font-semibold text-black/80 text-sm'>{comment.user}</span>
                                                        <p className='text-gray-400 text-sm '>{comment.comment}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className='flex flex-col items-center justify-center py-12 text-gray-400'>
                                        <MessageSquare size={32} className='mb-2 opacity-50' />
                                        <p>No comments yet</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>}
                </div>
            </div>
        </div >
    )
}

export default Home

const events = [
    {
        _id: 12345,
        name: 'Concert',
        location: 'Yak & Yeti Ground',
        organizer: 'Biplav Group of Company',
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
        organizer: 'Biplav Group of Company'
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