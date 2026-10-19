import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import useStore from "./store/store";
import { useEffect, Suspense, lazy } from "react";
import { Navigate } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
const clientId =
  "904226919226-fsv2trnoq9lv8me0uampgnsdk7p7a51a.apps.googleusercontent.com";

import { Bounce, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// middlewares
import checkLoginStatus from "./utils/checkLoginStatus";
import checkAdminLoginStatus from "./utils/checkAdminLoginStatus";
import useNotificationSocket from "./utils/useNotificationSocket";
import AuthorizedRoute from "./components/layout/AuthorizedRoute";
import RequiredAuth from "./components/layout/RequiredAuth";
import SmartRedirect from "./components/layout/SmartRedirect";

// Create a client
const queryClient = new QueryClient();

// Lazy-loaded pages - split by feature for better chunking
const Register = lazy(() => import("./pages/auth/Register"));
const Login = lazy(() => import("./pages/auth/Login"));
const ForgotPassword = lazy(() => import("./pages/auth/ForgotPassword"));
const AdminForgotPassword = lazy(() => import("./pages/auth/AdminForgotPassword"));
const ResetPassword = lazy(() => import("./pages/auth/ResetPassword"));
const LinkedinAuthSuccess = lazy(() => import("./pages/auth/LinkedinAuthSuccess"));
const VerifyEmailOTP = lazy(() => import("./pages/auth/VerifyEmailOTP"));

const Dashboard = lazy(() => import("./pages/dashboard/Dashboard"));
const SearchPage = lazy(() => import("./pages/dashboard/SearchPage"));
const ContactPage = lazy(() => import("./pages/dashboard/ContactPage"));
const ImportPage = lazy(() => import("./pages/dashboard/ImportPage"));
const SettingsPage = lazy(() => import("./pages/dashboard/SettingsPage"));
const ListsPage = lazy(() => import("./pages/dashboard/ListsPage"));
const CompanyPage = lazy(() => import("./pages/dashboard/CompanyPage"));
const EnrichPage = lazy(() => import("./pages/dashboard/EnrichPage"));
const VerifyPage = lazy(() => import("./pages/dashboard/VerifyPage"));
const BillingPage = lazy(() => import("./pages/dashboard/BillingPage"));
const RecentSearchesPage = lazy(() => import("./pages/dashboard/RecentSearchesPage"));
const SavedSearchesPage = lazy(() => import("./pages/dashboard/SavedSearchesPage"));
const JoinTeam = lazy(() => import("./pages/dashboard/JoinTeam"));

const FastSpringCheckoutPage = lazy(() => import("./pages/payment/FastSpringCheckoutPage"));
const VoucherThankYouPage = lazy(() => import("./pages/payment/VoucherThankYouPage"));
const RedeemPage = lazy(() => import("./pages/payment/RedeemPage"));

const StripeProvider = lazy(() => import("./payment/provider/StripeProvider"));

const AdminAuth = lazy(() => import("./components/layout/AdminAuth"));
const AdminDashboard = lazy(() => import("./components/admin/dashboard/AdminDashboard"));
const AdminLogin = lazy(() => import("./pages/auth/AdminLogin"));
const ViewUsers = lazy(() => import("./components/admin/users/ViewUsers"));
const ViewTeams = lazy(() => import("./components/admin/users/ViewTeams"));
const TeamDetails = lazy(() => import("./components/admin/users/TeamDetails"));
const UpdateUser = lazy(() => import("./components/admin/users/UpdateUser"));
const AddUser = lazy(() => import("./components/admin/users/AddUser"));
const ViewAdmins = lazy(() => import("./components/admin/admin/ViewAdmins"));
const AddAdmin = lazy(() => import("./components/admin/admin/AddAdmin"));
const UpdateAdmin = lazy(() => import("./components/admin/admin/UpdateAdmin"));

const ViewPlans = lazy(() => import("./components/admin/plan/ViewPlans"));
const AddPlan = lazy(() => import("./components/admin/plan/AddPlan"));
const UpdatePlan = lazy(() => import("./components/admin/plan/UpdatePlan"));
const ViewCustomPlans = lazy(() => import("./components/admin/plan/ViewCustomPlans"));
const UpdateCustomPlans = lazy(() => import("./components/admin/plan/UpdateCustomPlans"));
const ViewCoupons = lazy(() => import("./components/admin/coupon/ViewCoupons"));
const AddCoupon = lazy(() => import("./components/admin/coupon/AddCoupon"));
const UpdateCoupon = lazy(() => import("./components/admin/coupon/UpdateCoupon"));
const ViewSpecialDeals = lazy(() => import("./components/admin/specialDeal/ViewSpecialDeals"));
const AddSpecialDeal = lazy(() => import("./components/admin/specialDeal/AddSpecialDeal"));
const UpdateSpecialDeal = lazy(() => import("./components/admin/specialDeal/UpdateSpecialDeal"));
const SpecialDealRequests = lazy(() => import("./components/admin/specialDeal/Requests"));
const SpecialDealAssigned = lazy(() => import("./components/admin/specialDeal/Assigned"));
const VoucherRequests = lazy(() => import("./components/admin/specialDeal/VoucherRequests"));
const ViewSubscriptions = lazy(() => import("./components/admin/subscription/ViewSubscriptions"));
const AddSubscription = lazy(() => import("./components/admin/subscription/AddSubscription"));
const UpdateSubscription = lazy(() => import("./components/admin/subscription/UpdateSubscription"));
const ViewTransactions = lazy(() => import("./components/admin/transactions/ViewTransactions"));
const AddTransaction = lazy(() => import("./components/admin/transactions/AddTransaction"));
const UpdateTransaction = lazy(() => import("./components/admin/transactions/UpdateTransaction"));
const AdminSettings = lazy(() => import("./components/admin/settings/settings"));
const LayoutSettings = lazy(() => import("./components/admin/layout/LayoutSettings"));
const ImportData = lazy(() => import("./components/admin/import/ImportData"));

// Loading fallback component
const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
    <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-600 border-t-transparent"></div>
  </div>
);

function App() {
  const { isLoggedIn, isAdminLoggedIn } = useStore();

  // Initialize theme on app load
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isDark = savedTheme === 'dark' || (!savedTheme && prefersDark);
    
    if (isDark) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('bg-slate-950', 'text-slate-100');
      document.body.classList.remove('bg-slate-50', 'text-slate-900');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.add('bg-slate-50', 'text-slate-900');
      document.body.classList.remove('bg-slate-950', 'text-slate-100');
    }
  }, []); // Only run on mount for theme initialization

  // ✅ CRITICAL FIX: Run each check independently on mount only to prevent race conditions
  useEffect(() => {
    checkLoginStatus();
  }, []); // Only run on mount for user session

  useEffect(() => {
    checkAdminLoginStatus();
  }, []); // Only run on mount for admin session

  // Listen for server-pushed notifications via Socket.io
  useNotificationSocket();

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <QueryClientProvider client={queryClient}>
        <Suspense fallback={<LoadingFallback />}>
          <StripeProvider>
            <Router>
              <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored"
                transition={Bounce}
              />
              <Routes>
                <Route path="/team/join/:token" element={<JoinTeam />} />
                {/* Public auth routes - accessible even with old tokens */}
                <Route path="/reset-password" element={<ResetPassword />} />
                
                <Route element={<AuthorizedRoute />}>
                  <Route path="/register" element={<Register />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route path="/admin-login" element={<AdminLogin />} />
                  <Route path="/admin-forgot-password" element={<AdminForgotPassword />} />
                  <Route
                    path="/linkedin-auth-success"
                    element={<LinkedinAuthSuccess />}
                  />
                  <Route path="/verify-email" element={<VerifyEmailOTP />} />
                </Route>
                
                <Route path="/" element={<Navigate to="/login" replace />} />
                <Route path="/smart-redirect" element={<SmartRedirect />} />
                <Route path="/redeem" element={<RedeemPage />} />

                <Route element={<RequiredAuth />}>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/search/:filterName?" element={<SearchPage />} />
                  <Route
                    path="/recent-searches"
                    element={<RecentSearchesPage />}
                  />
                  <Route path="/saved-search" element={<SavedSearchesPage />} />
                  <Route path="/saved-searches" element={<SavedSearchesPage />} />
                  <Route path="/contacts" element={<ContactPage />} />
                  <Route path="/lists" element={<ListsPage />} />
                  <Route path="/companies" element={<CompanyPage />} />
                  <Route path="/enrich" element={<EnrichPage />} />
                  <Route path="/import" element={<ImportPage />} />
                  <Route path="/verify" element={<VerifyPage />} />
                  <Route path="/settings/*" element={<SettingsPage />} />
                  <Route path="/plans-and-billings" element={<BillingPage />} />
                 <Route path="/billing/success" element={<Navigate to="/dashboard" replace />} />
                   <Route path="/billing/cancel" element={<Navigate to="/plans-and-billings" replace />} />
                   <Route path="/fastspring-checkout" element={<FastSpringCheckoutPage />} />
                   <Route path="/thank-you" element={<VoucherThankYouPage />} />
                </Route>

                <Route element={<AdminAuth />}>
                  <Route path="/admin/dashboard" element={<AdminDashboard />} />
                  <Route path="/admin/users" element={<ViewUsers />} />
                  <Route path="/admin/users/teams" element={<ViewTeams />} />
                  <Route path="/admin/users/teams/:id" element={<TeamDetails />} />
                  <Route path="/admin/users/add" element={<AddUser />} />
                  <Route
                    path="/admin/update-user/:userId"
                    element={<UpdateUser />}
                  />
                  <Route path="/admin/admins" element={<ViewAdmins />} />
                  <Route path="/admin/admins/add" element={<AddAdmin />} />
                  <Route path="/admin/settings" element={<AdminSettings />} />
                  <Route path="/admin/layout" element={<LayoutSettings />} />
                  <Route path="/admin/import" element={<ImportData />} />

                  <Route
                    path="/admin/update-admin/:userId"
                    element={<UpdateAdmin />}
                  />
                  <Route path="/admin/plans" element={<ViewPlans />} />
                  <Route path="/admin/custom-plans" element={<ViewCustomPlans />} />
                  <Route path="/admin/plans/add" element={<AddPlan />} />
                  <Route
                    path="/admin/update-plan/:planId"
                    element={<UpdatePlan />}
                  />
                  <Route
                    path="/admin/update-custom-plan/:planId"
                    element={<UpdateCustomPlans />}
                  />
                  <Route path="/admin/coupons" element={<ViewCoupons />} />
                  <Route path="/admin/coupons/add" element={<AddCoupon />} />
                  <Route
                    path="/admin/update-coupon/:couponId"
                    element={<UpdateCoupon />}
                  />
                  <Route path="/admin/special-deals" element={<ViewSpecialDeals />} />
                  <Route path="/admin/special-deals/add" element={<AddSpecialDeal />} />
                  <Route path="/admin/special-deals/requests" element={<SpecialDealRequests />} />
                  <Route path="/admin/special-deals/voucher-requests" element={<VoucherRequests />} />
                  <Route path="/admin/special-deals/assigned" element={<SpecialDealAssigned />} />
                  <Route
                    path="/admin/update-special-deal/:dealId"
                    element={<UpdateSpecialDeal />}
                  />
                  <Route
                    path="/admin/subscriptions"
                    element={<ViewSubscriptions />}
                  />
                  <Route
                    path="/admin/subscriptions/add"
                    element={<AddSubscription />}
                  />
                  <Route
                    path="/admin/update-subscription/:subscriptionId"
                    element={<UpdateSubscription />}
                  />
                  <Route
                    path="/admin/transactions"
                    element={<ViewTransactions />}
                  />
                  <Route
                    path="/admin/transactions/add"
                    element={<AddTransaction />}
                  />
                  <Route
                    path="/admin/update-transaction/:transactionId"
                    element={<UpdateTransaction />}
                  />
                </Route>
              </Routes>
            </Router>
          </StripeProvider>
        </Suspense>
      </QueryClientProvider>
    </GoogleOAuthProvider>
  );
}

export default App;