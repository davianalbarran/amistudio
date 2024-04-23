// MatchSimulation.tsx

import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
// import { invoke } from "@tauri-apps/api/tauri";

const MatchSimulation: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [matchState, setMatchState] = useState<
    "LOADING" | "SIMULATING" | "DETERMINING_WINNER" | "COMPLETED"
  >("LOADING");
  const [winner, setWinner] = useState<string | null>(null);
  const [renown, setRenown] = useState<number | null>(null);
  const [loadingDots, setLoadingDots] = useState<number>(0);
  const [simulatingDots, setSimulatingDots] = useState<number>(0);
  const [determiningWinnerDots, setDeterminingWinnerDots] = useState<number>(0);

  useEffect(() => {
    const simulateMatch = async () => {
      try {
        //const matchId = location.state?.matchId;

        // Simulating loading state
        setMatchState("LOADING");
        const loadingInterval = setInterval(() => {
          setLoadingDots((prevDots) => (prevDots + 1) % 4);
        }, 1000);

        await new Promise((resolve) => setTimeout(resolve, 4000)); // Wait for 3 seconds

        // Simulating match state
        setMatchState("SIMULATING");
        const simulatingInterval = setInterval(() => {
          setSimulatingDots((prevDots) => (prevDots + 1) % 4);
        }, 1000);

        await new Promise((resolve) => setTimeout(resolve, 4000)); // Wait for 3 seconds

        // Simulating determining winner state
        setMatchState("DETERMINING_WINNER");
        const determiningWinnerInterval = setInterval(() => {
          setDeterminingWinnerDots((prevDots) => (prevDots + 1) % 4);
        }, 1000);

        await new Promise((resolve) => setTimeout(resolve, 4000)); // Wait for 3 seconds

        // Simulating completion state
        setMatchState("COMPLETED");
        // TODO: Invoke Tauri command to determine the winner and renown
        // For now, setting dummy values
        setWinner("Player 1");
        setRenown(100);

        // TODO: Invoke Tauri command to update the match status to COMPLETED
        // await invoke("update_match_status", { matchId, status: "COMPLETED" });

        // Clear the intervals
        clearInterval(loadingInterval);
        clearInterval(simulatingInterval);
        clearInterval(determiningWinnerInterval);
      } catch (error) {
        console.error("Error simulating match:", error);
      }
    };

    simulateMatch();
  }, [location.state]);

  const renderLoadingState = () => {
    return <div>Loading{".".repeat(loadingDots)}</div>;
  };

  const renderSimulatingState = () => {
    return <div>Simulating match{".".repeat(simulatingDots)}</div>;
  };

  const renderDeterminingWinnerState = () => {
    return <div>Determining Winner{".".repeat(determiningWinnerDots)}</div>;
  };

  const renderCompletionState = () => {
    const handleBackToHomeClick = () => {
      const userId = location.state?.userId;
      navigate("/Home", { state: { userId } });
    };

    return (
      <div>
        <div>Winner: {winner}</div>
        <div>Renown: {renown}</div>
        <button onClick={handleBackToHomeClick}>Back to Home</button>
      </div>
    );
  };

  return (
    <div>
      <h2>Match Simulation</h2>
      {matchState === "LOADING" && renderLoadingState()}
      {matchState === "SIMULATING" && renderSimulatingState()}
      {matchState === "DETERMINING_WINNER" && renderDeterminingWinnerState()}
      {matchState === "COMPLETED" && renderCompletionState()}
    </div>
  );
};

export default MatchSimulation;
