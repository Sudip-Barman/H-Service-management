import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Remove authentication data
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    localStorage.removeItem("userRole");
    localStorage.removeItem("demoUser");

    // Redirect to login
    navigate("/login", { replace: true });
  }, [navigate]);

  return null;
};

export default Logout;