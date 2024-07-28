import React, { useEffect } from "react";
import { Button } from "react-bootstrap";
import { useStore } from "./store";
import { useAuth0 } from "@auth0/auth0-react";
import { toast } from "react-toastify";

const FetchButton = () => {
  const { fetchProjectTitles, fetchRoadmapFromBackend } = useStore();
  const { user, isAuthenticated } = useAuth0();

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchProjectTitles(user.email);
    }
  }, [fetchProjectTitles, isAuthenticated, user]);

  const handleFetch = async () => {
    if (isAuthenticated && user) {
      try {
        await fetchRoadmapFromBackend(user.email, "test");
      } catch (error) {
        console.error("Error fetching roadmap:", error);
        toast.error(
          "Error fetching roadmap. Please check console for details.",
        );
      }
    } else {
      toast.error("Sign in to fetch");
    }
  };

  return (
    <div>
      <Button
        className="fetch-button btn btn-secondary"
        variant="secondary"
        onClick={handleFetch}
      >
        Get Roadmap
      </Button>
    </div>
  );
};

export default FetchButton;
