import React, {useContext, useEffect} from 'react'
import { ListGroup, ListGroupItem } from 'react-bootstrap'
import { useSelector } from 'react-redux'
import { AppContext } from '../context/appContext'

function Sidebar() {
  // const rooms = ['first roon', 'second roon', 'third roon'];
  const user = useSelector((state) => state.user);
  const { socket, setRooms, rooms, currentRoom, setCurrentRoom, members, setMembers, privateMemberMsg, setPrivateMemberMsg} = useContext(AppContext);


  useEffect(() => {
      if(user) {
        setCurrentRoom('general');
        getRooms();
        socket.emit('join-room', 'general');
        socket.emit('new-user');
      }
  }, []);

  // socket.off to turn off the listener for the new-user event, so it can be turned on once a new-user joins.
  socket.off('new-user').on('new-user', (payload) => {
    setMembers(payload)
  })

  function getRooms() {
    fetch("http://localhost:5001/rooms")
      .then((res) => res.json())
      .then((data) => setRooms(data));
  }

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
      {members.map((member) => (
          <ListGroup.Item key={member.id} style={{ cursor:"pointer"}} >
            {member.name}
          </ListGroup.Item>
      ))}
    
    </>
  )
}

export default Sidebar