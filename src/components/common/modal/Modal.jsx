import './Modal.css';

export default function Modal({ isOpen, onClose, children }) {
    if (!isOpen) return null;

    return (
        <>
            <div
                className="modal-overlay open"
                onClick={onClose}
                aria-hidden="true"
            />
            <div
                className="modal-content open"
                role="dialog"
                aria-modal="true"
                tabIndex={-1}
            >
                {children}
            </div>
        </>
    );
}   