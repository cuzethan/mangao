import { type ReactNode } from 'react';

interface ModalProps {
    open: boolean;
    onClose: () => void;
    children?: ReactNode;
}

export default function Modal({open, onClose, children}: ModalProps) {
    return (
        <div className = {`fixed inset-0 flex justify-center items-center transition-colors ${open ? "visible bg-black/30" : "invisible"}`}>
            <div className={`bg-white rounded-xl shadow p-6 transition-all ${open ? "scale-100 opacity-100": "scale-125 opacity-0"}`}>
                <button onClick={onClose} className = "text-black absolute top-1 right-1.5 hover:text-black/80">
                    X
                </button>
                {children}
            </div>
        </div>
    )
}