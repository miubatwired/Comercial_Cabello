import  { Component, createRef } from 'react';
import './Inventario.css';
import tienda from '../assets/inventario/tienda.svg';
import comercial from '../assets/inventario/comercial.svg';
import cabello from '../assets/inventario/cabello.svg';
import {Link} from "react-router-dom";
import pventa from '../assets/inventario/pventa.svg';

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
      document.body.style.backgroundColor = 'rgba(0,0,0,0.4)';
    }
  }

  closeNavbar() {
    if (this.sidenav.current && this.storeButton.current && this.ui.current) {
      this.sidenav.current.style.width = '60%';
      this.storeButton.current.style.marginLeft = '10%';
      this.ui.current.onclick = null;
      this.sidenavmenu.current.style.display = 'none';
      document.body.style.backgroundColor = 'rgba(255, 255, 255, 0)';
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
                    <img src={pventa} alt="Punto de Venta Icon" className='icon'/>
                    <Link to="/pventa"> Punto de Venta </Link>
                </div>
                <div className='menuItem'>
                    <img src={pventa} alt="Punto de Venta Icon" className='icon'/>
                    <Link to="/pventa"> Punto de Venta </Link>
                </div>
                <div className='menuItem'>
                    <img src={pventa} alt="Punto de Venta Icon" className='icon'/>
                    <Link to="/pventa"> Punto de Venta </Link>
                </div>
                <Link to="/login">  </Link>
              </div>
            </div>
          </div>
          <div className="ui" id="ui" ref={this.ui}>
            
          </div>
        </div>
      </>
    );
  }
}

export default Inventario;