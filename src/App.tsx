import "./App.css";
import { DataTable, DateFilter, Export, Graphs, Stats } from "./components";
import { DataContextProvider } from "./context/DataContext";

function App() {
  return (
    <DataContextProvider>
      <header className="flex justify-center mb-5 relative">
        <h1 className="text-xl">Streamify</h1>
        <div className="flex right-0 absolute gap-3">
          <DateFilter />
          <Export />
        </div>
      </header>
      <Stats />
      <Graphs />
      <DataTable />
    </DataContextProvider>
  );
}

export default App;
