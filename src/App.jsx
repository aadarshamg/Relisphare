
import React, { Suspense } from 'react';
import { Routes, Route, BrowserRouter as Router } from 'react-router-dom';
import { DataProvider } from '@/contexts/DataContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { AdminAuthProvider } from '@/contexts/AdminAuthContext';
import { CartProvider } from '@/contexts/CartContext';
import ScrollToTop from '@/components/ScrollToTop';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Toaster } from '@/components/ui/toaster';
import ProtectedRoute from '@/components/ProtectedRoute';

// Standard Pages
import HomePage from '@/pages/HomePage';
import ShopPage from '@/pages/ShopPage';
import ProductDetailsPage from '@/pages/ProductDetailsPage';
import CartPage from '@/pages/CartPage';
import CheckoutPage from '@/pages/CheckoutPage';
import OrderConfirmationPage from '@/pages/OrderConfirmationPage';
import LoginPage from '@/pages/LoginPage';
import SignupPage from '@/pages/SignupPage';

// Information Pages
import AboutPage from '@/pages/AboutPage';
import ContactPage from '@/pages/ContactPage';
import TermsAndConditionsPage from '@/pages/TermsAndConditionsPage';
import PrivacyPolicyPage from '@/pages/PrivacyPolicyPage';
import RefundAndCancellationPage from '@/pages/RefundAndCancellationPage';

// Lazy Loaded Admin Components
const AdminLayout = React.lazy(() => import('@/components/admin/AdminLayout'));
const AdminProtectedRoute = React.lazy(() => import('@/components/admin/AdminProtectedRoute'));
const AdminLoginPage = React.lazy(() => import('@/pages/admin/AdminLoginPage'));
const AdminSignupPage = React.lazy(() => import('@/pages/admin/AdminSignupPage'));
const AdminSetupPage = React.lazy(() => import('@/pages/admin/AdminSetupPage'));
const AdminDashboard = React.lazy(() => import('@/pages/admin/AdminDashboard'));
const AdminProductsPage = React.lazy(() => import('@/pages/admin/AdminProductsPage'));
const AdminOrdersPage = React.lazy(() => import('@/pages/admin/AdminOrdersPage'));
const AdminCustomersPage = React.lazy(() => import('@/pages/admin/AdminCustomersPage'));
const AdminSettingsPage = React.lazy(() => import('@/pages/admin/AdminSettingsPage'));
const AdminImageAssignmentPage = React.lazy(() => import('@/pages/admin/AdminImageAssignmentPage'));
const AdminImagePricingPage = React.lazy(() => import('@/pages/admin/AdminImagePricingPage'));
const AdminImageCompressionPage = React.lazy(() => import('@/pages/admin/AdminImageCompressionPage'));
const AdminImageCleanupPage = React.lazy(() => import('@/pages/admin/AdminImageCleanupPage'));
const AdminPriceAdjustmentPage = React.lazy(() => import('@/pages/admin/AdminPriceAdjustmentPage'));

const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[50vh]">
    <div className="w-8 h-8 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin"></div>
  </div>
);

function App() {
    return (
        <DataProvider>
            <AuthProvider>
                <AdminAuthProvider>
                    <CartProvider>
                        <Router>
                            <ScrollToTop />
                            <Routes>
                                <Route path="/admin" element={<Suspense fallback={<PageLoader />}><AdminLayout /></Suspense>}>
                                    <Route path="login" element={<Suspense fallback={<PageLoader />}><AdminLoginPage /></Suspense>} />
                                    <Route path="signup" element={<Suspense fallback={<PageLoader />}><AdminSignupPage /></Suspense>} />
                                    <Route path="setup" element={<Suspense fallback={<PageLoader />}><AdminSetupPage /></Suspense>} />
                                    <Route path="dashboard" element={<Suspense fallback={<PageLoader />}><AdminProtectedRoute><AdminDashboard /></AdminProtectedRoute></Suspense>} />
                                    <Route path="products" element={<Suspense fallback={<PageLoader />}><AdminProtectedRoute><AdminProductsPage /></AdminProtectedRoute></Suspense>} />
                                    <Route path="images" element={<Suspense fallback={<PageLoader />}><AdminProtectedRoute><AdminImageAssignmentPage /></AdminProtectedRoute></Suspense>} />
                                    <Route path="images-pricing" element={<Suspense fallback={<PageLoader />}><AdminProtectedRoute><AdminImagePricingPage /></AdminProtectedRoute></Suspense>} />
                                    <Route path="image-compression" element={<Suspense fallback={<PageLoader />}><AdminProtectedRoute><AdminImageCompressionPage /></AdminProtectedRoute></Suspense>} />
                                    <Route path="cleanup" element={<Suspense fallback={<PageLoader />}><AdminProtectedRoute><AdminImageCleanupPage /></AdminProtectedRoute></Suspense>} />
                                    <Route path="price-adjustment" element={<Suspense fallback={<PageLoader />}><AdminProtectedRoute><AdminPriceAdjustmentPage /></AdminProtectedRoute></Suspense>} />
                                    <Route path="orders" element={<Suspense fallback={<PageLoader />}><AdminProtectedRoute><AdminOrdersPage /></AdminProtectedRoute></Suspense>} />
                                    <Route path="customers" element={<Suspense fallback={<PageLoader />}><AdminProtectedRoute><AdminCustomersPage /></AdminProtectedRoute></Suspense>} />
                                    <Route path="settings" element={<Suspense fallback={<PageLoader />}><AdminProtectedRoute><AdminSettingsPage /></AdminProtectedRoute></Suspense>} />
                                    <Route index element={<Suspense fallback={<PageLoader />}><AdminProtectedRoute><AdminDashboard /></AdminProtectedRoute></Suspense>} />
                                </Route>
                                <Route path="*" element={
                                    <div className="flex flex-col min-h-screen">
                                        <Header />
                                        <main className="flex-grow">
                                            <Routes>
                                                <Route path="/" element={<HomePage />} />
                                                <Route path="/shop" element={<ShopPage />} />
                                                <Route path="/product/:id" element={<ProductDetailsPage />} />
                                                <Route path="/cart" element={<CartPage />} />
                                                <Route path="/checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
                                                <Route path="/order-confirmation/:orderId" element={<ProtectedRoute><OrderConfirmationPage /></ProtectedRoute>} />
                                                <Route path="/login" element={<LoginPage />} />
                                                <Route path="/signup" element={<SignupPage />} />
                                                <Route path="/about" element={<AboutPage />} />
                                                <Route path="/contact" element={<ContactPage />} />
                                                <Route path="/terms" element={<TermsAndConditionsPage />} />
                                                <Route path="/privacy" element={<PrivacyPolicyPage />} />
                                                <Route path="/refund-policy" element={<RefundAndCancellationPage />} />
                                            </Routes>
                                        </main>
                                        <Footer />
                                    </div>
                                } />
                            </Routes>
                            <Toaster />
                        </Router>
                    </CartProvider>
                </AdminAuthProvider>
            </AuthProvider>
        </DataProvider>
    );
}

export default App;
