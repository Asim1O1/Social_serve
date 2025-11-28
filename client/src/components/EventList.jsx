import { Building2, MapPin, MessageSquareText, Timer } from 'lucide-react'
import { Link, useLocation } from 'react-router'

function EventList({ event, selectEvent, handleRegister }) {
    const location = useLocation()
    return (
        <div
            className='group p-5 bg-secondary space-y-3 relative rounded-xl overflow-hidden hover:border-purple-500 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/20'
        >
            {/* Content */}
            <h3 className='font-bold text-xl  group-hover:text-primary transition-colors'>{event.name}</h3>

            <div className='space-y-2'>
                <p className='flex gap-2 items-center text-gray-400 text-sm'>
                    <Building2 size={16} className='text-primary' />
                    <span className='truncate'>{event.organizer}</span>
                </p>
                <p className='flex gap-2 items-center text-gray-400 text-sm'>
                    <MapPin size={16} className='text-accent' />
                    <span className='truncate'>{event.location}</span>
                </p>
                <p className='flex gap-2 text-sm text-gray-400 items-center'>
                    <Timer size={16} className='text-primary' />
                    <span>{event.time || "--"}</span>
                </p>
            </div>

            {/* Divider */}
            <div className='h-px bg-linear-to-r from-transparent via-slate-700 to-transparent my-3'></div>

            {/* Stats and Actions */}
            <div className='flex gap-2 items-center justify-between pt-2'>
                <button onClick={() => selectEvent(event)} className='flex gap-1 items-center text-gray-600 hover:text-primary transition-colors text-sm group/comment cursor-pointer'>
                    <MessageSquareText size={16} />
                    <span className='group-hover/comment:text-primary'>{event?.comments?.length || 0}</span>
                </button>

                <Link to={`/event/${event._id}`}
                    className={`ml-auto rounded-lg primary-btn`}>
                    <span>View</span>
                </Link>
                {location.pathname !== '/profile' && <button
                    onClick={handleRegister}
                    className={`secondary-btn`}>
                    <span>Register</span>

                </button>}
            </div>
        </div>
    )
}

export default EventList