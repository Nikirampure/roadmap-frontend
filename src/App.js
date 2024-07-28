import React from "react";
import { PipelineToolbar } from "./toolbar";
import { PipelineUI } from "./ui";
import "./index.css";

function App() {
  return (
    <div className="d-flex">
      <PipelineToolbar />
      <PipelineUI />
    </div>
  );
}

export default App;
