import { useEffect, useState } from "react";
import "./StrategyResultsTable.css";

const ITEMS_PER_PAGE = 20;

const StrategyResultsTable = () => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/strategy-results"
        );
        if (!response.ok) throw new Error("Network response was not ok");
        const json = await response.json();
        setData(json.results.equity_curve || []);
        setCurrentPage(1); // Reset to page 1 on new data load
      } catch (err) {
        console.error("Error loading data:", err);
        setError("Failed to load data.");
      }
    };

    fetchData();
  }, []);

  // Calculate total pages
  const totalPages = Math.ceil(data.length / ITEMS_PER_PAGE);

  // Ensure currentPage is within bounds
  const safeCurrentPage = Math.min(Math.max(currentPage, 1), totalPages || 1);

  // Get data slice for current page
  const startIndex = (safeCurrentPage - 1) * ITEMS_PER_PAGE;
  const paginatedData = data.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const goToPrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const goToNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  if (error) return <div className="status-message error">{error}</div>;
  if (!data.length)
    return <div className="status-message loading">Loading...</div>;

  return (
    <div className="strategy-table-container">
      <h2>Strategy Results Table</h2>
      <div className="table-wrapper">
        <table className="strategy-table" cellPadding="0" cellSpacing="0">
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
            {paginatedData.map((row, idx) => (
              <tr key={startIndex + idx}>
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

      <div className="pagination">
        <button
          onClick={goToPrevPage}
          disabled={safeCurrentPage === 1}
          aria-label="Previous Page"
        >
          &#8592; Prev
        </button>

        <span className="page-info">
          Page {safeCurrentPage} of {totalPages || 1}
        </span>

        <button
          onClick={goToNextPage}
          disabled={safeCurrentPage === totalPages || totalPages === 0}
          aria-label="Next Page"
        >
          Next &#8594;
        </button>
      </div>
    </div>
  );
};

export default StrategyResultsTable;
