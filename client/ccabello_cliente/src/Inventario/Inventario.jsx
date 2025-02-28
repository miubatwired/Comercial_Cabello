import  { Component, createRef } from 'react';
import './Inventario.css';
import tienda from '../assets/inventario/tienda.svg';
import comercial from '../assets/inventario/comercial.svg';
import cabello from '../assets/inventario/cabello.svg';
import inventario from '../assets/inventario/inventarioo.svg';
import inventario_icon from '../assets/inventario/inventario_icon.svg'
import usericon from '../assets/inventario/user.svg'
import usuarios from '../assets/inventario/usuarios.svg'
import logoutIcon from '../assets/inventario/logout.svg'
import {Link} from "react-router-dom";
import pventa from '../assets/inventario/pventa.svg';
import DataTableComponent from './DataTableComponent';
import GetUser from './GetUser';
import Logout from '../Logout'

class Inventario extends Component {
  constructor(props) {
    super(props);
    this.sidenav = createRef();
    this.storeButton = createRef();
    this.ui = createRef();
    this.sidenavmenu = createRef();
    this.openNavbar = this.openNavbar.bind(this);
    this.closeNavbar = this.closeNavbar.bind(this);
  }


  openNavbar() {
    if (this.sidenav.current && this.storeButton.current && this.ui.current) {
      this.sidenav.current.style.width = '300px';
      this.storeButton.current.style.marginLeft = '16%';
      this.ui.current.onclick = this.closeNavbar;
      this.sleep(250).then(() => {this.sidenavmenu.current.style.display = 'flex';
      });
      this.ui.current.style.opacity = '.5';
    }
  }

  closeNavbar() {
    if (this.sidenav.current && this.storeButton.current && this.ui.current) {
      this.sidenav.current.style.width = '60%';
      this.storeButton.current.style.marginLeft = '10%';
      this.ui.current.onclick = null;
      this.sidenavmenu.current.style.display = 'none';
      document.body.style.backgroundColor = 'rgba(255, 255, 255, 0)';
      this.ui.current.style.opacity = '1';
    }
  }
  
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  render() {
    return (
      <>
        <div id="screen">
          <div id="sidenavbar">
            <div className="sidenav" id="mySidenav" ref={this.sidenav}>
              <img
                src={tienda}
                id="tienda"
                ref={this.storeButton}
                onClick={this.openNavbar}
                alt="Store Icon"
              />
              <div className="sidenavmenu" ref={this.sidenavmenu}>
                <img src={comercial} alt="Comercial Icon" />
                <img src={cabello} alt="Cabello Icon" />
                <div className='menuItem'>
                    <img src={pventa} alt="Punto de Venta Icon" className='icon'/>
                    <Link to="/pventa"> Punto de Venta </Link>
                </div>
                <div className='menuItem'>
                    <img src={inventario_icon} alt="Inventario" className='icon'/>
                    <Link to="/pventa"> Inventario </Link>
                </div>
                <div className='menuItem'>
                    <img src={usuarios} alt="Administración de Usuarios" className='icon'/>
                    <Link to="/pventa"> Administración de Usuarios </Link>
                </div>
                <div className='menuItem'>
                    <img src={logoutIcon} alt="Cerrar sesión" className='icon'/>
                    <Logout></Logout>
                </div>
                <Link to="/login">  </Link>
              </div>
            </div>
          </div>
          <div className="ui" id="ui" ref={this.ui}>
            <div id="header">
              <img src={inventario} id="logoInventario"></img>
            </div>
            <div id="headbar">
            <div id="userinfo">
              <img src={usericon}/>
              <div id="username">
              <GetUser></GetUser>
              </div>
            </div>
            </div>
              <DataTableComponent></DataTableComponent>
          </div>
        </div>
      </>
    );
  }
}

export default Inventario;