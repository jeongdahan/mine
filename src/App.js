import { MinePage } from "src/components/pages";
import { MineProvider } from "src/core/providers/MineProvider";
import "src/styles/App.css";

function App() {
  return (
    <div className="App">
      <MineProvider>
        <MinePage />
      </MineProvider>
    </div>
  );
}

export default App;
