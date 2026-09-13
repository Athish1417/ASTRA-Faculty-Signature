import { useEffect, useRef, useState } from "react";
import "./App.css";

function Robot({ image = "/robot.png", className = "" }) {
  return (
    <div className={`robot-container ${className}`}>
      <img
        src={image}
        alt="ASTRA Robot"
        className="robot-image"
      />
    </div>
  );
}
    
function App() {
  const [step, setStep] = useState("welcome");
  const [search, setSearch] = useState("");
  const [selectedFaculty, setSelectedFaculty] = useState(null);
  const [signature, setSignature] = useState(false);
  const [savedSignature, setSavedSignature] = useState(null);
  const [facultyList, setFacultyList] = useState([]);
const [loadingFaculty, setLoadingFaculty] = useState(true);

  const canvasRef = useRef(null);
  const drawingRef = useRef(false);

    // Browser Back/Forward navigation
  useEffect(() => {
    const handlePopState = (event) => {
      if (event.state?.step) {
        setStep(event.state.step);
      } else {
        setStep("welcome");
      }
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  const navigateTo = (nextStep) => {
    window.history.pushState({ step: nextStep }, "", window.location.pathname);
    setStep(nextStep);
  };

  const filteredFaculty = facultyList.filter((faculty) =>
    faculty.name.toLowerCase().includes(search.toLowerCase())
  );

  // -------------------------
  // Signature canvas
  // -------------------------
useEffect(() => {
  const loadFaculty = async () => {
    try {
      const response = await fetch("https://astra-faculty-signature.onrender.com/faculty/")

      if (!response.ok) {
        throw new Error("Failed to load faculty");
      }

      const data = await response.json();
      setFacultyList(data);
    } catch (error) {
      console.error("Error loading faculty:", error);
    } finally {
      setLoadingFaculty(false);
    }
  };

  loadFaculty();
}, []);
  useEffect(() => {
    if (step !== "signature") return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();

      const oldCanvas = document.createElement("canvas");
      oldCanvas.width = canvas.width;
      oldCanvas.height = canvas.height;

      if (canvas.width > 0 && canvas.height > 0) {
        oldCanvas
          .getContext("2d")
          .drawImage(canvas, 0, 0);
      }

      const ratio = window.devicePixelRatio || 1;

      canvas.width = rect.width * ratio;
      canvas.height = rect.height * ratio;

      const ctx = canvas.getContext("2d");

      ctx.scale(ratio, ratio);
      ctx.lineWidth = 2.5;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.strokeStyle = "#171b24";

      if (oldCanvas.width > 0 && oldCanvas.height > 0) {
        ctx.drawImage(
          oldCanvas,
          0,
          0,
          oldCanvas.width,
          oldCanvas.height,
          0,
          0,
          rect.width,
          rect.height
        );
      }
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [step]);

  const getPosition = (event) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();

    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
  };

  const startDrawing = (event) => {
    event.preventDefault();

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const position = getPosition(event);

    drawingRef.current = true;

    ctx.beginPath();
    ctx.moveTo(position.x, position.y);

    canvas.setPointerCapture(event.pointerId);
  };

  const draw = (event) => {
    if (!drawingRef.current) return;

    event.preventDefault();

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const position = getPosition(event);

    ctx.lineTo(position.x, position.y);
    ctx.stroke();

    setSignature(true);
  };

  const stopDrawing = (event) => {
    drawingRef.current = false;

    if (
      canvasRef.current &&
      event.pointerId !== undefined
    ) {
      try {
        canvasRef.current.releasePointerCapture(event.pointerId);
      } catch {
        // Pointer capture may already be released.
      }
    }
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;

    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    ctx.clearRect(
      0,
      0,
      canvas.width,
      canvas.height
    );

    setSignature(false);
  };

  const selectFaculty = async (faculty) => {
  try {
    const response = await fetch(
      `https://astra-faculty-signature.onrender.com/faculty/${faculty.faculty_id}`
    );

    if (!response.ok) {
      throw new Error("Unable to check faculty status");
    }

    const data = await response.json();

    setSelectedFaculty(data);

    if (data.has_signed) {
  navigateTo("already-signed");
} else {
  navigateTo("greeting");
}

  } catch (error) {
    console.error("Error checking signature status:", error);

    alert(
      "Unable to check your signature status. Please try again."
    );
  }
};

  const submitSignature = async () => {
  if (!signature) {
    alert("Please provide your signature first.");
    return;
  }

  const canvas = canvasRef.current;

  if (!canvas || !selectedFaculty) {
    alert("Something went wrong. Please try again.");
    return;
  }

  try {
    const signatureData = canvas.toDataURL("image/png");

    const response = await fetch(
      "https://astra-faculty-signature.onrender.com/signature/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          faculty_id: selectedFaculty.faculty_id,
          signature: signatureData,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      if (response.status === 409) {
        setStep("already-signed");
        return;
      }

      throw new Error(data.detail || "Failed to save signature.");
    }

    setSavedSignature(signatureData);
    setStep("success");

  } catch (error) {
    console.error("Error saving signature:", error);

    alert(
      error.message ||
      "Unable to save your signature. Please try again."
    );
  }
};
  

  const resetSystem = () => {
    setStep("welcome");
    setSearch("");
    setSelectedFaculty(null);
    setSignature(false);
    setSavedSignature(null);
  };

  return (
    <main className="astra-app">

      {/* Background decorative elements */}
      <div className="background-glow glow-one"></div>
      <div className="background-glow glow-two"></div>

      <div className="grid-lines"></div>

      {/* Top futuristic frame */}
      <div className="top-frame">
        <div className="top-left-line"></div>

        <div className="top-left-label">
          <span>+</span>
          <div>
            LEARN
            <br />
            BUILD
            <br />
            CONNECT
            <br />
            CREATE
          </div>
        </div>

        <div className="top-brand">
          <strong>ASTRA</strong>
          <span>2K26</span>
        </div>

        <div className="top-right-label">
          AI <b>×</b> WEB3 <b>×</b> PEOPLE
        </div>
      </div>

      {/* Right decoration */}
      <div className="right-decoration">
        <span>IDEAS</span>
        <span>INTO</span>
        <span>IMPACT</span>
        <i></i>
      </div>

      {/* Globe */}
      <div className="globe">
        <div className="globe-grid"></div>
        <div className="globe-dot"></div>
      </div>

      {/* Main content */}
      <section className="main-content">

        {/* ---------------- WELCOME ---------------- */}
        {step === "welcome" && (
          <div className="screen welcome-screen">

            <div className="eyebrow">
              ✦ A WARM WELCOME ✦
            </div>

            <h1>
              Welcome to
              <span>
                ASTRA <em>2K26</em>
              </span>
            </h1>

            <p className="main-message">
              We are delighted to have you with us.
            </p>

            <p className="faculty-message">
  Dear {selectedFaculty ? selectedFaculty.name : "Faculty"},
  <br />
  thank you for being a part of this special occasion.
</p>

            <button
              className="astra-button"
              onClick={() => navigateTo("faculty")}
            >
              Continue
              <span>→</span>
            </button>

            <p className="bottom-caption">
              Faculty Check-In & Digital Signature
            </p>

          </div>
        )}

        {/* ---------------- FACULTY SEARCH ---------------- */}
        {step === "faculty" && (
          <div className="screen faculty-screen">

            <div className="eyebrow">
              ✦ FACULTY CHECK-IN ✦
            </div>

            <h2>
              Select <span>Your Name</span>
            </h2>

            <p className="screen-description">
              Please select your name to continue.
            </p>

            <div className="search-box">
              <span>⌕</span>

              <input
                type="text"
                placeholder="Search your name..."
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
              />
            </div>

            <div className="faculty-list">

              {filteredFaculty.length === 0 ? (
                <div className="no-result">
                  No faculty member found.
                </div>
              ) : (
                filteredFaculty.map((faculty) => (
                  <button
                    className="faculty-option"
                    key={faculty.id}
                    onClick={() => selectFaculty(faculty)}
                  >
                    <div>
                      <strong>{faculty.name}</strong>
                      <small>
                        {faculty.department}
                      </small>
                    </div>

                    <span>→</span>
                  </button>
                ))
              )}

            </div>

            <button
              className="back-button"
              onClick={() => navigateTo("welcome")}
            >
              ← Back
            </button>

          </div>
        )}

        {/* ---------------- PERSONALIZED GREETING ---------------- */}
        {step === "greeting" && selectedFaculty && (
          <div className="screen greeting-screen">

            <div className="greeting-copy">

              <div className="eyebrow">
                ✦ PERSONALIZED WELCOME ✦
              </div>

              <h2>
                Welcome,
                <span>
                  {selectedFaculty.name}!
                </span>
              </h2>

              <p className="main-message">
                Thank you for joining ASTRA 2K26.
              </p>

              <p className="faculty-message">
                Your presence means a lot to us.
                <br />
                We are delighted to have you with us.
              </p>

              <button
                className="astra-button"
                onClick={() => navigateTo("signature")}
              >
                Continue to Signature
                <span>→</span>
              </button>

            </div>

            <Robot />

          </div>
        )}

        {/* ---------------- SIGNATURE ---------------- */}
        {step === "signature" && selectedFaculty && (
          <div className="screen signature-screen">

            <div className="signature-header">
              <div className="eyebrow">
                ✦ DIGITAL SIGNATURE ✦
              </div>

              <h2>
                Please provide your
                <span>signature</span>
              </h2>

              <p>
                This confirms your presence at ASTRA 2K26.
              </p>
            </div>

            <div className="signature-layout">

              <div className="signature-area">

                <div className="signature-name">
                  {selectedFaculty.name}
                </div>

                <div className="canvas-wrapper">

                  {!signature && (
                    <div className="canvas-placeholder">
                      <span>✎</span>
                      <p>Sign here with your finger</p>
                    </div>
                  )}

                  <canvas
                    ref={canvasRef}
                    onPointerDown={startDrawing}
                    onPointerMove={draw}
                    onPointerUp={stopDrawing}
                    onPointerCancel={stopDrawing}
                    onPointerLeave={stopDrawing}
                  />

                </div>

                <div className="signature-actions">

                  <button
                    className="clear-button"
                    onClick={clearSignature}
                  >
                    ↻ Clear
                  </button>

                  <button
                    className="astra-button"
                    onClick={submitSignature}
                  >
                    Submit
                    <span>→</span>
                  </button>

                </div>

              </div>

              <Robot image="/robot1.png" />

            </div>

          </div>
        )}

        {/* ---------------- ALREADY SIGNED ---------------- */}

{step === "already-signed" && selectedFaculty && (
  <div className="screen success-screen">

    <div className="success-frame">

      {/* LEFT — ROBOT */}

      <div className="success-robot">
        <Robot image="/robot2.png" />
      </div>


      {/* RIGHT — CONTENT */}

      <div className="success-content">

        <div className="success-brand">
          <strong>ASTRA</strong>
          <span>2K26</span>
        </div>

        <div className="success-divider"></div>

        <div className="eyebrow">
          ✦ ALREADY SIGNED ✦
        </div>

        <h2>
          Welcome Back,
          <span>
            {selectedFaculty.name}!
          </span>
        </h2>

        <p className="success-message">
          Your presence and digital signature
          <br />
          have already been recorded.
        </p>

        <div className="signature-result-card">

          <div className="signature-result-label">
            SIGNATURE STATUS
          </div>

          <div className="signature-result-line"></div>

          <div
            style={{
              fontSize: "24px",
              fontWeight: "700",
              margin: "18px 0 8px",
              color: "#ff6800"
            }}
          >
            ✓ Already Signed
          </div>

          <div className="signature-result-name">
            {selectedFaculty.name}
          </div>

        </div>

        <div className="success-tagline">
          Thank you
          <span>×</span>
          ASTRA 2K26
        </div>

        <button
          className="astra-button success-home-button"
          onClick={resetSystem}
        >
          Back to Home
          <span>→</span>
        </button>

      </div>

    </div>

  </div>
)}

        {/* ---------------- SUCCESS ---------------- */}
{step === "success" && selectedFaculty && (
  <div className="screen success-screen">

    <div className="success-frame">
      

      {/* LEFT — ROBOT */}
      <div className="success-robot">
        <Robot image="/robot2.png" />
      </div>

      {/* RIGHT — CONTENT */}
      <div className="success-content">

        <div className="success-brand">
          <strong>ASTRA</strong>
          <span>2K26</span>
        </div>

        <div className="success-divider"></div>

        <div className="eyebrow">
          ✦ SIGNATURE CAPTURED ✦
        </div>

        <h2>
          Thank You,
          <span>
            {selectedFaculty.name}!
          </span>
        </h2>

        <p className="success-message">
          Your presence has been recorded
          <br />
          successfully.
        </p>

        {/* SIGNATURE CARD */}
        <div className="signature-result-card">

          <div className="signature-result-label">
            DIGITAL SIGNATURE
          </div>

          <div className="signature-result-line"></div>

         {savedSignature && (
  <img
    src={savedSignature}
    alt="Digital Signature"
    className="saved-signature"
  />
)}

          <div className="signature-result-name">
            {selectedFaculty.name}
          </div>

        </div>

        <div className="success-tagline">
          Innovation
          <span>×</span>
          Collaboration
          <span>×</span>
          Impact
        </div>

        <button
          className="astra-button success-home-button"
          onClick={resetSystem}
        >
          Back to Home
          <span>→</span>
        </button>

      </div>

    </div>

  </div>
)}

      </section>

      {/* Bottom branding */}
      <footer className="bottom-footer">

        <div className="footer-brand">
          <strong>ASTRA</strong>
          <span>2K26</span>
        </div>

        <div className="footer-values">
          Innovation <i></i>
          Collaboration <i></i>
          Impact
        </div>

        <div className="footer-right">
          CHAINING
          <br />
          IDEAS
          <br />
          GLOBALLY
        </div>

      </footer>

    </main>
  );
}
export default App;