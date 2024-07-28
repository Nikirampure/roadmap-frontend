import React, { useState, useEffect, useRef } from "react";
import { Handle, Position } from "reactflow";
import { Card } from "react-bootstrap";
import { useStore } from "../store";

const Node = ({ id, label, content, inputs, outputs }) => {
  const [title, setTitle] = useState(content.title);
  const [description, setDescription] = useState(content.description);
  const descriptionRef = useRef(null);

  const updateNodeField = useStore((state) => state.updateNodeField);
  const saveRoadmapToBackend = useStore((state) => state.saveRoadmapToBackend);
  const auth0User = useStore((state) => state.auth0User);
  const newTitle = useStore((state) => state.newTitle);

  useEffect(() => {
    adjustTextAreaSize(descriptionRef);
  }, []);

  const handleChange = async (e) => {
    const { name, value } = e.target;
    if (name === "title") {
      setTitle(value);
      updateNodeField(id, "title", value); // update the store
    } else if (name === "description") {
      setDescription(value);
      updateNodeField(id, "description", value); // update the store
      adjustTextAreaSize(descriptionRef);
    }

    // Save the updated roadmap to the backend
    if (auth0User && auth0User.user) {
      await saveRoadmapToBackend(auth0User.user.email, newTitle);
    }
  };

  const adjustTextAreaSize = (ref) => {
    if (ref.current) {
      ref.current.style.height = "auto";
      ref.current.style.height = `${ref.current.scrollHeight}px`;
    }
  };

  return (
    <Card className="node-card">
      <Card.Body>
        <div className="node-title-container">
          <input
            type="text"
            name="title"
            value={title}
            onChange={handleChange}
            className="node-title-input"
            placeholder="Enter title"
          />
        </div>
        <div className="node-input-container">
          <textarea
            ref={descriptionRef}
            name="description"
            value={description}
            onChange={handleChange}
            className="node-textarea"
            placeholder="Describe the node..."
          />
        </div>
        {inputs.map((handle, index) => (
          <Handle
            key={index}
            type="target"
            position={Position.Left}
            id={handle.id}
            style={{ top: `${index * 20 + 40}px` }}
          />
        ))}
        {outputs.map((output, index) => (
          <Handle
            key={index}
            type="source"
            position={Position.Right}
            id={`${id}-output-${index}`}
            style={{ top: "50%" }}
          />
        ))}
      </Card.Body>
    </Card>
  );
};

export default Node;
