
'use client';

import { useState } from 'react';
import { AuthModal } from './AuthModals';

interface SignInButtonProps {
  text?: string;
  className?: string;
  mode?: 'signin' | 'signup';
}

export function SignInButton({ 
  text = "Sign In", 
  className = "",
  mode = 'signin' 
}: SignInButtonProps) {
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<'signin' | 'signup'>(mode);

  return (
    <>
      <button
        onClick={() => {
          setModalMode(mode);
          setShowModal(true);
        }}
        className={`px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors ${className}`}
      >
        {text}
      </button>

      <AuthModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        mode={modalMode}
        onSwitchMode={setModalMode}
      />
    </>
  );
}
