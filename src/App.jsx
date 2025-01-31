import { BrowserRouter as Router } from "react-router-dom";
import Navbar from "./components/Navbar"
import AppRouter from "./routes/AppRouter";

function App() {
  return (
    <Router>
      <Navbar />
      <div className="container mx-auto p-4">
        <AppRouter />
      </div>
    </Router>
  )
}

export default App;
