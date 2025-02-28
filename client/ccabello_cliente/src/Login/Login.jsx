import { useState } from 'react'
import ellipse from '../assets/login/ellipse.svg'
import tienda from '../assets/login/tienda.svg'
import logo from '../assets/login/logo.svg'
import './Login.css'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

function Login() {
    const [values, setValues] = useState({
        username: '',
        password: '',
    })
    const navigate = useNavigate();
    axios.defaults.withCredentials = true;
    const handleSubmit = (event) => {
        event.preventDefault();
        axios.post('http://localhost:8081/login', values)
        .then(res => {
            if(res.data.Status==='Exito'){
                navigate('/inventario');
            }else{
                alert(res.data.Error);
            }
        })
        .then(err => console.log(err));
    }

    return (
      <>
        <div className='layout'>
          <div className='horizontal_layout'>
            <div className='tienda_logo'>
            <img src={ellipse} className="ellipse" alt="React logo" />
            <img src={tienda} className="tienda" alt="React logo" />
            </div>
            <div className="login">
            <img src={logo} className='logo' alt='logo' />
            <form onSubmit={handleSubmit} required id="loginform">
              <p className='label'>Usuario</p>
              <label> 
                <input className='input'
                  type="text" 
                  required
                  maxLength={12}
                  name='username'
                  onChange={(e) => setValues({...values, username: e.target.value})}
                />
              </label>
              <p className='label'>Contraseña</p>
              <label> 
                <input className='input'
                  type="password" 
                  required
                  maxLength={20}
                  name='password'
                  onChange={(e) => setValues({...values, password: e.target.value})}
                />
              </label>
              <label>
              <button type="submit" className='button'>INGRESAR</button>
              </label>
            </form>
          </div>
          </div>
          <div className='rectangle'>
            </div>
        </div>
      </>
    )
  }

  export default Login;