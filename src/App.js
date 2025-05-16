// In frontend/src/App.js
import { useState } from "react";
import axios from "axios";

function App() {
  const [host, setHost] = useState("localhost");
  const [user, setUser] = useState("root");
  const [password, setPassword] = useState("");
  const [databases, setDatabases] = useState([]);
  const [selectedDB, setSelectedDB] = useState("");
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState("");
  const [tableData, setTableData] = useState([]);

  const connect = async () => {
    const res = await axios.post("http://localhost:3001/connect", { host, user, password });
    setDatabases(res.data);
  };

  const getTables = async () => {
    const res = await axios.post("http://localhost:3001/getTables", { db: selectedDB });
    setTables(res.data);
  };

  const getData = async () => {
    const res = await axios.post("http://localhost:3001/getData", { table: selectedTable });
    setTableData(res.data);
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>MySQL UI</h2>
      <input placeholder="Host" value={host} onChange={e => setHost(e.target.value)} />
      <input placeholder="User" value={user} onChange={e => setUser(e.target.value)} />
      <input placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
      <button onClick={connect}>Connect</button>

      <div>
        <select onChange={e => setSelectedDB(e.target.value)} value={selectedDB}>
          <option>Select DB</option>
          {databases.map(db => <option key={db}>{db}</option>)}
        </select>
        <button onClick={getTables}>Get Tables</button>
      </div>

      <div>
        <select onChange={e => setSelectedTable(e.target.value)} value={selectedTable}>
          <option>Select Table</option>
          {tables.map(t => <option key={t}>{t}</option>)}
        </select>
        <button onClick={getData}>Get Data</button>
      </div>

      <pre>{JSON.stringify(tableData, null, 2)}</pre>
    </div>
  );
}

export default App;
