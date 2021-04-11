import { Button, FormControl, IconButton, Input, InputLabel } from '@material-ui/core';
import { useEffect, useState } from 'react';
import './App.css';
import { db } from './firebase';
import Message from './Message';
import firebase from "firebase"
import FlipMove from 'react-flip-move';
import SendIcon from '@material-ui/icons/Send';

function App() {
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState([])
  const [username, setUsername] = useState("")


  useEffect(() => {
    setUsername(prompt("Please enter your name"))
  }, [])


  useEffect(() => {
    db.collection("messages")
    .orderBy("timestamp", "desc")
    .onSnapshot(snapshot => {
      setMessages(snapshot.docs.map(doc => ({id: doc.id, message: doc.data()})))
    })
  }, [])

  const sendMessage = event => {
    // all the logic to send the message
    event.preventDefault()

    db.collection("messages").add({
      message: input,
      username: username,
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    })

    setInput("")
  }



  return (
    <div className="App">
      <img src="https://facebookbrand.com/wp-content/uploads/2018/09/Header-e1538151782912.png?w=100&h=100" />
      <h2>Welcome {username}</h2>
      <form className="app__form">
        {/* <input value={input} onChange={e => setInput(e.target.value)} /> */}
        <FormControl className="app__formControl">
          <Input className="app__input" placeholder="Enter a message" value={input} onChange={e => setInput(e.target.value)} />


          <IconButton
            className="app__iconButton"
            disabled={!input} 
            variant="contained" 
            color="primary" 
            type="submit" 
            onClick={sendMessage}
          >
            <SendIcon />
          </IconButton>
        </FormControl>
      </form>


      <FlipMove>
        {
          messages.map(({message, id})=> (
            <Message key={id} username={username} message={message}/>
          ))
        }
      </FlipMove>

    </div>
  );
}

export default App;
