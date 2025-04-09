import  { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import axios from 'axios';
import delIcon from '../assets/inventario/-.svg'
import modIcon from '../assets/inventario/modIcon.svg'
import showIcon from '../assets/usuarios/mostrar.svg'
import hideIcon from '../assets/usuarios/esconder.svg'
import ModificacionProductosModal from './ModificacionProductosModal';
import toast, { Toaster } from 'react-hot-toast';


function DataTableComponent() {
  const [visiblePasswords, setVisiblePasswords] = useState({});
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [selectedCodigo, setSelectedCodigo] = useState(null);
  const customStyles = {
    headRow: {
      style: {
        backgroundColor: "#9B1313",
        color: "white",
        fontSize: "170%",
        height: "200%",
      },
    },
  }


  //MODIFICAR
  const handleDelete = async (usuario) => {
    try {
      axios.delete(`http://localhost:8081/deleteUsuario/${usuario}`);
      setData(data.filter((row) => row.usuario !== usuario));
    } catch (error) {
      console.error('Error deleting data:', error);
    }
  };

  //Modificar
  const handleModify = async (codigo) => {
    setSelectedCodigo(codigo);
    setOpenModal(true);
    {openModal && <ModificacionProductosModal closeModal={setOpenModal} codigo={selectedCodigo}/>}
  };


  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get('http://localhost:8081/data_usuarios');
        setData(response.data);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const togglePassword = (usuario) => {
    setVisiblePasswords((prev) => ({
      ...prev,
      [usuario]: !prev[usuario],
    }));
  };


  const columns = [
    { name: 'Usuario', selector: (row) => row.usuario, sortable: true },
    { name: 'Nombre', selector: (row) => `${row.Nombre}  ${row.apellido_paterno} ${row.apellido_materno}`, sortable: true },
    { name: 'Rol', selector: (row) => row.rol, sortable: true },
    // eslint-disable-next-line no-unused-vars
    {
      name: 'Contraseña',
      selector: (row) => (
        <div>
          {visiblePasswords[row.usuario] ? row.contrasena : '********'}
        </div>
      ),
    },
    {
      name: '',
      cell: (row) => (
        <div> 
          <img src={visiblePasswords[row.usuario] ? hideIcon : showIcon} alt="Delete" onClick={() => togglePassword(row.usuario)}
          style={{ marginBottom: '6%', marginRight: '3%'}}
          />
          <img src={delIcon} alt="Delete" onClick={() => /*handleDelete(row.usuario)*/toast('Todavía no funciona', {icon: '🚧'})} />
          <img src={modIcon} onClick={() => /*handleModify(row.usuario)*/ toast('Todavía no funciona', {icon: '🚧'}) }
          style={{ width: '30%', height: '40%', marginBottom: '10%', marginLeft: '8%'}} />        
        </div>
      ),
      ignoreRowClick: true,
    },
  ];

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <>
    <Toaster />
    <DataTable
      columns={columns}
      data={data} 
      noDataComponent="No hay usuarios"
      defaultSortFieldId={1}
      pagination
      responsive
      aginationPerPage={5}
      fixedHeader
      fixedHeaderScrollHeight="50%"
      customStyles={customStyles}
      paginationRowsPerPageOptions={[5, 10, 15, 20, 25, 30]}
    />

    {openModal && <ModificacionProductosModal closeModal={() => setOpenModal(false)} codigo={selectedCodigo}/>}

    </>
  );
  
}

export default DataTableComponent;