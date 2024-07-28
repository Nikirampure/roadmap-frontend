// PipelineUI.js
import React, { useState, useRef, useCallback } from "react";
import ReactFlow, { Controls, Background, MiniMap } from "reactflow";
import { useStore } from "./store";
import { shallow } from "zustand/shallow";
import { RoadmapNode } from "./nodes/roadmapNode";
import {
  FaArrowRight,
  FaLightbulb,
  FaCode,
  FaRocket,
  FaLock,
} from "react-icons/fa";
import "reactflow/dist/style.css";
import { Button } from "react-bootstrap";
import { useAuth0 } from "@auth0/auth0-react";

const gridSize = 20;
const proOptions = { hideAttribution: true };
const nodeTypes = {
  RoadMap: RoadmapNode,
};

const selector = (state) => ({
  nodes: state.nodes,
  edges: state.edges,
  getNodeID: state.getNodeID,
  addNode: state.addNode,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  onConnect: state.onConnect,
  selectedTitleIndex: state.selectedTitleIndex,
  setSelectedTitleIndex: state.setSelectedTitleIndex,
  newTitle: state.newTitle, // Include newTitle from store
  setNewTitle: state.setNewTitle, // Include setNewTitle from store
});

const titles = [
  { label: "Machine Learning Model", icon: <FaLightbulb /> },
  { label: "Web Development Project", icon: <FaCode /> },
  { label: "Product Launch Plan", icon: <FaRocket /> },
  { label: "Blockchain Application", icon: <FaLock /> },
];

export const PipelineUI = () => {
  const { isAuthenticated, loginWithRedirect } = useAuth0();
  const reactFlowWrapper = useRef(null);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const {
    nodes,
    edges,
    getNodeID,
    addNode,
    onNodesChange,
    onEdgesChange,
    onConnect,
    selectedTitleIndex,
    setSelectedTitleIndex,
    newTitle, // Destructure newTitle from store
    setNewTitle, // Destructure setNewTitle from store
  } = useStore(selector, shallow);

  const getInitNodeData = (nodeID, type) => {
    let nodeData = { id: nodeID, nodeType: `${type}` };
    return nodeData;
  };

  const handleConnect = useCallback(
    (params) => {
      const { source, target } = params;

      const newEdge = {
        id: `${source}-${target}`,
        source,
        target,
        type: "smoothstep",
        animated: true,
      };
      onConnect(newEdge);
    },
    [onConnect],
  );

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      if (event?.dataTransfer?.getData("application/reactflow")) {
        const appData = JSON.parse(
          event.dataTransfer.getData("application/reactflow"),
        );
        const type = appData?.nodeType;

        if (typeof type === "undefined" || !type) {
          return;
        }

        const position = reactFlowInstance.project({
          x: event.clientX - reactFlowBounds.left,
          y: event.clientY - reactFlowBounds.top,
        });

        const nodeID = getNodeID(type);
        const newNode = {
          id: nodeID,
          type,
          position,
          data: getInitNodeData(nodeID, type),
        };

        addNode(newNode);
        console.log("this is new drag: ");
        console.log(newNode);
      }
    },
    [reactFlowInstance, getNodeID, addNode],
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  // State to manage modal visibility
  const [showModal, setShowModal] = useState(true);

  // Close modal function
  const closeModal = () => {
    setShowModal(false);
  };

  // Handle input change for new project title
  const handleTitleChange = (e) => {
    setNewTitle(e.target.value); // Update newTitle state in store
  };

  return (
    <>
      <div
        ref={reactFlowWrapper}
        style={{ width: "100vw", height: "100vh", backgroundColor: "#1e1e1e" }}
      >
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={handleConnect}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onInit={setReactFlowInstance}
          nodeTypes={nodeTypes}
          proOptions={proOptions}
          snapGrid={[gridSize, gridSize]}
          connectionLineType="smoothstep"
          style={{ zIndex: "2000" }}
        >
          <Background color="#aaa" gap={gridSize} />
          {selectedTitleIndex != null && <Controls />}
          {selectedTitleIndex != null && <MiniMap />}
        </ReactFlow>

        {selectedTitleIndex === null && (
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              padding: "20px",
              borderRadius: "8px",
              textAlign: "center",
              color: "white",
              animation: "fadeIn 1s ease-in-out",
              zIndex: "2000",
            }}
          >
            <h2
              style={{
                fontSize: "2.5rem",
                marginBottom: "20px",
                fontFamily: "'Roboto', sans-serif",
              }}
            >
              Welcome to Mindmap Builder
            </h2>
            <div
              style={{
                position: "relative",
                display: "inline-block",
                width: "100%",
              }}
            >
              <input
                type="text"
                placeholder="Create a project"
                value={newTitle} // Bind value to newTitle state
                onChange={handleTitleChange} // Handle input change
                style={{
                  padding: "15px",
                  paddingRight: "40px", // Adjust padding to make space for the button
                  borderRadius: "10px",
                  border: "none",
                  outline: "none",
                  fontSize: "1.2rem",
                  marginBottom: "20px",
                  backgroundColor: "#333",
                  color: "#fff",
                  width: "100%",
                  boxSizing: "border-box",
                  fontFamily: "'Roboto', sans-serif",
                  transition: "all 0.3s ease-in-out",
                }}
              />
              <button
                style={{
                  position: "absolute",
                  right: "5px",
                  top: "10%",
                  backgroundColor: "#121212",
                  borderRadius: "50%",
                  cursor: "pointer",
                  padding: "10px",
                  border: "none",
                  outline: "none",
                  animation: "bounce 1s",
                  transition: "background-color 0.3s ease",
                }}
                onClick={() => {
                  setSelectedTitleIndex(-1);
                  closeModal();
                }}
              >
                <FaArrowRight color="white" size="1.5rem" />
              </button>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "20px",
                animation: "fadeInUp 1s ease-in-out",
              }}
            >
              {titles.map((title, index) => (
                <div
                  key={index}
                  onClick={() => setSelectedTitleIndex(index)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "15px 20px",
                    borderRadius: "8px",
                    backgroundColor: "#222",
                    cursor: "pointer",
                    transition:
                      "background-color 0.3s ease, transform 0.3s ease",
                    animation: "fadeInUp 0.1s ease-in-out",
                    fontFamily: "'Roboto', sans-serif",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#333";
                    e.currentTarget.style.transform = "scale(1.05)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "#222";
                    e.currentTarget.style.transform = "scale(1)";
                  }}
                >
                  {title.icon}
                  <span
                    style={{
                      marginLeft: "10px",
                      color: "#fff",
                      fontSize: "1rem",
                      fontFamily: "'Roboto', sans-serif",
                    }}
                  >
                    {title.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Modal backdrop */}
        {showModal && !isAuthenticated && (
          <div
            style={{
              position: "fixed",
              top: "0",
              left: "0",
              right: "0",
              bottom: "0",
            }}
          >
            {" "}
            <div
              style={{
                position: "absolute",
                bottom: "20px",
                right: "20px",
                padding: "20px",
                borderRadius: "8px",
                backgroundColor: "#333", // Change to a solid color like "#333"
                color: "white",
                width: "15%",
              }}
            >
              <h5>Welcome to Roadmap Builder</h5>
              <p>Sign in and create a project to save it for later!</p>
              <Button
                className="btn"
                style={{
                  marginRight: "10px",
                  width: "90%",
                  color: "whitesmoke",
                }}
                variant="info"
                onClick={() => loginWithRedirect()}
              >
                Sign In
              </Button>
              <button
                className="btn btn-secondary mt-2"
                style={{ marginRight: "10px", width: "90%" }}
                onClick={closeModal}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default PipelineUI;
