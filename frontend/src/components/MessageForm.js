import React from 'react'
import { Button, Col, Form, Row } from 'react-bootstrap'
import { useSelector } from 'react-redux'
import './MessageForm.css'

function MessageForm() {

// to access the state and grab the user (react-redux)
  const user = useSelector((state) => state.user);

  function handleSubmit(e) {
    e.preventDefault()
  }

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
                            <Form.Control type="text" placeholder="Your message" disabled={!user} ></Form.Control>
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