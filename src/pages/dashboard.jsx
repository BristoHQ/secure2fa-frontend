import { useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import DisplayCards from "../components/DisplayCards";
import PinReqMessage from "../components/PinReqMessage";
import Footer from "../components/Footer";
import { SkeletonDashboard } from "../components/Skeleton";
function Dashboard() {
  const [sidebarActive, setSidebarActive] = useState(false);
  // In your parent component
  const [showCards, setShowCards] = useState(false);
  const [enteredPin, setEnteredPin] = useState("");

  const handlePinVerified = (pin) => {
    setEnteredPin(pin);
    setShowCards(true);
  };

  const toggleSidebar = () => {
    setSidebarActive(!sidebarActive);
  };

  return (
    <>
      {sidebarActive && (
        <div className="backdrop" onClick={toggleSidebar}></div>
      )}
      <Sidebar isActive={sidebarActive} />
      <div className="main">
        <Navbar toggleSidebar={toggleSidebar} />

        <div className="content">
          <h1>Dashboard</h1>
          <p>Welcome to your dashboard!</p>
          {/* <DisplayCards /> */}
          {!showCards ? (
            <PinReqMessage onPinVerified={handlePinVerified} />
          ) : (
            <div>
              {/* Your sensitive 2FA cards here */}
              <DisplayCards enteredPin={enteredPin} />
            </div>
          )}

          {/* <PinReqMessage /> */}
        </div>
        <Footer />
      </div>
    </>
  );
}

export default Dashboard;
