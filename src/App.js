import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './layout/navbar/Navbar';
import Home from './Pages/Dashboard/Home';
import WaytrixLogin from './Pages/WaytrixAccount/WaytrixLogin';
import AddResto from './Pages/WaytrixAccount/AddResto'
import { useEffect, useState } from 'react';
import RestoLogin from './Pages/RestoAccount/RestoLogin'
import AddTableOrValet from './Pages/WaytrixAccount/AddTableOrValet/AddTableOrValet'
import GetTableAccounts from './Pages/WaytrixAccount/AddWaiter/getTableAccounts'
import AddWaiter from './Pages/WaytrixAccount/AddWaiter/AddWaiter'
import GetRestoAcounts from './Pages/WaytrixAccount/AddVideo/GetRestoAccounts'
import AddVideo from './Pages/WaytrixAccount/AddVideo/AddVideo'
import ContactUs from './Pages/RestoAccount/ContactUs/ContactUs'
import AddPartners from './Pages/WaytrixAccount/Partners/AddPartners'
import DeletePartners from './Pages/WaytrixAccount/Partners/DeletePartner'
import AddVoucher from './Pages/WaytrixAccount/AddVoucher/AddVoucher'
import AddButtons from './Pages/WaytrixAccount/AddButtons/AddButtons'
import GetRestoAccountButtons from './Pages/WaytrixAccount/AddButtons/GetRestoAccounts'
import AddMenu from './Pages/RestoAccount/AddMenu/AddMenu'
import TableLocations from './Pages/WaytrixAccount/TableLocations/TableLocations'
import AddCustomButtons from './Pages/WaytrixAccount/AddCustomButtons/GetRestoAccounts'
import AddCustomButtonsScreen from './Pages/WaytrixAccount/AddCustomButtons/AddCustomButtons'
import GetCustomButtons from './Pages/WaytrixAccount/AddCustomButtons/GetCustomButtons'
import GetAllRestoForVidPrev from './Pages/WaytrixAccount/VideoPrev/GetAllResto'
import VidPrevScreen from './Pages/WaytrixAccount/VideoPrev/VidPreview'
import GetRestoForAddTableOrValet from './Pages/WaytrixAccount/AddTableOrValet/GetRestoAccounts'
import GetWaiters from './Pages/RestoAccount/AssignTablesToWaiter/GetWaiters'
import AssignTablesToWaiter from './Pages/RestoAccount/AssignTablesToWaiter/AssignTablesToWaiter'
import GetSurveys from './Pages/RestoAccount/GetSurveys/GetSurveys'
import PartnerLogin from './Pages/PartnerAccount/login'
import GetRestoAccountForVideoUpdate from './Pages/WaytrixAccount/AddVideo/UpdateVideo/GetRestoAccounts'
import GetForLoopId from './Pages/WaytrixAccount/AddVideo/UpdateVideo/GetForLoopId'
import GetRestoAccountForDelete from './Pages/WaytrixAccount/DeleteResto/GetRestoAccountForDelete'
import NavResto from './Pages/Dashboard/NavResto/NavResto';
import Details from './Pages/Dashboard/NavResto/Details';
import Tablets from './Pages/Dashboard/NavResto/Tablets';
import AddTablet from './Pages/Dashboard/NavResto/AddTablet';
import Valet from './Pages/Dashboard/NavResto/Valet';
import AddValet from './Pages/Dashboard/NavResto/AddValet';
import Sequence from './Pages/Dashboard/NavResto/Sequence';
import AddVideoSeq from './Pages/Dashboard/NavResto/AddVideoSeq';
import Watches from './Pages/Dashboard/NavResto/Watches';
import AddWatch from './Pages/Dashboard/NavResto/AddWatch';
import ViewTables from './Pages/RestoAccount/ViewTables/ViewTables';
import AddTablet2 from './Pages/RestoAccount/ViewTables/AddTablet2';
import AddButtons2 from './Pages/Dashboard/NavResto/AddButtons2';
import RestoForgotPassword from './Pages/RestoAccount/RestoForgotPassword';
import RestoForgotPassword2 from './Pages/RestoAccount/RestoForgotPassword2';
function App() {
  const [waytrixToken, setWaytrixToken] = useState(localStorage.getItem('waytrixToken') || '');
  const [restoToken, setRestoToken] = useState(localStorage.getItem('restoToken') || '');
  const [partnerToken, setPartnerToken] = useState(localStorage.getItem('partnerToken') || '');


  useEffect(() => {
    console.log("Waytrix Token on page load:", waytrixToken);
    console.log("Resto Token on page load:", restoToken);

    const interval = setInterval(() => {
      const newWaytrixToken = localStorage.getItem('waytrixToken') || '';
      const newRestoToken = localStorage.getItem('restoToken') || '';
      const newPartnerToken = localStorage.getItem('partnerToken') || '';

      if (newPartnerToken !== partnerToken) {
        setPartnerToken(newPartnerToken);
      }

      if (newWaytrixToken !== waytrixToken) {
        setWaytrixToken(newWaytrixToken);
      }
      if (newRestoToken !== restoToken) {
        setRestoToken(newRestoToken);
      }
     
    }, 1000);

    return () => clearInterval(interval);
  }, [waytrixToken, restoToken, partnerToken]);

  return (
    <div className="App">
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          {waytrixToken ?
          // GetRestoAccountForDelete
            <>
              <Route path="/WaytrixLogin" element={<Home />} />
              <Route path="/AddResto" element={<AddResto />} />
              <Route path="/GetRestoAcounts" element={<GetRestoAcounts />} />
              <Route path="/AddVideo/:id" element={<AddVideo />} />
              
              <Route path="/NavResto" element={<NavResto />} />
              <Route path="/restaurant/:id" element={<Details />} />
              <Route path="/Tablets" element={<Tablets />} />
              <Route path="/AddWatch" element={<AddWatch />} />
              <Route path="/Sequence" element={<Sequence />} />
              <Route path="/AddVideoSeq" element={<AddVideoSeq />} />
              <Route path="/Valet" element={<Valet />} />
              <Route path="/Watches" element={<Watches />} />
              <Route path="/AddValet" element={<AddValet />} />
              <Route path="/AddTablet" element={<AddTablet />} />
              <Route path="/AddPartners" element={<AddPartners />} />
              <Route path="/DeletePartners" element={<DeletePartners />} />
              <Route path="/AddVoucher" element={<AddVoucher />} />
              <Route path="/AddButtons/:id" element={<AddButtons />} />
              <Route path="/GetRestoAccountButtons" element={<GetRestoAccountButtons />} />
              <Route path="/TableLocations" element={<TableLocations />} />
              <Route path="/AddCustomButtons" element={<AddCustomButtons />} />
              <Route path="/AddCustomButtonsScreen/:id" element={<AddCustomButtonsScreen />} />
              <Route path="/GetCustomButtons/:id" element={<GetCustomButtons />} />
              <Route path="/GetAllRestoForVidPrev" element={<GetAllRestoForVidPrev />} />
              <Route path="/VidPrevScreen/:id" element={<VidPrevScreen />} />
              <Route path="/GetRestoForAddTableOrValet" element={<GetRestoForAddTableOrValet />} />
              <Route path="/AddTableOrValet/:restoId" element={<AddTableOrValet />} />
              <Route path="/getTableAccounts" element={<GetTableAccounts />} />
              <Route path="/AddWaiter/:restoId/:tableId" element={<AddWaiter />} />
              <Route path="/GetRestoAccountForVideoUpdate" element={<GetRestoAccountForVideoUpdate />} />
              <Route path="/GetForLoopId/:id" element={<GetForLoopId />} />
              <Route path="/GetRestoAccountForDelete" element={<GetRestoAccountForDelete />} />
              <Route path="/AddButtons2" element={<AddButtons2 />} />



            </>
            :
            <>
              <Route path="/AddResto" element={<WaytrixLogin />} />
              <Route path="/WaytrixLogin" element={<WaytrixLogin />} />
              <Route path="/GetRestoAcounts" element={<WaytrixLogin />} />
              <Route path="/AddVideo/:id" element={<WaytrixLogin />} />
              <Route path="/AddPartners" element={<WaytrixLogin />} />
              <Route path="/DeletePartners" element={<WaytrixLogin />} />
              <Route path="/AddVoucher" element={<WaytrixLogin />} />
              <Route path="/AddButtons/:id" element={<WaytrixLogin />} />
              <Route path="/AddButtons2/:id" element={<WaytrixLogin />} />
              <Route path="/GetRestoAccountButtons" element={<WaytrixLogin />} />
              <Route path="/TableLocations" element={<WaytrixLogin />} />
              <Route path="/AddCustomButtons" element={<WaytrixLogin />} />
              <Route path="/AddCustomButtonsScreen/:id" element={<WaytrixLogin />} />
              <Route path="/GetCustomButtons/:id" element={<WaytrixLogin />} />
              <Route path="/GetAllRestoForVidPrev" element={<WaytrixLogin />} />
              <Route path="/VidPrevScreen/:id" element={<WaytrixLogin />} />
              <Route path="/AddTableOrValet/:restoId" element={<WaytrixLogin />} />
              <Route path="/GetRestoForAddTableOrValet" element={<WaytrixLogin />} />
              <Route path="/getTableAccounts" element={<WaytrixLogin />} />
              <Route path="/AddWaiter/:restoId/:tableId" element={<WaytrixLogin />} />
              <Route path="/GetRestoAccountForVideoUpdate" element={<WaytrixLogin />} />
              <Route path="/GetForLoopId/:id" element={<WaytrixLogin />} />
              <Route path="/GetRestoAccountForDelete" element={<WaytrixLogin />} />



            </>
          }
          {/* GetSurveys */}
          {restoToken ?
          <>
            <Route path="/RestoLogin" element={<Home />} />
        
            <Route path="/ContactUs" element={<ContactUs />} />
            <Route path="/AddMenu" element={<AddMenu />} />
            <Route path="/GetWaiters" element={<GetWaiters />} />
            <Route path="/AssignTablesToWaiter/:id" element={<AssignTablesToWaiter />} />
            <Route path="/GetSurveys" element={<GetSurveys />} />
            <Route path="/ViewTables" element={<ViewTables />} />
            <Route path="/AddTablet2" element={<AddTablet2 />} />

            </>
            :
            <>
            <Route path="/RestoForgotPassword" element={<RestoForgotPassword />} />
            <Route path="/RestoForgotPassword2" element={<RestoForgotPassword2 />} />
            <Route path="/RestoLogin" element={<RestoLogin />} />
           
            <Route path="/ContactUs" element={<RestoLogin />} />
            <Route path="/AddMenu" element={<RestoLogin />} />
            <Route path="/GetWaiters" element={<RestoLogin />} />
            <Route path="/AssignTablesToWaiter/:id" element={<RestoLogin />} />
            <Route path="/GetSurveys" element={<RestoLogin />} />
            <Route path="/ViewTables" element={<RestoLogin />} />
            <Route path="/AddTablet2" element={<RestoLogin />} />

            </>
          }

          {/* PARTNER ACCOUNT */}

          { !partnerToken ?
            <Route path="/PartnerLogin" element={<PartnerLogin />} />
:
<Route path="/PartnerLogin" element={<Home />} />

          }
        </Routes>
      </Router>
    </div>
  );
}

export default App;
