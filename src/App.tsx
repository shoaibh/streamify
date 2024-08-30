import "./App.css";
import { DataTable, DateFilter, Graphs, Stats } from "./components";
import { DataContextProvider } from "./context/DataContext";

function App() {
  return (
    <DataContextProvider>
      <header className="fixed top-0 p-4 left-0 w-full bg-white shadow-md shadow-gray-500/10 z-50 md:grid grid-cols-1 md:grid-cols-3 items-center mb-10">
        <h1 className="col-start-2 mb-5 md:mb-0 justify-self-center text-2xl">Streamify</h1>
        <div className="col-start-3 justify-self-end">
          <DateFilter />
        </div>
      </header>
      <Stats />
      <Graphs />
      <DataTable />
    </DataContextProvider>
  );
}

export default App;
