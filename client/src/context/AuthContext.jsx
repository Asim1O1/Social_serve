import { createContext, useContext, useEffect, useState } from "react";
import { api, apiPublic } from "../axios/axios";

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const load = async () => {
            try {
                const data = await api.get('/auth/me')
                setUser(data.data)
            } catch (err) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }
        load()
    }, [])

    const register = async (formData) => {
        let data;
        if (formData.role == 'ADMIN') {
            data = await apiPublic.post('/auth/register/organizer', formData)
        } else {
            data = await apiPublic.post('/auth/register/volunteer', formData)
        }
    }

    const login = async (email, password) => {
        const data = await api.post('/auth/lgoin', { email, password })
    }
    const logout = async (token) => {
        const data = await api.post('/auth/logout', token)
    }

    return (
        <AuthContext.Provider value={{ user, login, logout, register }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)

