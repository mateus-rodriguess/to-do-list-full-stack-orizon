import { BrowserRouter } from "react-router-dom";
import { Router } from "./routes/router";
import { Header } from "./components/Header";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Router />
      <ToastContainer position="top-right" />
    </BrowserRouter>
  );
}

export default App;
