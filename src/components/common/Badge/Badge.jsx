import React from 'react';
import './Badge.css';

export default function Badge({ type, variant, children }) {
    if (type === 'director') {
        const isSigned = variant === 'signed';
        return (
            <span className={`badge-director ${isSigned ? 'signed' : ''}`}>
                {isSigned ? '✓ Director Signed' : '⚠ Director Sign-off'}
            </span>
        );
    }

    return (
        <span className={`badge-tag ${variant || ''}`}>
            {children}
        </span>
    );
}