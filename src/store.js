import { create } from "zustand";
import {
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  MarkerType,
} from "reactflow";
import axios from "axios";

export const useStore = create((set, get) => ({
  nodes: [],
  edges: [],
  nodeIDs: {},
  newTitle: "",
  setNewTitle: (title) => set({ newTitle: title }),
  selectedTitle: "",
  setSelectedTitle: (title) => set({ selectedTitle: title }),
  selectedTitleIndex: null,
  setSelectedTitleIndex: (index) => set({ selectedTitleIndex: index }),

  auth0User: null,
  setAuth0User: (auth0User) => set({ auth0User }),

  getNodeID: (type) => {
    const { nodes, nodeIDs } = get();
    const idPrefix = `${type}-`;

    // Find the highest number used for this type
    const existingIDs = nodes
      .filter((node) => node.id.startsWith(idPrefix))
      .map((node) => parseInt(node.id.replace(idPrefix, ""), 10))
      .filter((id) => !isNaN(id));

    // Determine the new ID based on the highest existing ID
    const newIDNumber = existingIDs.length ? Math.max(...existingIDs) + 1 : 1;

    // Update the nodeIDs in the store
    const newIDs = { ...nodeIDs, [type]: newIDNumber };
    set({ nodeIDs: newIDs });

    return `${type}-${newIDNumber}`;
  },
  addNode: async (node) => {
    const newNodes = [...get().nodes, node];
    set({ nodes: newNodes });
    console.log("Updated Nodes:", newNodes);
    console.log("Edges:", get().edges);
    get().printRoadmap();

    // Check if auth0User is available
    const { auth0User } = get();
    if (!auth0User || !auth0User.user) {
      console.error("Auth0 user is not available.");
      return;
    }

    const { user } = auth0User;
    await get().saveRoadmapToBackend(user.email);
  },
  onNodesChange: async (changes) => {
    const newNodes = applyNodeChanges(changes, get().nodes);
    set({ nodes: newNodes });
    console.log("Updated Nodes:", newNodes);
    console.log("Edges:", get().edges);
    get().printRoadmap();

    // Check if auth0User is available
    const { auth0User } = get();
    if (!auth0User || !auth0User.user) {
      console.error("Auth0 user is not available.");
      return;
    }

    const { user } = auth0User;
    await get().saveRoadmapToBackend(user.email, get().newTitle);
  },
  onEdgesChange: async (changes) => {
    const newEdges = applyEdgeChanges(changes, get().edges);
    set({ edges: newEdges });
    console.log("Updated Edges:", newEdges);
    get().printRoadmap();

    // Check if auth0User is available
    const { auth0User } = get();
    if (!auth0User || !auth0User.user) {
      console.error("Auth0 user is not available.");
      return;
    }

    const { user } = auth0User;
    await get().saveRoadmapToBackend(user.email, get().selectedTitle);
  },
  onConnect: async (connection) => {
    const newEdges = addEdge(
      {
        ...connection,
        type: "smoothstep",
        animated: true,
        markerEnd: { type: MarkerType.Arrow, height: "20px", width: "20px" },
      },
      get().edges,
    );
    set({ edges: newEdges });
    console.log("Updated Edges:", newEdges);
    get().printRoadmap();

    // Check if auth0User is available
    const { auth0User } = get();
    if (!auth0User || !auth0User.user) {
      console.error("Auth0 user is not available.");
      return;
    }

    const { user } = auth0User;
    await get().saveRoadmapToBackend(user.email, get().selectedTitle);
  },
  updateNodeField: async (nodeId, fieldName, fieldValue) => {
    const newNodes = get().nodes.map((node) => {
      if (node.id === nodeId) {
        node.data = { ...node.data, [fieldName]: fieldValue };
      }
      return node;
    });
    set({ nodes: newNodes });
    console.log("Updated Nodes:", newNodes);
    console.log("Edges:", get().edges);
    get().printRoadmap();

    // Check if auth0User is available
    const { auth0User } = get();
    if (!auth0User || !auth0User.user) {
      console.error("Auth0 user is not available.");
      return;
    }

    const { user } = auth0User;
    await get().saveRoadmapToBackend(user.email, get().selectedTitle);
  },
  printRoadmap: () => {
    const roadmap = {
      nodes: get().nodes,
      edges: get().edges,
    };
    console.log("Complete Roadmap:", roadmap);
  },
  saveRoadmapToLocalStorage: () => {
    localStorage.setItem("nodes", JSON.stringify(get().nodes));
    localStorage.setItem("edges", JSON.stringify(get().edges));
  },
  loadRoadmapFromLocalStorage: () => {
    const nodes = JSON.parse(localStorage.getItem("nodes")) || [];
    const edges = JSON.parse(localStorage.getItem("edges")) || [];
    set({ nodes, edges });
  },
  clearRoadmap: () => {
    set({ nodes: [], edges: [] });
  },
  saveRoadmapToBackend: async (userEmail, title = null) => {
    const finalTitle =
      get().selectedTitleIndex === -1 ? get().newTitle : get().selectedTitle;

    if (!userEmail || !finalTitle) {
      console.error("User email or title is missing. Cannot save roadmap.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8000/roadmap/save",
        {
          userEmail,
          projectTitle: finalTitle,
          nodes: get().nodes,
          edges: get().edges,
        },
      );
      console.log("Roadmap saved to backend:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error saving roadmap to backend:", error);
      throw error;
    }
  },
  fetchRoadmapFromBackend: async (userEmail, projectTitle) => {
    try {
      const response = await axios.get(
        `http://localhost:8000/roadmap/fetch/${userEmail}/${projectTitle}`,
      );
      const { nodes, edges } = response.data;
      set({ nodes, edges });
      console.log("Roadmap fetched from backend:", { nodes, edges });
      return { nodes, edges };
    } catch (error) {
      console.error("Error fetching roadmap from backend:", error);
    }
  },
  fetchProjectTitles: async (userEmail) => {
    try {
      const response = await axios.get(
        `http://localhost:8000/projects/${userEmail}`,
      );
      const projectTitles = response.data;
      console.log("Project titles fetched:", projectTitles);
      return projectTitles;
    } catch (error) {
      console.error("Error fetching project titles:", error);
    }
  },
}));

export default useStore;
