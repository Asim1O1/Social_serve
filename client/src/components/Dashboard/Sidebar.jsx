import React from 'react'
import { Link, useLocation } from 'react-router'
import { useAuth } from '../../context/AuthContext'

function Sidebar() {
    const { user } = useAuth()
    const location = useLocation()

    if (user?.role == 'ADMIN') {
        return (
            <div className='space-y-1 md:min-w-1/8 border-r border-secondary flex flex-col'>
                <Link to='/dashboard' className={`tab-btn ${location.pathname == "/dashboard" ? "border-l-6 border-accent " : ""}`}>My Events</Link>
                <Link to='create-campaign' className={`tab-btn ${location.pathname == "/dashboard/create-campaign" ? "border-l-6 border-accent " : ""}`}>Create Event</Link>
                <button className='tab-btn'>Approve Volunteer</button>
            </div >
        )
    }
    if (user?.role == 'VOLUNTEER') {
        return (
            <div className='space-y-3 md:min-w-1/8 border-r border-border flex flex-col pr-6'>
                <button className='secondary-btn'>View Events</button>
            </div>
        )
    }
}

export default Sidebar