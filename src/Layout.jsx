import React from "react";
import {BrowserRouter, Route, Routes} from 
"react-router-dom";
import Home from "./views/Home";
import Contact from "./views/Contact";
import NotFound from "./views/NotFound";
import Navbar from "./components/Navbar";
import injectContext from "./js/store/appContext";

const Layout = () => {
    const basename = process.env.BASENAME || "";
    return(
        <div>
            <BrowserRouter basename={basename}>
            <Navbar />
                <Routes>
                    <Route exact path="/" element={<Home />}/>
                    <Route exact path="/contact" element={<Contact />}/>
                    <Route exact path="/*" element={<NotFound />}/>                    
                </Routes>
            </BrowserRouter>
        </div>
    )
};

export default injectContext(Layout);