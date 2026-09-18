import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../components/Header.jsx";
import Robot from "../components/Robot.jsx";
import SignatureCanvas from "../components/SignatureCanvas.jsx";
import { SecondaryButton, PrimaryButton } from "../components/Buttons.jsx";
import { api, ApiError } from "../services/api.js";
import "./Signature.css";

export default function Signature() {
  const { id } = useParams();
  const navigate = useNavigate();
  const canvasRef = useRef(null);

  const [faculty, setFaculty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [alreadySigned, setAlreadySigned] = useState(null); // { signed_at }
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let cancelled = false;

    Promise.all([api.getFaculty(id), api.getFacultyStatus(id)])
      .then(([facultyData, statusData]) => {
        if (cancelled) return;
        setFaculty(facultyData);
        if (statusData.has_signed) {
          setAlreadySigned({ signed_at: statusData.signed_at });
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setLoadError(
            err instanceof ApiError
              ? err.message
              : "Could not load this faculty record."
          );
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  const handleClear = () => {
    canvasRef.current?.clear();
    setFormError("");
  };

  const handleSubmit = async () => {
    if (canvasRef.current?.isEmpty()) {
      setFormError("Please provide your signature before submitting.");
      return;
    }

    setFormError("");
    setSubmitting(true);

    try {
      const dataUrl = canvasRef.current.toDataURL();
      await api.submitSignature(id, dataUrl);
      navigate(`/success/${id}`);
    } catch (err) {
      if (err instanceof ApiError && err.status === 409) {
        setAlreadySigned({ signed_at: err.payload?.signed_at });
      } else {
        setFormError(
          err instanceof ApiError
            ? err.message
            : "Something went wrong while saving your signature. Please try again."
        );
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="screen signature-screen">
        <Header />
        <main className="signature-screen__content">
          <p className="status-text">Loading your details…</p>
        </main>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="screen signature-screen">
        <Header />
        <main className="signature-screen__content">
          <p className="status-text status-text--error">{loadError}</p>
          <SecondaryButton onClick={() => navigate("/select")}>Back to name selection</SecondaryButton>
        </main>
      </div>
    );
  }

  if (alreadySigned) {
    return (
      <div className="screen signature-screen">
        <Header />
        <main className="signature-screen__content signature-screen__content--centered">
          <div className="duplicate-notice">
            <span className="duplicate-notice__icon" aria-hidden="true">✓</span>
            <h1 className="section-heading section-heading--small">Signature Already Recorded</h1>
            <p className="body-copy">
              Your signature has already been recorded for ASTRA 2K26.
            </p>
            {alreadySigned.signed_at && (
              <p className="fine-print">
                Recorded at {new Date(alreadySigned.signed_at).toLocaleString()}
              </p>
            )}
            <SecondaryButton onClick={() => navigate("/select")}>Back to name selection</SecondaryButton>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="screen signature-screen">
      <Header />

      <main className="signature-screen__content">
        <p className="eyebrow">&#10022; DIGITAL SIGNATURE &#10022;</p>
        <h1 className="section-heading">
          Please provide your
          <br />
          <span className="accent">signature</span>
        </h1>
        <p className="body-copy body-copy--tight">This confirms your presence at ASTRA 2K26.</p>
        <p className="faculty-name">{faculty.name}</p>

        <div className="signature-screen__pad-row">
          <SignatureCanvas ref={canvasRef} />
          <Robot className="signature-screen__robot" />
        </div>

        {formError && <p className="form-error" role="alert">{formError}</p>}

        <div className="signature-screen__actions">
          <SecondaryButton onClick={handleClear} disabled={submitting}>Clear</SecondaryButton>
          <PrimaryButton onClick={handleSubmit} disabled={submitting}>
            {submitting ? "Submitting" : "Submit"}
          </PrimaryButton>
        </div>
      </main>
    </div>
  );
}
