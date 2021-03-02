import React, { Fragment, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

import Link from 'next/link';

import fire from '../../config/fire-config';

const Chat = (props) => {

  const user = useSelector ((state) => state.user);
  const [content, setContent] = useState('');
  const [chats, setChats] = useState([]);

  useEffect(() => {
    let _chats;

    if(!props.userName) {
      return;
    }

    fire.firestore()
      .collection('chats').doc(props.userName).collection(props.chatId)
      .onSnapshot(querySnapshot => {
        _chats = [];
        querySnapshot.forEach((doc) => {
          _chats.push(doc.data());
        });
        _chats.sort((a, b) => { return a.timestamp - b.timestamp })
        setChats(_chats);
      });
  },[]);

  const handleSubmit = (event) => {
    event.preventDefault();
    //const chatArea = this.myRef.current;

    console.log(content, user.currentUser.displayName);

    try {

      fire.firestore()
      .collection('chats').doc(props.userName).collection(props.chatId)
      .add({
        content: content,
        timestamp: Date.now(),
        userName: user.currentUser.displayName
      });

      setContent('');

      //chatArea.scrollBy(0, chatArea.scrollHeight);
      
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
    <div id="chat-content">
      <div id="chat-area">
        {chats.map((chat, i) => {
          return <p key={i} className={"chat-bubble " + (user.currentUser.displayName === chat.userName ? "current-user" : "")}>
            <strong>{chat.userName}:</strong> {chat.content}
             {formatTime(chat.timestamp)}
          </p>
        })}
      </div>
      <div id="chat-input">
        {!user.loggedIn?
          <Fragment>
            <li className="nav-item ml-3">
            <Link href="/register">
                <a>Register</a>
              </Link>
            </li>
            <li className="nav-item ml-3"> 
              <Link href="/login">
                <a> Login</a>
              </Link>
            </li>
          </Fragment>
        :
          <form onSubmit={handleSubmit}>
            <textarea className="form-control" value={content} onChange={({target}) => setContent(target.value)} />
            <button type="submit" className="btn btn-submit px-5 mt-4">Send</button>
          </form>
        }
      </div>        
    </div>
     
    </Fragment>
     
  );
}

export default Chat;