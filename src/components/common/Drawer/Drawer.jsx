import React from 'react';
import './Drawer.css';

export default function Drawer({ isOpen, onClose, children }) {
    return (
        <>
            <div
                className={`drawer-overlay ${isOpen ? 'open' : ''}`}
                onClick={onClose}
                aria-hidden="true"
            />
            <aside
                className={`drawer-panel ${isOpen ? 'open' : ''}`}
                aria-hidden={!isOpen}
            >
                {children}
            </aside>
        </>
    );
}