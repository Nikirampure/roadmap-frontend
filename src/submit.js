// SubmitButton.js

import React from "react";
import { Button } from "react-bootstrap";
import { useStore } from "./store";
import { ToastContainer, toast } from "react-toastify";
import { useAuth0 } from "@auth0/auth0-react";

const SubmitButton = () => {
  const { saveRoadmapToBackend } = useStore();
  const { user, isAuthenticated } = useAuth0();

  const handleClick = async () => {
    if (isAuthenticated) {
      try {
        await saveRoadmapToBackend(user.email, "test2"); // Save to MongoDB
        toast.success("Roadmap saved successfully");
      } catch (error) {
        console.error("Error saving roadmap:", error);
        toast.error("Error saving roadmap. Please check console for details.");
      }
    } else {
      toast.error("Please sign in to save project");
    }
  };

  return (
    <div>
      <Button
        className="submit-button btn btn-primary"
        variant="info"
        style={{ width: "90%", color: "whitesmoke" }}
        onClick={handleClick}
      >
        Save Project
      </Button>
      <ToastContainer position="bottom-right" autoClose={5000} />
    </div>
  );
};

export default SubmitButton;
