import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Login from './Login';
import RegisterUser from './RegisterUser';
import Inventario from './Inventario'



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
