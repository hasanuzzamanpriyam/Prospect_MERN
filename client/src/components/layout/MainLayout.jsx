import Header from "../common/header/Header";
import { CreditWarningBanner } from "../common/CreditWarningBanner";

function MainLayout({ children }) {
  return (
    <div className="h-screen bg-gray-50">
      <Header />
      {/* Inline credit warning for pages that don't use App-level banner */}
      <CreditWarningBanner />
      <div className="main-content pt-12">{children}</div>
    </div>
  );
}

export default MainLayout;
