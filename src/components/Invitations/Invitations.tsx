import React, { useEffect, useState } from 'react';
import { invoke } from '@tauri-apps/api/tauri';

interface InvitationsProps {
  onClose: () => void;
  userId: number;
}

interface Invitation {
  user_id: number;
  username: string;
}

const Invitations: React.FC<InvitationsProps> = ({ onClose, userId }) => {
  const [invitations, setInvitations] = useState<Invitation[]>([]);

  useEffect(() => {
    const fetchInvitations = async () => {
      try {
        const fetchedInvitations = await invoke<Invitation[]>('get_invitations', { userId });
        setInvitations(fetchedInvitations);
      } catch (error) {
        console.error('Error fetching invitations:', error);
      }
    };

    fetchInvitations();
  }, [userId]);

  const handleAcceptInvitation = async (senderId: number) => {
    try {
      await invoke('update_friend_request', { userId: senderId, friendId: userId, status: 'ACCEPTED' });
      // Update the UI or show a success message
      setInvitations(invitations.filter((invitation) => invitation.user_id !== senderId));
    } catch (error) {
      console.error('Error accepting invitation:', error);
    }
  };

  const handleRejectInvitation = async (senderId: number) => {
    try {
      await invoke('update_friend_request', { user_id: senderId, friend_id: userId, status: 'REJECTED' });
      // Update the UI or show a success message
      setInvitations(invitations.filter((invitation) => invitation.user_id !== senderId));
    } catch (error) {
      console.error('Error rejecting invitation:', error);
    }
  };

  return (
    <div className="modal">
      <h2>Friend Invitations</h2>
      <ul>
        {invitations.map((invitation) => (
          <li key={invitation.user_id}>
            {invitation.username}
            <button onClick={() => handleAcceptInvitation(invitation.user_id)}>Accept</button>
            <button onClick={() => handleRejectInvitation(invitation.user_id)}>Reject</button>
          </li>
        ))}
      </ul>
      <button onClick={onClose}>Close</button>
    </div>
  );
};

export default Invitations;
