import "./SceneBackground.css";

/**
 * SceneBackground
 * ----------------
 * The consistent white/light-grey technical-editorial background used on
 * every screen: grid lines, corner brackets, an orange accent line, a
 * lower-left globe motif, and small edge labels. Purely decorative —
 * aria-hidden so screen readers skip it.
 */
export default function SceneBackground() {
  return (
    <div className="scene-bg" aria-hidden="true">
      <div className="scene-bg__grid" />

      {/* Corner brackets */}
      <span className="scene-bg__bracket scene-bg__bracket--tl" />
      <span className="scene-bg__bracket scene-bg__bracket--tr" />
      <span className="scene-bg__bracket scene-bg__bracket--bl" />
      <span className="scene-bg__bracket scene-bg__bracket--br" />

      {/* Orange accent lines */}
      <span className="scene-bg__accent-line scene-bg__accent-line--top" />
      <span className="scene-bg__accent-line scene-bg__accent-line--bottom" />

      {/* Globe motif, lower-left */}
      <div className="scene-bg__globe">
        <span className="scene-bg__globe-ring scene-bg__globe-ring--1" />
        <span className="scene-bg__globe-ring scene-bg__globe-ring--2" />
        <span className="scene-bg__globe-ring scene-bg__globe-ring--3" />
      </div>

      {/* Edge technical labels */}
      <div className="scene-bg__label scene-bg__label--left">
        LEARN<br />BUILD<br />CONNECT<br />CREATE
      </div>
      <div className="scene-bg__label scene-bg__label--right">
        IDEAS<br />INTO<br />IMPACT
      </div>
      <div className="scene-bg__label scene-bg__label--top">
        AI &times; WEB3 &times; PEOPLE
      </div>
      <div className="scene-bg__label scene-bg__label--bottom-left">
        <span className="scene-bg__globe-icon">&#9678;</span> CHAINING<br />IDEAS<br />GLOBALLY
      </div>
      <div className="scene-bg__label scene-bg__label--bottom-right">
        BEYOND<br />CAPITAL
      </div>
    </div>
  );
}
