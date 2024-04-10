import React, { useState, useEffect } from 'react';
import { invoke } from '@tauri-apps/api/tauri';
import Invitations from '../components/Invitations/Invitations';
import AddFriends from '../components/AddFriends/AddFriends';
import Button from '../components/Button/Button';
import { useLocation, useNavigate } from 'react-router-dom';

interface Friend {
  user_id: number;
  username: string;
  status: string;
}

const Friends: React.FC = () => {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [showInvitations, setShowInvitations] = useState(false);
  const [showAddFriends, setShowAddFriends] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const userId = location.state.userId;

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const fetchedFriends = await invoke<Friend[]>('get_friends', { userId });
        setFriends(fetchedFriends);
        console.log(fetchedFriends);
      } catch (error) {
        console.error('Error fetching friends:', error);
      }
    };

    fetchFriends();
  }, []);

  const handleInvitationsClick = () => {
    setShowInvitations(true);
  };

  const handleAddFriendsClick = () => {
    setShowAddFriends(true);
  };

  const handleBackClick = () => {
      navigate('/Home', { state: { userId } });
  };

  return (
    <div>
      <h2>Friends</h2>
      <button onClick={handleInvitationsClick}>Invitations</button>
      <button onClick={handleAddFriendsClick}>Add Friends</button>
      <Button onClick={handleBackClick} buttonText="Back" />
      <ul>
        {friends.map((friend) => (
          <li key={friend.user_id}>{friend.username}</li>
        ))}
      </ul>
      {showInvitations && <Invitations userId={userId} onClose={() => setShowInvitations(false)} />}
      {showAddFriends && <AddFriends userId={userId} onClose={() => setShowAddFriends(false)} />}
    </div>
  );
};

export default Friends;
