import React from "react";
import Node from "./Node";

const RoadmapNode = ({ id, data }) => {
  const content = {
    title: data?.title || "New Milestone",
    description: data?.description || "Describe the milestone...",
  };

  return (
    <Node
      id={id}
      label="Roadmap Node"
      content={content}
      inputs={[{ id: `${id}-input`, position: "left" }]}
      outputs={[{ id: `${id}-output`, position: "right" }]}
    />
  );
};

export { RoadmapNode };
