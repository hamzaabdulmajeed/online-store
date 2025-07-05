import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Home from './pages/home';
import Navbar from './components/Navbar';
import AdminLogin from './pages/adminLogin';
import AdminDashboard from './pages/adminDashboard';
import Footer from './components/footer';
import Login from './pages/login';
import Signup from './pages/signup';
import MyOrders from './pages/myOrders';
import { ToastContainer, toast } from 'react-toastify';


function App() {
  const [loggedIn, setLoggedIn] = useState(!!localStorage.getItem('token'));

  return (
    <Router>
      <Navbar />
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
        theme="light"
      />
      {/* <ToastContainer /> */}
      <Routes>
        <Route path="/" element={<Home />} />
        {/* <Route path="/product/:id" element={<Product />} /> */}
        <Route path="/myorder" element={<MyOrders />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/admin"
          element={
            loggedIn ? (
              <AdminDashboard />
            ) : (
              <AdminLogin onLogin={() => setLoggedIn(true)} />
            )
          }
        />
        {/* <Route
          path="/admin"
          element={
            loggedIn ? (
              <AdminDashboard setLoggedIn={setLoggedIn} />
            ) : (
              <AdminLogin onLogin={() => setLoggedIn(true)} />
            )
          }
        /> */}
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
