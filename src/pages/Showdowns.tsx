import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { invoke } from "@tauri-apps/api/tauri";
import Banner from "../components/Banner/Banner";
import Button from "../components/Button/Button";

interface Friend {
  user_id: number;
  username: string;
  status: string;
}

const Showdowns: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [friends, setFriends] = useState<Friend[]>([]);

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const userId = location.state?.userId;
        const fetchedFriends = await invoke<Friend[]>("get_friends", {
          userId,
        });
        setFriends(fetchedFriends);
      } catch (error) {
        console.error("Error fetching friends:", error);
      }
    };

    fetchFriends();
  }, [location.state]);

  const handleChallengeClick = async (friendId: number) => {
    try {
      const userId = location.state?.userId;
      await invoke("create_match", {
        challenger1: userId,
        challenger2: friendId,
        matchType: "STR", // You can change this to the desired match type
      });
      console.log(`Challenge sent to friend with ID ${friendId}`);
    } catch (error) {
      console.error("Error sending challenge:", error);
    }
  };

  const handleBackClick = () => {
    const userId = location.state?.userId;
    navigate("/Home", { state: { userId } });
  };

  return (
    <div>
      <Banner />
      <h2>Showdowns</h2>
      <Button onClick={handleBackClick} buttonText="Back" />
      <ul>
        {friends.map((friend) => (
          <li key={friend.user_id}>
            {friend.username} - {friend.status}
            {friend.status === "ONLINE" && (
              <button onClick={() => handleChallengeClick(friend.user_id)}>
                Challenge
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Showdowns;
