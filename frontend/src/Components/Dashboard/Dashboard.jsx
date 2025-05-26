import React, { useEffect, useState } from "react";
import LineCharts from "../Chart/LineCharts";
import "./StyleDash.css";

const metrics = [
  { key: "Price", title: "Price Over Time", stroke: "#8884d8" },
  { key: "Close", title: "Close Over Time", stroke: "#82ca9d" },
  { key: "Volume", title: "Volume Over Time", stroke: "#ff7300" },
  { key: "Return", title: "Return Over Time", stroke: "#387908" },
  { key: "MA10", title: "MA10 Over Time", stroke: "#ff0000" },
  { key: "MA50", title: "MA50 Over Time", stroke: "#0000ff" },
  {
    key: "Strategy_Return",
    title: "Strategy Return Over Time",
    stroke: "#a832a8",
  },
  { key: "Equity_Curve", title: "Equity Curve Over Time", stroke: "#32a852" },
  { key: "Market_Curve", title: "Market Curve Over Time", stroke: "#a89e32" },
  { key: "Signal", title: "Signal Over Time", stroke: "#3232a8" },
];

const Dashboard = () => {
  const [chartData, setChartData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStrategyData = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/strategy-results");
        if (!res.ok) throw new Error("Failed to fetch strategy data");

        const json = await res.json();
        const data = json.results.equity_curve.map((row) => ({
          ...row,
          Date: new Date(row.Date).toLocaleDateString(),
          Price: Number(row.Price),
          Close: Number(row.Close),
          Volume: Number(row.Volume),
          Return: Number(row.Return),
          MA10: Number(row.MA10),
          MA50: Number(row.MA50),
          Signal: Number(row.Signal),
          Strategy_Return: Number(row.Strategy_Return),
          Equity_Curve: Number(row.Equity_Curve),
          Market_Curve: Number(row.Market_Curve),
        }));

        setChartData(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchStrategyData();
  }, []);

  if (error) return <div className="text-red-500">{error}</div>;
  if (!chartData.length) return <div>Loading...</div>;

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Strategy Dashboard</h1>
      <div className="chart-grid">
        {metrics.map(({ key, title, stroke }) => (
          <div key={key} className="chart-item">
            <LineCharts
              data={chartData}
              dataKey={key}
              title={title}
              stroke={stroke}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
