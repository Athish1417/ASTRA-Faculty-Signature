import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import "./SignatureCanvas.css";

/**
 * SignatureCanvas
 * ----------------
 * A responsive HTML5 canvas for capturing a handwritten signature.
 * Supports mouse, touch, and pointer events; prevents page scrolling
 * while drawing; resizes without losing the current signature; and
 * exposes clear() / isEmpty() / toDataURL() via a ref.
 */
const SignatureCanvas = forwardRef(function SignatureCanvas(_props, ref) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const drawingRef = useRef(false);
  const lastPointRef = useRef(null);
  const hasDrawnRef = useRef(false);
  const [hasDrawn, setHasDrawn] = useState(false);

  // Keep the canvas's internal pixel size in sync with its displayed size,
  // preserving whatever has already been drawn.
  const resizeCanvas = () => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const { width, height } = container.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    // Preserve existing drawing across a resize.
    const prev = document.createElement("canvas");
    prev.width = canvas.width;
    prev.height = canvas.height;
    prev.getContext("2d").drawImage(canvas, 0, 0);

    canvas.width = Math.max(1, Math.round(width * dpr));
    canvas.height = Math.max(1, Math.round(height * dpr));
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    const ctx = canvas.getContext("2d");
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = "#101828"; // dark navy/black ink
    ctx.lineWidth = 3;

    if (prev.width > 0 && prev.height > 0) {
      ctx.drawImage(prev, 0, 0, prev.width, prev.height, 0, 0, width, height);
    }
  };

  useEffect(() => {
    resizeCanvas();
    const observer = new ResizeObserver(() => resizeCanvas());
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getPoint = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const source = e.touches && e.touches.length > 0 ? e.touches[0] : e;
    return {
      x: source.clientX - rect.left,
      y: source.clientY - rect.top,
    };
  };

  const startDraw = (e) => {
    e.preventDefault();
    drawingRef.current = true;
    const point = getPoint(e);
    lastPointRef.current = point;

    // A single tap (no drag) should still count as a mark on the pad —
    // draw a tiny dot so isEmpty() correctly reports "not empty".
    const ctx = canvasRef.current.getContext("2d");
    ctx.beginPath();
    ctx.arc(point.x, point.y, ctx.lineWidth / 2, 0, Math.PI * 2);
    ctx.fillStyle = ctx.strokeStyle;
    ctx.fill();

    if (!hasDrawnRef.current) {
      hasDrawnRef.current = true;
      setHasDrawn(true);
    }
  };

  const moveDraw = (e) => {
    if (!drawingRef.current) return;
    e.preventDefault();

    const ctx = canvasRef.current.getContext("2d");
    const point = getPoint(e);
    const last = lastPointRef.current;

    ctx.beginPath();
    ctx.moveTo(last.x, last.y);
    ctx.lineTo(point.x, point.y);
    ctx.stroke();

    lastPointRef.current = point;

    if (!hasDrawnRef.current) {
      hasDrawnRef.current = true;
      setHasDrawn(true);
    }
  };

  const endDraw = (e) => {
    if (!drawingRef.current) return;
    e.preventDefault();
    drawingRef.current = false;
    lastPointRef.current = null;
  };

  useImperativeHandle(ref, () => ({
    clear() {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      ctx.save();
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.restore();
      hasDrawnRef.current = false;
      setHasDrawn(false);
    },
    isEmpty() {
      return !hasDrawnRef.current;
    },
    toDataURL() {
      return canvasRef.current.toDataURL("image/png");
    },
  }));

  return (
    <div className="sig-canvas" ref={containerRef}>
      {!hasDrawn && (
        <div className="sig-canvas__hint" aria-hidden="true">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path
              d="M4 20l1.2-4.4L15.6 5.2a1.5 1.5 0 0 1 2.1 0l1.1 1.1a1.5 1.5 0 0 1 0 2.1L8.4 18.8 4 20z"
              stroke="var(--color-muted)"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
          </svg>
          <span>Sign here with your finger</span>
        </div>
      )}
      <span className="sig-canvas__guide" aria-hidden="true" />
      <canvas
        ref={canvasRef}
        className="sig-canvas__surface"
        role="img"
        aria-label="Signature drawing area. Draw your signature here using your finger or mouse."
        // Pointer events alone cover mouse, touch, and pen in every modern
        // browser. Touch listeners are kept as a fallback for older
        // WebViews that only understand touch events; calling
        // preventDefault() on touchstart suppresses the duplicate
        // synthetic mouse/pointer events browsers would otherwise fire.
        onPointerDown={startDraw}
        onPointerMove={moveDraw}
        onPointerUp={endDraw}
        onPointerLeave={endDraw}
        onPointerCancel={endDraw}
        onTouchStart={startDraw}
        onTouchMove={moveDraw}
        onTouchEnd={endDraw}
        onMouseDown={startDraw}
        onMouseMove={moveDraw}
        onMouseUp={endDraw}
        onMouseLeave={endDraw}
      />
    </div>
  );
});

export default SignatureCanvas;
