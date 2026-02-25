import { type ReactNode } from 'react';

interface ModalProps {
    open: boolean;
    onClose: () => void;
    children?: ReactNode;
}

export default function Modal({open, onClose, children}: ModalProps) {
    return (
        <div className = {`fixed inset-0 z-50 flex justify-center items-center transition-colors ${open ? "visible bg-black/30" : "invisible"}`}>
            <div className={`bg-white rounded-xl shadow p-6 pb-4 transition-all wfit ${open ? "scale-100 opacity-100": "scale-125 opacity-0"}`}>
                <button onClick={(e) => {
                    onClose();
                    e.stopPropagation()
                }} 
                className = "font-nunito text-2xl text-black absolute top-1 right-1.5 hover:text-black/80 cursor-pointer">
                    X
                </button>
                {children}
            </div>
        </div>
    )
}