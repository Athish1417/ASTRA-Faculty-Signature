import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../components/Header.jsx";
import Robot from "../components/Robot.jsx";
import { SecondaryButton } from "../components/Buttons.jsx";
import { api } from "../services/api.js";
import "./Success.css";

export default function Success() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [name, setName] = useState("");

  useEffect(() => {
    let cancelled = false;
    api
      .getFaculty(id)
      .then((data) => {
        if (!cancelled) setName(data.name);
      })
      .catch(() => {
        /* Non-critical — the confirmation still displays without the name. */
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  return (
    <div className="screen success-screen">
      <Header />

      <main className="success-screen__content">
        <div className="success-screen__check" aria-hidden="true">✓</div>

        <h1 className="section-heading">SIGNATURE RECEIVED</h1>

        <p className="body-copy">
          {name ? `Thank you, ${name.split(" ")[0]}!` : "Thank you!"}
          <br />
          Your signature has been successfully recorded for ASTRA 2K26.
        </p>

        <Robot size="lg" className="success-screen__robot" />

        <SecondaryButton onClick={() => navigate("/")}>Back to Home</SecondaryButton>

        <p className="fine-print">ASTRA 2K26 &middot; FACULTY</p>
      </main>
    </div>
  );
}
