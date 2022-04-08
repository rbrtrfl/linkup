import React from 'react';
import { MessageContentToDisplay } from '../../utilities/types/ChatTypes';
import './message.css';

function Message({
  userName, userPhoto, message, currentUserFlag,
}: MessageContentToDisplay) {
  const containerClass = `m__containerMain--${currentUserFlag}`;

  if (!currentUserFlag) {
    return (
      <div className={`m__containerMain ${containerClass}`}>
        <div className="m__containerSecondary">
          <img className="m__userPhoto" src={userPhoto} alt={userName} />
          <div className="m__containerTxt">
            <p className="m__userName">{userName}</p>
            <p className="m__content">{message}</p>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className={`m__containerMain ${containerClass}`}>
      <div className="m__containerSecondary">
        <div className="m__containerTxt">
          <p className="m__content">{message}</p>
        </div>
      </div>
    </div>
  );
}

export default Message;
