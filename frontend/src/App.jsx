import {BrowserRouter, Route, Routes} from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import WafersPage from "./pages/WafersPage.jsx";
import LotsPage from "./pages/LotsPage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import WaferDetailPage from "./pages/WaferDetailPage.jsx";

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
                        <Route path="/wafers/:id" element={<WaferDetailPage />} />
                    </Routes>

                </div>
            </div>
        </BrowserRouter>
    );
}
