import React from 'react';
import './Toast.css';

export default function Toast({ message }) {
    if (!message) return null;
    return (
        <div className="toast-banner" role="alert">
            <span>⚠</span>
            <span>{message}</span>
        </div>
    );
}