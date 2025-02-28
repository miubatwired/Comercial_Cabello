import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Login from './Login/Login.jsx';
import RegisterUser from './RegisterUser.jsx';
import Inventario from './Inventario/Inventario.jsx'
import DataTableComponent from './Inventario/DataTableComponent.jsx';
import GetUser from './Inventario/GetUser.jsx';

function App() {
 return(
   <BrowserRouter>
     <Routes>
       <Route path="/" element={<Login />} />
       <Route path="/RegisterUser" element={<RegisterUser />} />
       <Route path="/DataTableComponent" element={<DataTableComponent />} />
       <Route path="/inventario" element={<Inventario />} />
       <Route path="/GetUser" element={<GetUser />} />
     </Routes>
   </BrowserRouter>
 )
}

export default App
