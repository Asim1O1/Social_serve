import { Bookmark, Building2, CalendarDays, MapPin, MessageSquareText, Timer } from 'lucide-react'
import { Link, useLocation } from 'react-router'

function EventList({ event, selectEvent, handleRegister }) {
    const location = useLocation()
    return (
        <div
            className='group p-5 bg-primary/10 space-y-3 relative rounded-xl overflow-hidden hover:border-purple-500 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/20'
        >
            {/* Content */}
            <h3 className='font-bold text-xl'>{event?.title}</h3>

            <div className=' grid grid-cols-2 items-center gap-2'>
                <p className='flex gap-2 items-center text-accent text-sm'>
                    <Bookmark size={16} className='text-accent' />
                    <span className='truncate'>{event?.category || "--"}</span>
                </p>
                <p className='flex gap-2 items-center text-accent text-sm'>
                    <Building2 size={16} className='text-accent' />
                    <span className='truncate'>{event?.organizer || "--"}</span>
                </p>
                <p className='flex gap-2 items-center text-accent text-sm'>
                    <MapPin size={16} className='text-accent' />
                    <span className='truncate'>{event?.location || "--"}</span>
                </p>
                <p className='flex gap-2 items-center text-accent text-sm'>
                    <CalendarDays size={16} className='text-accent' />
                    <span className='truncate'>{event?.date?.split("T")[0] || "--"}</span>
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

                <Link to={`/event/${event.id}`}
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