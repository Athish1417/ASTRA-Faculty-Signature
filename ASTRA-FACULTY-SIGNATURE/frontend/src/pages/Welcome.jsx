import { useNavigate } from "react-router-dom";
import Header from "../components/Header.jsx";
import { PrimaryButton } from "../components/Buttons.jsx";
import "./Welcome.css";

export default function Welcome() {
  const navigate = useNavigate();

  return (
    <div className="screen welcome-screen">
      <Header />

      <main className="welcome-screen__content">
        <p className="eyebrow">&#10022; A WARM WELCOME &#10022;</p>

        <h1 className="display-heading">
          Welcome to
          <br />
          <span className="astra-word">ASTRA</span> <span className="accent">2K26</span>
        </h1>

        <p className="body-copy">
          We are delighted to have you with us.
          <br />
          <br />
          Dear Faculty, thank you for being a part of this special occasion.
        </p>

        <PrimaryButton onClick={() => navigate("/select")}>Continue</PrimaryButton>

        <p className="fine-print">Faculty Check-In &amp; Digital Signature</p>
      </main>
    </div>
  );
}
