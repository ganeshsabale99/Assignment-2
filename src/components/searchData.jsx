import React, { useEffect, useState, useRef } from "react";
import "./searchData.style.css";
const SearchData = () => {
  const [search, setSearch] = useState("");
  const [debounce, setDebounce] = useState("");
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const itemsPerPage = 10;
  const controllerRef = useRef(null);

  useEffect(() => {
    const handler = setTimeout(() => {
      setPage(1);
      setDebounce(search);
    }, 500);

    return () => clearTimeout(handler);
  }, [search]);

  useEffect(() => {
    const fetchData = async () => {
      if (controllerRef.current) {
        controllerRef.current.abort();
      }

      controllerRef.current = new AbortController();
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(
          "https://jsonplaceholder.typicode.com/comments"
        );
        const json = await res.json();

        const filtered = json.filter((user) =>
          user.name.toLowerCase().includes(debounce.toLowerCase())
        );

        const start = (page - 1) * itemsPerPage;
        const paginated = filtered.slice(start, start + itemsPerPage);

        setData(paginated);
        setTotalPages(Math.ceil(filtered.length / itemsPerPage));
      } catch (err) {
        if (err.name !== "AbortError") {
          setError("Failed to fetch data.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [debounce, page]);

  return (
    <div className="container">
      <h2>Search Users</h2>
      <input
        type="text"
        placeholder="Search by name..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="input"
        style={{
          width: "95%",
          padding: "8px",
          marginBottom: "20px",
          borderRadius: "25px",
        }}
      />
      {loading && <div className="loader"></div>}

      {error && <h2 className="error">{error}</h2>}

      <table className="table">
        <thead>
          <tr>
            <th className="th">Sr. No.</th>
            <th className="th">Name</th>
            <th className="th">Email</th>
          </tr>
        </thead>
        <tbody>
          {data.map((user, index) => (
            <tr key={user.id}>
              <td className="td">{(page - 1) * 10 + index + 1}</td>
              <td className="td">{user.name}</td>
              <td className="td">{user.email}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="buttonContainer">
        <button
          onClick={() => setPage((p) => p - 1)}
          disabled={page === 1}
          className="button"
        >
          ⬅ Previous
        </button>
        <button
          onClick={() => setPage((p) => p + 1)}
          disabled={page === totalPages || totalPages === 0}
          className="button"
        >
          Next ➡
        </button>
        <p className="page">
          Page {page} of {totalPages}
        </p>
      </div>
    </div>
  );
};

export default SearchData;
