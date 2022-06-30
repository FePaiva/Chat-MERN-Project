import React, { useContext, useState } from 'react'
import { Button, Col, Form, Row } from 'react-bootstrap'
import { useSelector } from 'react-redux'
import { AppContext } from '../context/appContext';
import './MessageForm.css'

function MessageForm() {

  const [message, setMessage] = useState('');
  const { socket, currentRoom, setMessages, messages, privateMemberMsg, setPrivateMemberMsg} = useContext(AppContext)

  // to access the state and grab the user (react-redux)
    const user = useSelector((state) => state.user);
 
  function getFormattedDate() {
    const date = new Date();
    const year = date.getFullYear();
    let month = (date.getMonth() + 1).toString();
    let day = date.getDate().toString();

    month = month.length > 1 ? month : '0' + month;
    day = day.length > 1 ? day : '0' + day;

    return month + '/' + day + '/' + year
  }

  function handleSubmit(e) {
    e.preventDefault()
    if(!message) return;
    const today = new Date();
    const minutes = today.getMinutes() < 10 ? "0" + today.getMinutes() : today.getMinutes();
    const time = today.getHours() + ":" + minutes;
    const roomId = currentRoom;
    socket.emit('message-room', roomId, message, time,todayDate, user);
    setMessage('');
  }

  const todayDate = getFormattedDate();

  socket.off("room-messages").on("room-messages", (roomMessages) => {
    console.log("room messages", roomMessages);
    setMessages(roomMessages);
  });
  
  return (
    <> 
      
          <div className='messages-output'>
              {!user && <div className='alert alert-danger'>Please login to access the chat.</div> }  
          </div>  
            <Form onSubmit={handleSubmit} >

                <Row>
                    <Col md={11}>
                        <Form.Group>
                          {/* disable the from and button if there is no user disabled={!user} */}
                            <Form.Control type="text" placeholder="Your message" disabled={!user} value={message} onChange={(e) => setMessage(e.target.value)} ></Form.Control>
                        </Form.Group>
                    </Col>
                    <Col md={1}>
                        <Button variant="primary" type="submit" style={{ width: "100%", backgroundColor: "orange" }} disabled={!user} >
                            <i className="fas fa-paper-plane"></i>
                        </Button>
                    </Col>
                </Row>

            </Form>
          
  
     </>
  );
}

export default MessageForm