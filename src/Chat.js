import axios from "axios";
import React, { useEffect, useState } from "react";
import ScrollToBottom from "react-scroll-to-bottom";

function Chat({ socket, username, room, messages}) {
  const [currentMessage, setCurrentMessage] = useState("");
  // const [room, setRoom]= useState("")
  
  // console.log(messages)
  const [messageList, setMessageList] = useState(messages[0]);
  // console.log(messageList)
  // console.log(room)
  // socket.emit("all_messages", room)
  // socket.on("receive_message", (data) => {
  //   console.log(data)
  //   // setMessageList((list) => [...list, data]);
  // });


  const sendMessage = async () => {
    if (currentMessage !== "") {

      const messageData = {
        room: room,
        sender: username,
        text: currentMessage,
      };

      await socket.emit("send_message", messageData);
      // setMessageList((list) => [...list, messageData]);
      // console.log(messageList,"____________________")
      setCurrentMessage("");
    }
  };


  useEffect(() => {
    // socket.emit("join_room", room);
    // setRoom(room)
    socket.on("receive_message", (msg) => {
      console.log("____________")
      console.log(msg)
      console.log("____________")
      setMessageList((list) => [...list, msg]);

      socket.emit("seen_msg", msg, "618f93a669f81c00045f4e5f", )
    });
  }, [socket]);

  return (
    <div className="chat-window">
      <div className="chat-header">
        <p>Live Chat</p>
      </div>
      <div className="chat-body">
        <ScrollToBottom className="message-container">
          {console.log(messageList)}
          {(messageList).map((messageContent) => {
            return (
              <div
                className="message"
                
              >
                <div>
                  <div className="message-content">
                    <p>{messageContent.text}</p>
                  </div>
                  <div className="message-meta">
                    <p id="time"></p>
                    <p id="author"></p>
                  </div>
                </div>
              </div>
            );
          })}
        </ScrollToBottom>
      </div>
      <div className="chat-footer">
        <input
          type="text"
          value={currentMessage}
          placeholder="Hey..."
          onChange={(event) => {
            setCurrentMessage(event.target.value);
          }}
          onKeyPress={(event) => {
            event.key === "Enter" && sendMessage();
          }}
        />
        <button onClick={sendMessage}>&#9658;</button>
      </div>
    </div>
  );
}

export default Chat;
