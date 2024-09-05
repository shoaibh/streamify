import "./App.css";
import { Header, StatsContainer } from "./components";
import { DataContextProvider } from "./context/DataContext";

function App() {
  return (
    <DataContextProvider>
      <Header />
      <StatsContainer />
    </DataContextProvider>
  );
}

export default App;
