import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Login from './Login/Login.jsx';
import RegisterUser from './RegisterUser.jsx';
import Inventario from './Inventario/Inventario.jsx'

function App() {
 return(
   <BrowserRouter>
     <Routes>
       <Route path="/" element={<Login />} />
       <Route path="/RegisterUser" element={<RegisterUser />} />
       <Route path="/inventario" element={<Inventario />} />
     </Routes>
   </BrowserRouter>
 )
}

export default App
