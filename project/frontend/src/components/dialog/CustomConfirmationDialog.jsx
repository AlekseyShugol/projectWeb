import React from 'react';
import '../../styles/CustomConfirmationDialog.css';

const CustomConfirmationDialog = ({ message, onConfirm, onCancel }) => {
    return (
        <div className="confirmation-dialog">
            <div className="confirmation-box">
                <h3>{message}</h3>
                <button className="confirm-button-dialog" onClick={onConfirm}>Да</button>
                <button className="cancel-button-dialog" onClick={onCancel}>Нет</button>
            </div>
        </div>
    );
};

export default CustomConfirmationDialog;