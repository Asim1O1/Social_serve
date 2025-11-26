import { useNavigate } from 'react-router'
import { useAuth } from '../context/AuthContext'
import { useEffect } from 'react'

function Profile() {
    const navigate = useNavigate()
    const { user } = useAuth()

    useEffect(() => {
        if (!user) {
            navigate('/login')
        }
    }, [])

    return (
        <div>{JSON.stringify(user)}</div>
    )
}

export default Profile