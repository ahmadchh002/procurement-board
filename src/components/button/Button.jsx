import React from 'react';
import './Button.css';

export default function Button({ variant = 'primary', onClick, children, ariaLabel }) {
    const className = variant === 'close' ? 'btn-base btn-close' : 'btn-base btn-primary';
    return (
        <button className={className} onClick={onClick} aria-label={ariaLabel}>
            {children}
        </button>
    );
}