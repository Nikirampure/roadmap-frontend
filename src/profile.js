import React, { useState} from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Modal, Button } from "react-bootstrap";

const Profile = () => {
  const { user, isAuthenticated, isLoading, logout } = useAuth0();
  const [showModal, setShowModal] = useState(false);

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);
  const handleLogout = () => {
    logout({ returnTo: window.location.origin });
  };

  if (isLoading) {
    return <div>Loading ...</div>;
  }

  if (isAuthenticated) {
    console.log("User object:", user); // Debugging: Check the user object

    return (
      <>
        <div
          className="user-profile d-flex align-items-center"
          onClick={handleShowModal}
          style={{ cursor: "pointer" }}
        >
          <img
            src={user.picture}
            alt={user.name}
            style={{
              borderRadius: "50%",
              width: "40px",
              height: "40px",
              marginRight: "10px",
            }}
            onError={(e) => {
              e.target.style.display = "none";
            }} // Hide image if there's an error
          />
          <span
            className="user-name"
            style={{ color: "#fff", fontWeight: "bold", fontSize: "1rem" }}
          >
            {user.name}
          </span>
        </div>

        <Modal show={showModal} onHide={handleCloseModal} centered>
          <Modal.Header closeButton>
            <Modal.Title>Profile Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>Name: {user.name}</p>
            <p>Email: {user.email}</p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleLogout}>
              Logout
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }

  return null;
};

export default Profile;
