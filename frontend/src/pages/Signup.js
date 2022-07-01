import React, {useState} from 'react'
import { Container, Col, Form, Button, Row } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import "./Signup.css";
import avatar from '../assets/avatar.jpg';
import { useSignupUserMutation } from "../services/appApi";




function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [signupUser, { isLoading, error }] = useSignupUserMutation();
  const navigate = useNavigate();

  //image upload states
  const [image, setImage] = useState(null);
  const [uploadingImg, setUploadingImg] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  
  function validateAvatar (e) {
    const file = e.target.files[0];
    if(file.size >= 2097152) {
      return alert("Image size has to be up to 2mb.")
    } else { 
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  }

  async function uploadImage() {
    const data = new FormData();
    data.append('file', image);
    // cloudinary preset used
    data.append('upload_preset', 'chat_app'); 
    try {
      setUploadingImg(true);
      let res = await fetch('https://api.cloudinary.com/v1_1/fepaiva/image/upload', {
        method: 'POST',
        body: data
      })
      const urlData = await res.json();
      setUploadingImg(false);
      return urlData.url

    } catch(error) {
      setUploadingImg(false);
      console.log(error);
    }
  }

  async function handleSignup(e){
    e.preventDefault();
    if(!image) return alert("Please upload any image you like :)")
    const url = await uploadImage(image);
    console.log(url);

    // to signup the user
    signupUser({ name, email, password, picture: url }).then(({ data }) => {
      if (data) {
          console.log(data);
          navigate("/chat");
      }
  });
}


  return (
    <Container> 
    <Row > 
     
      <Col md={7} className="d-flex align-items-center justify-content-center flex-direction-column"> 
            <Form style={{width: "80%", maxWidth: 500 }} onSubmit={handleSignup} >
              <h1 className="text-center">Create account</h1>
              <div className="signup-profile-pic_container">
                <img src={imagePreview || avatar} className="signup-profile-pic"/>
                <label htmlFor="image-upload" className="image-upload-label">
                  <i className="fas fa-plus-circle add-picture-icon"></i>
                </label>
                <input type="file" id="image-upload" hidden accept="image/png, image/jpeg, image/jpg" onChange={validateAvatar}/>
              </div>
              {error && <p className="alert alert-danger" >{error.data}</p>}
            <Form.Group className="mb-3" controlId="formBasicName">
              <Form.Label>Name</Form.Label>
              <Form.Control type="text" placeholder="Your name" onChange={(e)=> setName(e.target.value)} value={name}/>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control type="email" placeholder="Enter email" onChange={(e)=> setEmail(e.target.value)} value={email}/>
              <Form.Text className="text-muted">
                We'll never share your email with anyone else.
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" placeholder="Password" onChange={(e)=> setPassword(e.target.value)} value={password}/>
            </Form.Group>
            {/* <Form.Group className="mb-3" controlId="formBasicCheckbox">
              <Form.Check type="checkbox" label="Check me out" />
            </Form.Group> */}
            <Button variant="primary" type="submit">
              {uploadingImg || isLoading ? "Signing you up ... " : "Signup"}
            </Button>
            <div className="py-4"> 
              <p className="text-center">Oh, you are a member! - <Link to="/login">Login</Link> </p>
            </div>
          </Form>
      </Col>
      <Col md={5} className="signup__bg" ></Col>
  </Row>
</Container>
  )
}

export default Signup;