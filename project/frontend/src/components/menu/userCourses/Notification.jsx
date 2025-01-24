import React from 'react';
import '../../../styles/Notification.css'; // Подключите нужные стили

const Notification = ({ message, onClose }) => {
    return (
        <div className="notification">
            <p>{message}</p>
            <button onClick={onClose}>Закрыть</button>
        </div>
    );
};

export default Notification;