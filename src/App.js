import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

import { Navbar, Footer, Sidebar, ThemeSettings } from "./components";
import { 
  Page404, 
  LoginPage, 
  ChangePassword,
  FilterPegawai,
  Dashboard, 
  ListPegawai, 
  ListKepegawaian, 
  ListPangkat, 
  ListAlamat, 
  ListIdentitas, 
  ListRekening, 
  ListPendidikan, 
  ListFisik, 
  ListUkuran, 
  ListPasangan, 
  ListAnak, 
  AddPegawai, 
  AddKepegawaian, 
  AddPangkat, 
  AddAlamat, 
  AddIdentitas, 
  AddRekening, 
  AddPendidikan, 
  AddFisik, 
  AddUkuran, 
  AddPasangan, 
  AddAnak, 
  EditPegawai, 
  EditKepegawaian, 
  EditPangkat, 
  EditAlamat, 
  EditIdentitas,
  EditRekening,
  EditPendidikan,
  EditFisik,
  EditUkuran,
  EditPasangan,
  EditAnak,
  ViewPegawai,

  AddKepegawaianNext,
  AddPangkatNext,
  AddAlamatNext,
  AddIdentitasNext,
  AddRekeningNext,
  AddPendidikanNext,
  AddFisikNext,
  AddUkuranNext,
  AddPasanganNext,
  AddAnakNext,

} from "./pages";

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
      <div className="flex relative dark:bg-[#040c24]">
        
        {/* Theme Settings Modal */}
        {themeSettings && <ThemeSettings />}

        {/* Sidebar */}
        { !isLoginPage && !isChatAI && !isNotFound && !isChatGirlfriend && !isCertificatesPage && !isProjectsPage &&  activeMenu ? (
          <div className="w-72 fixed sidebar dark:bg-[#040c24] bg-white">
            <Sidebar />
          </div>
        ) : !isLoginPage && !isChatAI && !isNotFound && !isChatGirlfriend && !isCertificatesPage && !isProjectsPage ? (
          <div className="w-0 dark:bg-[#040c24]">
            <Sidebar />
          </div>
        ) : null}

        {/* Main Content */}
        <div
          className={`main-content dark:bg-[#040c24] bg-main-bg min-h-screen w-full ${
            activeMenu && !isLoginPage && !isChatAI && !isNotFound && !isChatGirlfriend && !isCertificatesPage && !isProjectsPage ? "sidebar-visible" : "full-width"
          }`}
        >
          { !isLoginPage && !isChatAI && !isNotFound && !isChatGirlfriend && !isCertificatesPage && !isProjectsPage && (
            <div className="fixed md:static bg-main-bg dark:bg-[#040c24] navbar w-full">
              <Navbar />
            </div>
          )}

          <div>

            <Routes>
              <Route path="/" element={<LoginPage />} />
              <Route path="/change-password" element={<ChangePassword />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/filter" element={<FilterPegawai />} />
              <Route path="/pegawai" element={<ListPegawai />} />
              <Route path="/kepegawaian" element={<ListKepegawaian />} />
              <Route path="/pangkat" element={<ListPangkat />} />
              <Route path="/alamat" element={<ListAlamat />} />
              <Route path="/identitas" element={<ListIdentitas />} />
              <Route path="/rekening" element={<ListRekening />} />
              <Route path="/pendidikan" element={<ListPendidikan />} />
              <Route path="/fisik" element={<ListFisik />} />
              <Route path="/ukuran" element={<ListUkuran />} />
              <Route path="/pasangan" element={<ListPasangan />} />
              <Route path="/anak" element={<ListAnak />} />
              <Route path="/add-pegawai" element={<AddPegawai />} />
              <Route path="/add-kepegawaian" element={<AddKepegawaian />} />
              <Route path="/add-pangkat" element={<AddPangkat />} />
              <Route path="/add-alamat" element={<AddAlamat />} />
              <Route path="/add-identitas" element={<AddIdentitas />} />
              <Route path="/add-rekening" element={<AddRekening />} />
              <Route path="/add-pendidikan" element={<AddPendidikan />} />
              <Route path="/add-fisik" element={<AddFisik />} />
              <Route path="/add-ukuran" element={<AddUkuran />} />
              <Route path="/add-pasangan" element={<AddPasangan />} />
              <Route path="/add-anak" element={<AddAnak />} />
              <Route path="/pegawai/edit/:id" element={<EditPegawai />} />
              <Route path="/kepegawaian/edit/:id" element={<EditKepegawaian />} />
              <Route path="/pangkat/edit/:id" element={<EditPangkat />} />
              <Route path="/alamat/edit/:id" element={<EditAlamat />} />
              <Route path="/identitas/edit/:id" element={<EditIdentitas />} />
              <Route path="/rekening/edit/:id" element={<EditRekening />} />
              <Route path="/pendidikan/edit/:id" element={<EditPendidikan />} />
              <Route path="/fisik/edit/:id" element={<EditFisik />} />
              <Route path="/ukuran/edit/:id" element={<EditUkuran />} />
              <Route path="/pasangan/edit/:id" element={<EditPasangan />} />
              <Route path="/anak/edit/:id" element={<EditAnak />} />
              <Route path="/pegawai/:id" element={<ViewPegawai />} />

              <Route path="/next/add/kepegawaian" element={<AddKepegawaianNext />} />
              <Route path="/next/add/pangkat" element={<AddPangkatNext />} />
              <Route path="/next/add/alamat" element={<AddAlamatNext />} />
              <Route path="/next/add/identitas" element={<AddIdentitasNext />} />
              <Route path="/next/add/rekening" element={<AddRekeningNext />} />
              <Route path="/next/add/pendidikan" element={<AddPendidikanNext />} />
              <Route path="/next/add/fisik" element={<AddFisikNext />} />
              <Route path="/next/add/ukuran" element={<AddUkuranNext />} />
              <Route path="/next/add/pasangan" element={<AddPasanganNext />} />
              <Route path="/next/add/anak" element={<AddAnakNext />} />
              
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