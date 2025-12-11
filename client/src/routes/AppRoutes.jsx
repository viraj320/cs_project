import AdminGarages from '../pages/admin/AdminGarages';
import AdminReports from '../pages/admin/AdminReports';
import React from 'react';
import { Routes, Route  } from 'react-router-dom';
import AdminReviews from "../pages/admin/AdminReviews";
import HomePage from '../pages/homepage/HomePage';
import LoginPage from '../pages/login/LoginPage';
import ResetPasswordPage from '../pages/login/ResetPasswordPage';
import SignUpPage from '../pages/Signup/SignupPage';
import SignupChoice from '../pages/auth/SignupChoice';
import GarageOwnerSignup from '../pages/auth/GarageOwnerSignup';
import EmergencyAssistance from '../pages/emergency/EmergencyAssistance';
import PastReportsPage from '../pages/emergency/PastReportsPage';
import ReportIncidentPage from '../pages/emergency/ReportIncidentPage';
import AboutUs from '../pages/aboutus/AboutUs';
import FindGaragesPage from '../pages/Garage/FindGaragesPage';
import GarageDashboard from '../pages/Garage/GarageDashboard';
import AdminLayout from '../pages/admin/AdminLayout';
import AdminOverview from '../pages/admin/AdminOverview';
import AdminCategories from '../pages/admin/AdminCategories';
import AdminSparePartItems from '../pages/admin/AdminSparePartItems';
import AdminOrders from '../pages/admin/AdminOrders';
//import AdminBookings from "../pages/admin/AdminBookings";
import AdminContactMessages from "../pages/admin/AdminContactMessages";
import AdminSubscribers from "../pages/admin/AdminSubscribers";
import AdminHomeSections from "../pages/admin/AdminHomeSections";
import AdminUsers from "../pages/admin/AdminUsers";
import ContactUs from "../pages/contactus/ContactUs";
import BrakersViewDetailsPage from '../pages/spareparts/BrakersViewDetailsPage';
import AddToCartPage from '../pages/spareparts/AddToCartPage';
import SparePartsPage from '../pages/spareparts/SparePartsPage';
import ProductDetailsPage from '../pages/spareparts/ProductDetailsPage';
import BumperGrillsViewDetailsPage from '../pages/spareparts/BumperGrillsViewDetailsPage';
import CarDoorsViewDetailsPage from '../pages/spareparts/CarDoorsViewDetailsPage';
import CarSensorViewDetailsPage from '../pages/spareparts/CarSensorViewDetailsPage';
import CoolingSystemViewDetailsPage from '../pages/spareparts/CoolingSystemViewDetailsPage';
import DrivetrainViewDetailsPage from '../pages/spareparts/DrivetrainViewDetailsPage';
import FenderViewDetailsPage from '../pages/spareparts/FendersViewDetailsPage';
import FoglightViewDetailsPage from '../pages/spareparts/FoglightViewDetailsPage';
import FrontBumpersViewDetailsPage from '../pages/spareparts/FrontBumpersViewDetailsPage';
import FuelAirViewDetailsPage from '../pages/spareparts/FuelAirViewDetailsPage';
import HeadlightViewDetailsPage from '../pages/spareparts/HeadlightsViewDetailsPage';
import ViewCartPage from '../pages/spareparts/ViewCartPage';
import CheckoutPage from '../pages/spareparts/CheckoutPage';
import CardPaymentPage from '../pages/spareparts/CardPaymentPage';
import CODPaymentPage from '../pages/spareparts/CODPaymentPage';
import OrderSuccessPage from '../pages/spareparts/OrderSuccessPage';
import PaypalPaymentFormPage from '../pages/spareparts/PaypalPaymentFormPage';
import CashOnDeliveryPage from '../pages/spareparts/CashOnDeliveryPage';
import CreditCardPaymentFormPage from '../pages/spareparts/CreditCardPaymentFormPage';
import AccountPage from '../pages/account/AccountPage';
import GarageDetails from '../pages/Garage/GarageDetails';
import GaragePortalRoutes from './GaragePortalRoutes';


const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/resetp" element={<ResetPasswordPage />} />
      <Route path="/signup-choice" element={<SignupChoice />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/register-garage-owner" element={<GarageOwnerSignup />} />
      <Route path="/emer" element={<EmergencyAssistance />} />
      <Route path="/add_report" element={<ReportIncidentPage />} />
      <Route path="/past_reports" element={<PastReportsPage />} />
      <Route path="/aboutus" element={<AboutUs />} />
      <Route path="/contactus" element={<ContactUs />} />
      <Route path="/garage" element={<FindGaragesPage/>} />
      <Route path="/garage/:id" element={<GarageDetails />} />
  <Route path="/garage-dashboard" element={<GarageDashboard />} />
  
  {/* Admin Dashboard Routes */}
    <Route path="/admin-dashboard" element={<AdminLayout />}>
    <Route index element={<AdminOverview />} />
    <Route path="categories" element={<AdminCategories />} />
    <Route path="spare-parts" element={<AdminSparePartItems />} />
    <Route path="garages" element={<AdminGarages />} />
    <Route path="reports" element={<AdminReports />} />
    <Route path="users" element={<AdminUsers />} />
    <Route path="orders" element={<AdminOrders />} />
    {/* <Route path="bookings" element={<AdminBookings />} /> */}
    <Route path="reviews" element={<AdminReviews />} />
    <Route path="subscribers" element={<AdminSubscribers />} />
    <Route path="home-sections" element={<AdminHomeSections />} />
    <Route path="contact-messages" element={<AdminContactMessages />} />
  </Route>
      {/* Garage Portal Routes - for garage owners and admins */}
      <Route path="/garage-portal/*" element={<GaragePortalRoutes />} />
      
      <Route path="/spareparts" element={<SparePartsPage />} />
      <Route path="/view-details" element={<ProductDetailsPage />} />
      <Route path="/braker" element={<BrakersViewDetailsPage />} />
      <Route path="/add-to-cart" element={<AddToCartPage />} />
      <Route path="/bumper" element={<BumperGrillsViewDetailsPage />} />
      <Route path="/cardoor" element={<CarDoorsViewDetailsPage />} />
      <Route path="/carsensor" element={<CarSensorViewDetailsPage />} />
      <Route path="/coolingsystem" element={<CoolingSystemViewDetailsPage />} />
      <Route path="/drivetrain" element={<DrivetrainViewDetailsPage />} />
      <Route path="/fender" element={<FenderViewDetailsPage />} />
      <Route path="/foglight" element={<FoglightViewDetailsPage />} />
      <Route path="/frontbumpers" element={<FrontBumpersViewDetailsPage />} />
      <Route path="/fuelair" element={<FuelAirViewDetailsPage />} />
      <Route path="/headlight" element={<HeadlightViewDetailsPage />} />
      <Route path="/view-cart" element={<ViewCartPage />} />
      <Route path="/checkout" element={<CheckoutPage />} />
      <Route path="/order-completecredit" element={<CardPaymentPage />} />
      <Route path="/order-completecash" element={<CODPaymentPage />} />
      <Route path="/order-success" element={<OrderSuccessPage />} />
      <Route path="/account" element={<AccountPage />} />
    </Routes>
  );
};

export default AppRoutes;