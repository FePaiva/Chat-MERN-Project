import React from 'react'
import { ListGroup, ListGroupItem } from 'react-bootstrap'
import { useSelector } from 'react-redux'

function Sidebar() {
  const rooms = ['first roon', 'second roon', 'third roon']
  const user = useSelector((state) => state.user)

  if(!user){
    return <div className='alert alert-danger'>Please login to see the rooms.</div>
  }

  return (
    <>
      <h2>Available Rooms</h2>
      <ListGroup>
          {rooms.map((room, index) => (
            <ListGroup.Item key={index} >
                {room}
            </ListGroup.Item>
          ))}
      </ListGroup>
      <h2>Members</h2>
    
    
    </>
  )
}

export default Sidebar