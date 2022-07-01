import React, {useContext, useEffect} from 'react'
import { ListGroup, ListGroupItem } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { AppContext } from '../context/appContext'
import { addNotifications, resetNotifications } from '../features/userSlice'

function Sidebar() {
  // const rooms = ['first roon', 'second roon', 'third roon'];
  const user = useSelector((state) => state.user);
  const { socket, setRooms, rooms, currentRoom, setCurrentRoom, members, setMembers, privateMemberMsg, setPrivateMemberMsg} = useContext(AppContext);
  
  // dispatch allow us to call addNotifications and resetNotifications from userSlice
  const dispatch = useDispatch()

  function joinRoom(room, isPublic = true){
      if(!user){
          return alert('Please login')
      }
      socket.emit("join-room", room);
      setCurrentRoom(room);

      if(isPublic){
        setPrivateMemberMsg(null);
      }

      // dispatch for notifications
      dispatch(resetNotifications(room));

      socket.off('notifications').on('notifications', (room) => {
        dispatch(addNotifications(room));
      })
  }

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

  // need to generate an ID for private messaging.
  function sortIds(id1, id2) {
    if(id1 > id2){
      return id1 + '-' + id2
    } else {
      return id2 + '-' + id1;
    }
  }

  function handlePrivateMemberMsg(member) {
    setPrivateMemberMsg(member);
    const roomId = sortIds(user._id, member._id);
    joinRoom(roomId, false)
  }

  if(!user){
    return <div className='alert alert-danger'>Please login to see the rooms.</div>
  }

  return (
    <>
      <h2>Available Rooms</h2>
      <ListGroup>
          {rooms.map((room, index) => (
            <ListGroup.Item key={index} onClick={() => joinRoom(room)} active={room == currentRoom} style={{ cursor:"pointer", display:'flex', justifyContent: 'space-between' }} >
                {room} {currentRoom !== room && <span></span> }
            </ListGroup.Item>
          ))}
      </ListGroup>
      <h2>Members</h2>
      {members.map((member) => (
          <ListGroup.Item key={member.id} active={privateMemberMsg?._id == member?._id} onClick={() => handlePrivateMemberMsg(member)} disabled={member._id === user._id} style={{ cursor:"pointer"}} >
            {member.name}
          </ListGroup.Item>
      ))}
    
    </>
  )
}

export default Sidebar