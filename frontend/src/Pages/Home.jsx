import { Link } from "react-router-dom";
import "./Home.css";

const Home = () => {
  return (
    <div className="home-container">
      <h1>Welcome to the Dashboard App</h1>
      <h1>Stock Trading Strategy Visualizer</h1>
      <nav className="home-nav">
        <Link to="/dashboard" className="home-link">
          Dashboard
        </Link>
        <Link to="/equity_chart" className="home-link">
          Equity
        </Link>
        <Link to="/strategy_table" className="home-link">
          Strategy Table
        </Link>
      </nav>
    </div>
  );
};

export default Home;
