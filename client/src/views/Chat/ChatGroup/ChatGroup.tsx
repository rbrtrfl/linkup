import React, { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { io, Socket } from 'socket.io-client';
import { useForm } from 'react-hook-form';
import { InputTextArea } from '../../../components/Form/InputTextField/InputTextField';
import HeaderReturn from '../../../components/HeaderReturn/HeaderReturn';
import userApi from '../../../utilities/api/user.api';
import { LuEvent } from '../../../utilities/types/Event';
import { ReactComponent as IoPaperPlane } from '../../../assets/IoPaperPlane.svg';

import './chatGroup.css';
import { User } from '../../../utilities/types/User';
import './msg.css';

interface LocationState {
  state: { currentEvent: LuEvent }
}
interface Message {
  userName: string,
  userPhoto: string,
  userId: number,
  message: string,
  currentUserFlag: boolean,
}

interface ServerToClientEvents {
  noArg: () => void;
  basicEmit: (a: number, b: string, c: Buffer) => void;
}

interface ClientToServerEvents {
  emitMsgFromClient: (userId: number, eventId: number, msg: string) => void;
  joinRoom: (userId: number, eventId: number) => void;
}

export default function ChatGroup() {
  const [messagesState, setMessagesState] = useState<Message[] | null>(null);
  const [textareaheight, setTextareaheight] = useState(1);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const userId = localStorage.getItem('id_user');
  const location = useLocation();
  const { state } = location as LocationState;
  const baseUrl = process.env.REACT_APP_BASE_URL || '/api';
  const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io();

  const scrollToBottom = () => {
    console.log('scrolling');
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    socket.emit('joinRoom', Number(userId), state.currentEvent.id_event);
  }, []);

  const createPost = ({
    userName, userPhoto, userId, message, currentUserFlag,
  }: Message) => {
    const containerMain = document.createElement('div');
    const containerSecondary = document.createElement('div');
    const containerTxt = document.createElement('div');
    const userNameEl = document.createElement('p');
    const userPhotoEl = document.createElement('img');
    const msgContentEl = document.createElement('p');
    const containerClass = `m__containerMain--${currentUserFlag}`;
    containerMain.classList.add('m__containerMain');
    containerMain.classList.add(containerClass);
    containerSecondary.classList.add('m__containerSecondary');
    containerTxt.classList.add('m__containerTxt');
    userNameEl.classList.add('m__userName');
    userPhotoEl.classList.add('m__userPhoto');
    msgContentEl.classList.add('m__content');
    containerMain.appendChild(containerSecondary);
    if (!currentUserFlag) {
      containerSecondary.appendChild(userPhotoEl);
    }
    userPhotoEl.setAttribute('src', userPhoto);
    userPhotoEl.setAttribute('alt', userName);
    containerSecondary.appendChild(containerTxt);
    if (!currentUserFlag) {
      containerTxt.appendChild(userNameEl);
    }
    containerTxt.appendChild(msgContentEl);
    msgContentEl.appendChild(document.createTextNode(message));
    userNameEl.appendChild(document.createTextNode(`${userName} `));
    document.getElementById('msgArea')!.appendChild(containerMain);
    const element = document.getElementById('msgArea');
    element!.scrollTop = element!.scrollHeight;
  };

  const fetchUser = (id: number) => userApi.getUserById(id).then((result) => result.data).catch();

  socket.on('basicEmit', async (userId, eventId, msg) => {
    const fetchedUser: User = await fetchUser(userId);
    const currentUserFlag: boolean = fetchedUser.id_user.toString() === localStorage.getItem('id_user');

    const message: Message = {
      userName: fetchedUser.first_name,
      userPhoto: fetchedUser.profile_picture,
      userId: fetchedUser.id_user,
      message: msg.toString(),
      currentUserFlag,
    };
    if (messagesState?.length) {
      setMessagesState([...messagesState, message]);
    } setMessagesState([message]);
    createPost(message);
  });

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

  return (
    <div className="cG">
      <HeaderReturn text={state.currentEvent.title} luEvent={state.currentEvent} socket={socket} />
      <div className="cG__main-container">
        <div id="msgArea" className="cG__chatMsgsContainer" />
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
