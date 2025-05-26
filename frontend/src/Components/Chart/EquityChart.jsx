import { useEffect, useState } from "react";

const StrategyResultsTable = () => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/strategy-results"
        );
        if (!response.ok) throw new Error("Network response was not ok");
        const json = await response.json();
        setData(json.results.equity_curve || []);
      } catch (err) {
        console.error("Error loading data:", err);
        setError("Failed to load data.");
      }
    };

    fetchData();
  }, []);

  if (error) return <div style={{ color: "red" }}>{error}</div>;
  if (!data.length) return <div>Loading...</div>;

  return (
    <div>
      <h2>Strategy Results Table</h2>
      <table border="1" cellPadding="5" cellSpacing="0">
        <thead>
          <tr>
            <th>Date</th>
            <th>Price</th>
            <th>Close</th>
            <th>High</th>
            <th>Low</th>
            <th>Open</th>
            <th>Volume</th>
            <th>Return</th>
            <th>MA10</th>
            <th>MA50</th>
            <th>Signal</th>
            <th>Position</th>
            <th>Strategy_Return</th>
            <th>Equity_Curve</th>
            <th>Market_Curve</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr key={idx}>
              <td>{row.Date}</td>
              <td>{row.Price}</td>
              <td>{row.Close}</td>
              <td>{row.High}</td>
              <td>{row.Low}</td>
              <td>{row.Open}</td>
              <td>{row.Volume}</td>
              <td>{row.Return}</td>
              <td>{row.MA10}</td>
              <td>{row.MA50}</td>
              <td>{row.Signal}</td>
              <td>{row.Position}</td>
              <td>{row.Strategy_Return}</td>
              <td>{row.Equity_Curve}</td>
              <td>{row.Market_Curve}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StrategyResultsTable;
