import { NavLink } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="nav-brand">
          <h1>PulseAI</h1>
          <span className="brand-tag">24-Hour GenAI Feed</span>
        </div>
        <div className="nav-links">
          <NavLink to="/" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>All News</NavLink>
          <NavLink to="/category/technology" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Technology</NavLink>
          <NavLink to="/category/sports" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Sports</NavLink>
          <NavLink to="/category/entertainment" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Entertainment</NavLink>
          <NavLink to="/category/operations" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Operations</NavLink>
          <NavLink to="/category/awards" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Awards</NavLink>
        </div>
      </div>
    </nav>
  );
}