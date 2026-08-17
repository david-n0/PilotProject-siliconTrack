import {BrowserRouter, Route, Routes} from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import WafersPage from "./pages/WafersPage.jsx";
import LotsPage from "./pages/LotsPage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";

export default function App() {
    return (
        <BrowserRouter>
            <div className="app-container">
                <div className="content-wrapper">
                    <Navbar/>

                    <Routes>
                        <Route path="/" element={<DashboardPage/>}/>
                        <Route path="/lots" element={<LotsPage/>}/>
                        <Route path="/wafers" element={<WafersPage/>}/>
                    </Routes>

                </div>
            </div>
        </BrowserRouter>
    );
}
