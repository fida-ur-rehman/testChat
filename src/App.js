import "./App.css";
import io from "socket.io-client";
import { useState, useEffect, Component } from "react";
import Chat from "./Chat";
import axios from 'axios';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"

const socket = io.connect("http://localhost:3002");

function App() {
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [showChat, setShowChat] = useState(false);
  const [chatList, setChatList] = useState([])
  const [messages, setMessages] = useState([])




  const joinRoom = async (item) => {
    console.log(item._id)
      await socket.emit("join_room", item._id, "618f93a669f81c00045f4e5f", item.unseenMsg);
      setUsername("618f93a669f81c00045f4e5f")
      setRoom(item._id)
      await socket.on("all-msg", async (data) => {
        // await socket.emit("seen_msg", item.unseen, item._id);
        console.log(data)
        setMessages((list) => [...list, data]);
        console.log(chatList)
        setShowChat(true);
      });
      
  };



useEffect(() => {
  // axios.get('http://localhost:3002/api/conv/user-con', {headers: {token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjoiKzkxNzI0OTU0MTIzNSIsImlhdCI6MTYzNzIyNjA5MCwiZXhwIjoxNjY4NzgzNjkwfQ.qSH8lr-hZBxe_LHSwN65tnAR8vXQYAybeb2I_e3taBs"}})
  // .then(response =>  {
  //   console.log(response.data.result)
  //   setChatList(response.data.result)
  // });

  socket.emit("all_conv", "618f93a669f81c00045f4e5f");
  socket.on("all_conv", (convs) => {
    setChatList(convs)
    socket.on("count", (convId) => {
      chatList.map(e => {
        if(e._id === convId)
          console.log(e)
        })
    })
  })

}, [socket]);

  return (
    <div className="App">
      <div className="ChatListContainer">
      <div className="contact-list">
      {/* <h3>Join A Chat</h3>
          <input
            type="text"
            placeholder="John..."
            onChange={(event) => {
              setUsername(event.target.value);
            }}
          />
          <input
            type="text"
            placeholder="Room ID..."
            onChange={(event) => {
              setRoom(event.target.value);
            }}
          /> */}
      {!showChat ? (
        <div className="joinChatContainer">
          <h1 className="title">My messages</h1>
          <ul>{
            
        (chatList).map(function(item) {
            return <li onClick={()=> {joinRoom(item)}} key={item._id}><span className="badge">{Math.abs(item.unseen)}</span>{(item.type === "Group") ? item.name[0] : item.name[1].name} </li>
          })
      }
        </ul>
        </div>
      ) : (
        <Chat socket={socket} username={username} room={room} messages={messages}/>
      )}

        </div>
      </div>
    </div>
  );
}

export default App;
