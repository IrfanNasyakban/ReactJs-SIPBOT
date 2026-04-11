import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

import { Navbar, Footer, Sidebar, ThemeSettings } from "./components";
import { Page404, LoginPage, Dashboard } from "./pages";

import { useStateContext } from "./contexts/ContextProvider";

import "./App.css";

const AppContent = () => {
  const { activeMenu, currentMode, themeSettings } = useStateContext();
  const location = useLocation();
  const isLoginPage = location.pathname === "/";
  const isDashboard = location.pathname === "/dashboard";
  const isChatAI = location.pathname === "/chat-ai";
  const isNotFound = location.pathname === "/page-not-found";
  const isChatGirlfriend = location.pathname === "/my-girlfriend";
  const isCertificatesPage = location.pathname === "/certificates-page";
  const isProjectsPage = location.pathname === "/projects-page";

  // Toggle class body-no-scroll
  useEffect(() => {
    if (activeMenu) {
      document.body.classList.add("body-no-scroll");
    } else {
      document.body.classList.remove("body-no-scroll");
    }

    return () => {
      document.body.classList.remove("body-no-scroll");
    };
  }, [activeMenu]);

  return (
    <div className={currentMode === "Dark" ? "dark" : ""}>
      <div className="flex relative dark:bg-main-dark-bg">
        
        {/* Theme Settings Modal */}
        {themeSettings && <ThemeSettings />}

        {/* Sidebar */}
        { !isLoginPage && !isChatAI && !isNotFound && !isChatGirlfriend && !isCertificatesPage && !isProjectsPage &&  activeMenu ? (
          <div className="w-72 fixed sidebar dark:bg-secondary-dark-bg bg-white">
            <Sidebar />
          </div>
        ) : !isLoginPage && !isChatAI && !isNotFound && !isChatGirlfriend && !isCertificatesPage && !isProjectsPage ? (
          <div className="w-0 dark:bg-secondary-dark-bg">
            <Sidebar />
          </div>
        ) : null}

        {/* Main Content */}
        <div
          className={`main-content dark:bg-main-dark-bg bg-main-bg min-h-screen w-full ${
            activeMenu && !isLoginPage && !isChatAI && !isNotFound && !isChatGirlfriend && !isCertificatesPage && !isProjectsPage ? "sidebar-visible" : "full-width"
          }`}
        >
          { !isLoginPage && !isChatAI && !isNotFound && !isChatGirlfriend && !isCertificatesPage && !isProjectsPage && (
            <div className="fixed md:static bg-main-bg dark:bg-main-dark-bg navbar w-full">
              <Navbar />
            </div>
          )}

          <div>

            <Routes>
              <Route path="/" element={<LoginPage />} />
              <Route path="/dashboard" element={<Dashboard />} />
              
              Portfolio Routes

              <Route path="/page-not-found" element={<Page404 />} />
              <Route path="*" element={<Page404 />} />
            </Routes>
          </div>

          { !isLoginPage && !isDashboard && !isChatAI && !isNotFound && !isChatGirlfriend && !isCertificatesPage && !isProjectsPage && <Footer /> }
        </div>
      </div>
    </div>
  );
};

const App = () => (
  <BrowserRouter>
    <AppContent />
  </BrowserRouter>
);

export default App;