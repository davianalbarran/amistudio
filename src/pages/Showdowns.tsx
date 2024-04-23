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

interface MatchInvitation {
  match_id: number;
  challenger_1: number;
  match_type: string;
}

interface UserStatus {
  user_id: number;
  status: string;
}

const Showdowns: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [friends, setFriends] = useState<Friend[]>([]);
  const [challengedFriends, setChallengedFriends] = useState<number[]>([]);
  const [sentMatchInvitations, setSentMatchInvitations] = useState<
    MatchInvitation[]
  >([]);

  const [matchInvitations, setMatchInvitations] = useState<MatchInvitation[]>(
    [],
  );

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

    const fetchMatchInvitations = async () => {
      try {
        const userId = location.state?.userId;
        const invitations = await invoke<MatchInvitation[]>(
          "get_match_invitations",
          { userId },
        );
        setMatchInvitations(invitations);
      } catch (error) {
        console.error("Error fetching match invitations:", error);
      }
    };

    fetchMatchInvitations();

    const fetchSentMatchInvitations = async () => {
      try {
        const userId = location.state?.userId;
        const invitations = await invoke<MatchInvitation[]>(
          "get_sent_match_invitations",
          { userId },
        );
        setSentMatchInvitations(invitations);
      } catch (error) {
        console.error("Error fetching sent match invitations:", error);
      }
    };

    fetchSentMatchInvitations();
  }, [location.state]);

  const isFriendInvited = (friendId: number) => {
    return sentMatchInvitations.some(
      (invitation) => invitation.challenger_1 === friendId,
    );
  };

  const handleChallengeClick = async (friendId: number) => {
    try {
      const userId = location.state?.userId;
      await invoke("create_match", {
        challenger1: userId,
        challenger2: friendId,
        matchType: "STR",
      });
      console.log(`Challenge sent to friend with ID ${friendId}`);
      setChallengedFriends((prevChallengedFriends) => [
        ...prevChallengedFriends,
        friendId,
      ]);
    } catch (error) {
      console.error("Error sending challenge:", error);
    }
  };

  const isFriendChallenged = (friendId: number) => {
    return challengedFriends.includes(friendId);
  };

  const handleBackClick = () => {
    const userId = location.state?.userId;
    navigate("/Home", { state: { userId } });
  };

  const handleAcceptInvitation = async (
    matchId: number,
    challengerId: number,
  ) => {
    try {
      const userStatus = await invoke<UserStatus>("get_user_status", {
        userId: challengerId,
      });

      if (userStatus.status === "ONLINE") {
        await invoke("update_match_status", { matchId, status: "ACCEPTED" });
        setMatchInvitations((prevInvitations) =>
          prevInvitations.filter(
            (invitation) => invitation.match_id !== matchId,
          ),
        );
        navigate("/MatchSimulation", {
          state: { matchId, userId: location.state?.userId },
        }); // Navigate to MatchSimulation page
      } else {
        alert(
          "The user who sent the invite is no longer online. The match cannot be accepted.",
        );
      }
    } catch (error) {
      console.error("Error accepting match invitation:", error);
    }
  };

  const handleRejectInvitation = async (matchId: number) => {
    try {
      await invoke("update_match_status", { matchId, status: "REJECTED" });
      setMatchInvitations((prevInvitations) =>
        prevInvitations.filter((invitation) => invitation.match_id !== matchId),
      );
    } catch (error) {
      console.error("Error rejecting match invitation:", error);
    }
  };

  return (
    <div>
      <Banner />
      <h2>Showdowns</h2>
      <Button onClick={handleBackClick} buttonText="Back" />
      <h3>Match Invitations</h3>
      <ul>
        {matchInvitations.map((invitation) => (
          <li key={invitation.match_id}>
            Match ID: {invitation.match_id} - Challenger:{" "}
            {invitation.challenger_1} - Type: {invitation.match_type}
            <button
              onClick={() =>
                handleAcceptInvitation(
                  invitation.match_id,
                  invitation.challenger_1,
                )
              }
            >
              Accept
            </button>
            <button onClick={() => handleRejectInvitation(invitation.match_id)}>
              Reject
            </button>
          </li>
        ))}
      </ul>
      <ul>
        {friends.map((friend) => (
          <li key={friend.user_id}>
            {friend.username} - {friend.status}
            {friend.status === "ONLINE" &&
              !isFriendChallenged(friend.user_id) &&
              !isFriendInvited(friend.user_id) && (
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
