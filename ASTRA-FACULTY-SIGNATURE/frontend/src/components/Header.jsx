import "./Header.css";

/**
 * Header
 * ------
 * Center-aligned ASTRA 2K26 wordmark used at the top of every screen.
 * "ASTRA" renders in navy, "2K26" in the orange accent, with the Woblo
 * display font applied only to this wordmark.
 */
export default function Header() {
  return (
    <header className="site-header">
      <div className="site-header__mark woblo-font">
        <span className="site-header__astra">ASTRA</span>
        <span className="site-header__year">2K26</span>
      </div>
    </header>
  );
}
