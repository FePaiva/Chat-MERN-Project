import React from 'react'
import { ListGroup, ListGroupItem } from 'react-bootstrap'

function Sidebar() {
  const rooms = ['first roon', 'second roon', 'third roon']


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