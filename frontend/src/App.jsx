import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./Pages/Home";
import EquityChart from "./Components/Chart/EquityChart";
import Dashboard from "./Components/Dashboard/Dashboard";
import StrategyTable from "./Components/Strategy/StrategyResultsTable";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/equity_chart" element={<EquityChart />} />
        <Route path="/strategy_table" element={<StrategyTable />} />
      </Routes>
    </Router>
  );
};

export default App;
