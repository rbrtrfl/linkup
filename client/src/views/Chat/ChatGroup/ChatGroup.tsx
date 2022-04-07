import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { io, Socket } from 'socket.io-client';
import { useForm } from 'react-hook-form';
import { v4 as uuidv4 } from 'uuid';
import { InputTextArea } from '../../../components/Form/InputTextField/InputTextField';
import HeaderReturn from '../../../components/HeaderReturn/HeaderReturn';
import { ReactComponent as IoPaperPlane } from '../../../assets/IoPaperPlane.svg';
import {
  MessageFromDb, MessageContentToDisplay, ServerToClientEvents, ClientToServerEvents, LocationState,
} from '../../../utilities/types/ChatTypes';
import './chatGroup.css';
import Message from '../../../components/Message/Message';

export default function ChatGroup() {
  const [messagesState, setMessagesState] = useState<MessageContentToDisplay[] | []>([]);
  const [textareaheight, setTextareaheight] = useState(1);
  const userId = localStorage.getItem('id_user');
  const location = useLocation();
  const { state } = location as LocationState;
  const socket:
    Socket<ServerToClientEvents, ClientToServerEvents> = io(process.env.REACT_APP_BASE_URL!);
  useEffect(() => {
    socket.emit('joinRoom', Number(userId), state.currentEvent.id_event);
  }, []);

  function scrollToBottom() {
    const element = document.getElementById('msgArea');
    element!.scrollTop = element!.scrollHeight;
  }

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const sendMessage = (input: any) => {
    setTextareaheight(1);
    reset();
    socket.emit('emitMsgFromClient', Number(userId), state.currentEvent.id_event, input.message);
  };

  function changeTextAreaHeight(event: any) {
    const height = event.target.scrollHeight;
    const rowHeight = 23;
    const trows = Math.ceil(height / rowHeight) - 2;
    if (textareaheight < 5) {
      setTextareaheight(trows);
    }
  }
  socket.on('emitAllMessagesFromServer', (messages: MessageFromDb[]) => {
    const allMessages: MessageContentToDisplay[] = messages.map((oneMessage) => {
      const currentUserFlag: boolean = oneMessage.user_id.toString() === localStorage.getItem('id_user');
      const message = {
        userName: oneMessage.user.first_name,
        userPhoto: oneMessage.user.profile_picture,
        userId: oneMessage.user.id_user,
        message: oneMessage.content,
        currentUserFlag,
      };
      return message;
    });
    setMessagesState([...allMessages]);
    scrollToBottom();
  });

  socket.on('emitMessageFromServer', async (newMessage) => {
    const currentUserFlag: boolean = newMessage.user_id.toString() === localStorage.getItem('id_user');
    const message: MessageContentToDisplay = {
      userName: newMessage.user.first_name,
      userPhoto: newMessage.user.profile_picture,
      userId: newMessage.user.id_user,
      message: newMessage.content.toString(),
      currentUserFlag,
    };
    setMessagesState((prevState) => [...prevState, message]);
    scrollToBottom();
  });

  return (
    <div className="cG">
      <HeaderReturn text={state.currentEvent.title} luEvent={state.currentEvent} socket={socket} />
      <div className="cG__main-container">
        <div id="msgArea" className="cG__chatMsgsContainer">
          {messagesState && messagesState.map((message) => (
            <Message
              key={uuidv4()}
              userName={message.userName}
              userPhoto={message.userPhoto}
              message={message.message}
              currentUserFlag={message.currentUserFlag}
            />
          ))}
        </div>
        <form onSubmit={handleSubmit(sendMessage)}>
          <div className="cG__input-container">
            <div className="cG__input-textarea">
              <InputTextArea
                type="text"
                errorMessage={errors.description?.message}
                rows={textareaheight}
                id="itf__chat"
                className="itf__chat-container"
                {...register('message', {
                  onChange: (e) => changeTextAreaHeight(e),
                })}
              />
            </div>
            <button className="cG__button" type="submit">
              <IoPaperPlane className="cG__icon" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
