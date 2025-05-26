'use client';

import { useState } from 'react';
import { signOut, useSession } from 'next-auth/react';
import { User, LogOut } from 'lucide-react';
import { AuthModal } from './AuthModals';

export default function AuthButton() {
  const { data: session, status } = useSession();
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<'signin' | 'signup'>('signin');
  const [showUserMenu, setShowUserMenu] = useState(false);

  if (status === 'loading') {
    return (
      <div className="bg-gray-700 px-4 py-2 rounded-full animate-pulse">
        <div className="w-20 h-5 bg-gray-600 rounded"></div>
      </div>
    );
  }

  if (session?.user) {
    return (
      <div className="relative">
        <button
          onClick={() => setShowUserMenu(!showUserMenu)}
          className="flex items-center space-x-2 bg-gray-700 hover:bg-gray-600 px-3 py-2 rounded-full transition-colors"
        >
          {session.user.image ? (
            <img
              src={session.user.image}
              alt={session.user.name || 'User'}
              className="w-6 h-6 rounded-full"
            />
          ) : (
            <User className="w-6 h-6 text-gray-400" />
          )}
          <span className="text-sm text-white">
            {session.user.name || session.user.username || 'User'}
          </span>
        </button>

        {/* User Dropdown Menu */}
        {showUserMenu && (
          <div className="absolute right-0 top-full mt-2 w-48 bg-gray-800 rounded-lg shadow-xl border border-gray-700 py-2 z-50">
            <div className="px-4 py-2 border-b border-gray-700">
              <p className="text-sm font-medium text-white">
                {session.user.name || session.user.username}
              </p>
              <p className="text-xs text-gray-400">{session.user.email}</p>
            </div>
            
            <button
              onClick={() => {
                signOut({ callbackUrl: '/' });
                setShowUserMenu(false);
              }}
              className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign out</span>
            </button>
          </div>
        )}

        {/* Click outside to close menu */}
        {showUserMenu && (
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowUserMenu(false)}
          />
        )}
      </div>
    );
  }

  return (
    <>
      <button
        onClick={() => {
          setModalMode('signin');
          setShowModal(true);
        }}
        className="flex items-center space-x-2 bg-blue-300 hover:bg-blue-700 px-4 py-2 rounded-full transition-colors duration-200"
      >
        <span className='text-black'>Connect with</span>
        <img src="../images/x-black.png" width={20} alt="" />
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