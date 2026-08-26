import {BrowserRouter, Route, Routes} from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import WafersPage from "./pages/WafersPage.jsx";
import LotsPage from "./pages/LotsPage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import WaferDetailPage from "./pages/WaferDetailPage.jsx";
import PrivateRoute from "./components/PrivateRoute.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import {AuthProvider} from "./context/AuthContext.jsx";
import LotDetailPage from "./pages/LotDetailPage.jsx";

export default function App() {
    return (
        // AuthProvider omota SVE — sva strana aplikacije ima pristup useAuth()
        <AuthProvider>
            <BrowserRouter>
                <div className="app-container">
                    <div className="content-wrapper">


                            <Navbar/>
                        <Routes>
                            {/* Javne rute — bez tokena dostupne */}
                            <Route path="/login" element={<LoginPage/>}/>
                            <Route path="/register" element={<RegisterPage/>}/>

                            {/* Zaštićene rute — PrivateRoute provjeri token */}
                            <Route path="/" element={<PrivateRoute><DashboardPage/></PrivateRoute>}/>
                            <Route path="/lots" element={<PrivateRoute><LotsPage/></PrivateRoute>}/>
                            <Route path="/lots/:id" element={<PrivateRoute><LotDetailPage/></PrivateRoute>}/>
                            <Route path="/wafers" element={<PrivateRoute><WafersPage/></PrivateRoute>}/>
                            <Route path="/wafers/:id" element={<PrivateRoute><WaferDetailPage/></PrivateRoute>}/>
                        </Routes>

                    </div>
                </div>
            </BrowserRouter>
        </AuthProvider>
    );
}
