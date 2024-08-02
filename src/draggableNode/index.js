export const DraggableNode = ({ type, label }) => {
  const onDragStart = (event, nodeType) => {
    const appData = { nodeType };
    event.target.style.cursor = "grabbing";
    console.log("Dragging node:", appData);
    event.dataTransfer.setData(
      "application/reactflow",
      JSON.stringify(appData),
    );
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <div
      className={type}
      onDragStart={(event) => onDragStart(event, type)}
      onDragEnd={(event) => (event.target.style.cursor = "grab")}
      style={{
        cursor: "grab",
        display: "flex",
        alignItems: "center",
        borderRadius: "50px",
        backgroundColor: "#121212",
        justifyContent: "center",
        flexDirection: "column",
        padding: "10px",
        width: "max-content",
        position: "fixed",
        top: "5%",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 2000,
      }}
      draggable
    >
      <span style={{ color: "#fff", fontSize: "0.7rem" }}>{label}</span>
    </div>
  );
};
