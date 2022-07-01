import React, { useContext, useEffect, useRef, useState } from 'react'
import { Button, Col, Form, Row } from 'react-bootstrap'
import { useSelector } from 'react-redux'
import { AppContext } from '../context/appContext';
import './MessageForm.css'

function MessageForm() {

  const [message, setMessage] = useState('');
  const { socket, currentRoom, setMessages, messages, privateMemberMsg, setPrivateMemberMsg} = useContext(AppContext);
  const messageEndRef = useRef(null);
  // to access the state and grab the user (react-redux)
  const user = useSelector((state) => state.user);
 
  // scroll to bottom every time there is a new message
  useEffect(() => {
    scrollToBottom();
  }, [messages])


    function getFormattedDate() {
      const date = new Date();
      const year = date.getFullYear();
      let month = (1 + date.getMonth()).toString();

      month = month.length > 1 ? month : "0" + month;
      let day = date.getDate().toString();

      day = day.length > 1 ? day : "0" + day;

      return month + "/" + day + "/" + year;
    }

  const todayDate = getFormattedDate();

  function scrollToBottom() {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }


  function handleSubmit(e) {
    e.preventDefault()
    if(!message) return;
    const today = new Date();
    const minutes = today.getMinutes() < 10 ? "0" + today.getMinutes() : today.getMinutes();
    const time = today.getHours() + ":" + minutes;
    const roomId = currentRoom;
    socket.emit("message-room", roomId, message, user, time, todayDate );
    setMessage("");
  }


  socket.off("room-messages").on("room-messages", (roomMessages) => {
    console.log("room messages", roomMessages);
    setMessages(roomMessages);
  });
  
  return (
    <> 
      
          <div className='messages-output'>
              {user && !privateMemberMsg?._id && <div className='alert alert-info'>You are in the  {currentRoom} room.</div> }
              {user && privateMemberMsg?._id && (
                <>
                <div className="alert alert-info conversation-info">
                    <div>
                      Your private room with {privateMemberMsg.name} <img src={ privateMemberMsg.picture} className="conversation-profile-picture" />
                    </div>
                </div>
                </>
              )}
              {!user && <div className='alert alert-danger'>Please login to access the chat.</div> }  
              {/* to display the messages */}
              {/* reminder: the (({})) in the map is for destructuring */}
              {user && messages.map(({ _id: date, messagesByDate }, index) => (
                <div key={index} >
                    <p className="alert alert-info text-center message-date-indicator">{date}</p>
                    {messagesByDate?.map(({ content, time, from: sender }, msgIndex) => (
                        <div className={sender?.email == user?.email ? "message-date" : "incoming-message"} key={msgIndex} >
                          <div className="message-inner" >
                              <div className="d-flex align-items-center mb-3" >
                                  <img src={sender.picture} style={{ width: 35, height: 35, objectFit: "cover", borderRadius: "50%", marginRight: 10  }} />
                                  <p className="message-sender" >{sender._id == user?._id ? "You" : sender.name} </p>
                              </div>
                                  <p className="message-content">{content}</p>
                                  <p className="message-timestamp-left">{time}</p>
                          </div>
                        </div>
                    ))}
                </div>
              ))}    
              {/* for automatic scroling */}
              <div ref={messageEndRef} ></div>
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