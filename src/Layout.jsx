import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import injectContext from "./js/store/appContext";
import NotFound from "./views/NotFound";
import ScrollToTop from "./components/ScrollToTop";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { Home } from "./views/Home";
import { LoginPreview } from "./views/LoginPreview";
import { Login } from "./views/Login";
import { Signup } from "./views/Signup";

const Layout = () => {
  const basename = process.env.BASENAME || "";
  return (
    <div>
      <BrowserRouter basename={basename}>
        <ScrollToTop>
          <Navbar />
          <Routes>
            <Route exact path="/" element={<Home />} />
            <Route exact path="/*" element={<NotFound />} />
            <Route exact path="/loginPreview" element={<LoginPreview />} />
            <Route exact path="/login" element={<Login />} />
            <Route exact path="/signup" element={<Signup />} />
          </Routes>
          <Footer />
        </ScrollToTop>
      </BrowserRouter>
    </div>
  );
};

export default injectContext(Layout);