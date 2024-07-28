import React, { useEffect, useState } from "react";
import { Card } from "react-bootstrap";
import { DraggableNode } from "./draggableNode";
import SubmitButton from "./submit";
import { HiOutlineViewGridAdd } from "react-icons/hi";
import LoginButton from "./loginButton";
import LogoutButton from "./logoutButton";
import Profile from "./profile";
import { useStore } from "./store";
import { useAuth0 } from "@auth0/auth0-react";
import "./index.css";

const PipelineToolbar = () => {
  const { user, isAuthenticated } = useAuth0();
  const {
    fetchProjectTitles,
    clearRoadmap,
    fetchRoadmapFromBackend,
    newTitle,
    setSelectedTitle,
    setAuth0User,
  } = useStore();
  const [projectTitles, setProjectTitles] = useState([]);

  useEffect(() => {
    if (isAuthenticated && user) {
      setAuth0User({ user, isAuthenticated });
    }
  }, [isAuthenticated, user, setAuth0User]);

  useEffect(() => {
    const fetchTitles = async () => {
      const titles = await fetchProjectTitles(user.email);
      setProjectTitles(titles.projects);
      console.log("these are titles: ", titles.projects);
    };
    if (user) {
      fetchTitles();
    }
    clearRoadmap();
  }, [user]);

  const { selectedTitleIndex, setSelectedTitleIndex } = useStore((state) => ({
    selectedTitleIndex: state.selectedTitleIndex,
    setSelectedTitleIndex: state.setSelectedTitleIndex,
  }));

  const handleTitleClick = async (index, title) => {
    await clearRoadmap();
    await setSelectedTitleIndex(index);
    await fetchRoadmapFromBackend(user.email, title);
    await setSelectedTitle(title);
  };

  return (
    <Card
      className="toolbar"
      style={{ width: "250px", height: "100vh", overflowY: "hidden" }}
    >
      <Card.Body style={{ padding: "10px" }}>
        <div
          style={{
            marginBottom: "20px",
            textAlign: "center",
            fontFamily: "Arial, sans-serif",
          }}
        >
          <h1
            style={{
              margin: "0",
              fontWeight: "bold",
              fontSize: "24px",
              color: "#333",
              textTransform: "uppercase",
              letterSpacing: "2px",
            }}
          >
            Navigator <span style={{ color: "rgb(22 61 69)" }}>X</span>
          </h1>
          <p style={{ margin: "10px 0 0", fontSize: "16px", color: "#666" }}>
            From Concepts to Clarity
          </p>
        </div>

        <div
          className="chat-item-new"
          onClick={() => {
            window.location.reload();
          }}
        >
          <HiOutlineViewGridAdd /> New Project
        </div>

        <div className="chat-history">
          {newTitle && (
            <div
              className={`chat-item ${
                selectedTitleIndex === -1 ? "active" : ""
              }`}
              onClick={() => handleTitleClick(-1, newTitle)}
            >
              {newTitle}
            </div>
          )}

          {projectTitles.length > 0 &&
            projectTitles.map((title, index) => (
              <div
                key={index}
                className={`chat-item ${
                  index === selectedTitleIndex ? "active" : ""
                }`}
                onClick={() => handleTitleClick(index, title)}
              >
                {title}
              </div>
            ))}
        </div>
      </Card.Body>

      {selectedTitleIndex != null && (
        <DraggableNode type="RoadMap" label="Drag and Drop" />
      )}

      <hr style={{ margin: "10px 0" }} />

      {/* <div style={{ marginTop: "10px", textAlign: "center" }}>
        <SubmitButton />
      </div> */}
      <div style={{ marginTop: "10px", textAlign: "center" }}>
        {isAuthenticated ? <LogoutButton /> : <LoginButton />}
      </div>
      <div style={{ margin: "10%", textAlign: "start" }}>
        <Profile />
      </div>
    </Card>
  );
};

export { PipelineToolbar };
