import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Product from './pages/product';
import NewProduct from './pages/newProduct';
import Suppliers from './pages/suppliers';
import Login from './pages/Login';
import Profile from './pages/profile';
//import UserProfile from './pages/userProfile';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="products" element={<Product />} />
          <Route path="newProduct" element={<NewProduct/>}/>
          <Route path="suppliers" element={<Suppliers />} />   
          <Route path="profile" element={<Profile />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;


//          <Route path="UserProfile" element={<userProfile />} />
