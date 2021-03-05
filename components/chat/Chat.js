import React, { Fragment, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

import Link from 'next/link';

import fire from '../../config/fire-config';

const Chat = (props) => {

  const user = useSelector ((state) => state.user);
  const [content, setContent] = useState('');
  const [chats, setChats] = useState([]);
  const myRef = React.createRef();

  useEffect(() => {
    let _chats;
    const chatArea = myRef.current;

    if(!props.userName) {
      return;
    }

    fire.firestore()
      .collection('chats_'+props.userName)
      .onSnapshot(querySnapshot => {
        _chats = [];
        querySnapshot.forEach((doc) => {
          _chats.push(doc.data());
        });
        _chats.sort((a, b) => { return a.timestamp - b.timestamp })
        chatArea.scrollBy(0, chatArea.scrollHeight);
        setChats(_chats);
      });
  },[]);

  const handleSubmit = (event) => {
    event.preventDefault();

    const chatArea = myRef.current;

    try {
      fire.firestore()
      .collection('chats_'+props.userName)
      .add({
        content: content,
        timestamp: Date.now(),
        userName: user.currentUser.displayName
      });

      setContent('');
      chatArea.scrollBy(0, chatArea.scrollHeight);
      
    } catch (error) {
      console.log(error);
    }
  }

  const formatTime = (timestamp) => {
    const d = new Date(timestamp);
    const time = ` ${d.getDate()}/${(d.getMonth()+1)}/${d.getFullYear()} ${d.getHours()}:${d.getMinutes()}`;
    return time;
  }

  return (
    <Fragment>
    <div id="chat-content" ref={myRef}>
      <div id="chat-area">
        {chats.map((chat, i) => {
          return <p key={i} className={"chat-bubble " + (user.currentUser.displayName === chat.userName ? "current-user" : "")}>
            <strong>{chat.userName}:</strong> {chat.content}
          </p>
        })}
      </div>

    </div>
    <div id="chat-input">
        {!user.loggedIn?
          <div>
            Please 
            <Link href="/login">
              <a> Login</a>
            </Link> or 
            <Link href="/register">
              <a> Register</a>
            </Link> to chat
          </div>
        :
          <form onSubmit={handleSubmit}>
            <input type="text" className="form-control" value={content} onChange={({target}) => setContent(target.value)} />
            <button type="submit" className="btn btn-submit px-5 mt-4">Send</button>
          </form>
        }
      </div> 
     
    </Fragment>
     
  );
}

export default Chat;