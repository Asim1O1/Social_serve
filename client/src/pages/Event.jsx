import React from 'react'
import { useParams } from 'react-router'

function Event() {
    const { id } = useParams()
    return (
        <div>Event: {id}</div>
    )
}

export default Event