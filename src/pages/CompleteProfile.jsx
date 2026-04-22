import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function CompleteProfile() {
  const [rollNo, setRollNo] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.post(
        "https://smartattendancecs.onrender.com/api/auth/complete-profile",
        { rollNo },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Profile completed!");
      navigate("/dashboard");

    } catch (err) {
      console.log(err);
      alert("Error completing profile");
    }
  };

  return (
    <div style={{ padding: "40px" }}>
      <h2>Complete Your Profile</h2>

      <input
        type="text"
        placeholder="Enter Roll Number"
        value={rollNo}
        onChange={(e) => setRollNo(e.target.value)}
      />

      <br /><br />

      <button onClick={handleSubmit}>
        Submit
      </button>
    </div>
  );
}
