import InventoryManagerDashboard from "./component/InventoryManagerDashboard"

export default function App() {
  const handleLogout = () => {
    console.log("Logout clicked");
  };

  return (
    <InventoryManagerDashboard onLogout={handleLogout} />
  );
}
