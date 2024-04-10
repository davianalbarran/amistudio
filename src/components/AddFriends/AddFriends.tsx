import React, { useState } from 'react';
import { invoke } from '@tauri-apps/api/tauri';

interface AddFriendsProps {
  onClose: () => void;
  userId: number;
}

interface UserResult {
  user_id: number;
  username: string;
}

const AddFriends: React.FC<AddFriendsProps> = ({ onClose, userId }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<UserResult[]>([]);

  const handleSearch = async () => {
    try {
      const results = await invoke<UserResult[]>('search_users', { username: searchTerm });
      setSearchResults(results);
    } catch (error) {
      console.error('Error searching users:', error);
    }
  };

  const handleAddFriend = async (friendId: number) => {
    try {
      await invoke('send_friend_request', { userId, friendId });
      // Update the UI or show a success message
    } catch (error) {
      console.error('Error sending friend request:', error);
    }
  };

  return (
    <div className="modal">
      <h2>Add Friends</h2>
      <input
        type="text"
        placeholder="Search by username"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <button onClick={handleSearch}>Search</button>
      <ul>
        {searchResults.map((user) => (
          <li key={user.user_id}>
            {user.username}
            <button onClick={() => handleAddFriend(user.user_id)}>Add Friend</button>
          </li>
        ))}
      </ul>
      <button onClick={onClose}>Close</button>
    </div>
  );
};

export default AddFriends;
