import  { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import axios from 'axios';
import delIcon from '../assets/inventario/-.svg'
import modIcon from '../assets/inventario/modIcon.svg'

function DataTableComponent() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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

  const handleDelete = async (codigo) => {
    try {
      axios.delete(`http://localhost:8081/deleteProducto/${codigo}`);
      setData(data.filter((row) => row.codigo !== codigo));
    } catch (error) {
      console.error('Error deleting data:', error);
    }
  };

  const handleModify = async (codigo) => {
    try {
      await axios.delete(`http://localhost:8081/delete/${codigo}`);
      setData(data.filter((row) => row.codigo !== codigo));
    } catch (error) {
      console.error('Error deleting data:', error);
    }
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get('http://localhost:8081/data');
        setData(response.data);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const columns = [
    { name: 'Producto', selector: (row) => row.nombre },
    { name: 'Cantidad', selector: (row) => row.cantidad },
    { name: 'Código', selector: (row) => row.codigo },
    { name: 'Precio', selector: (row) => row.precio },
    { name: 'Cantidad Mínima', selector: (row) => row.cantidad_minima},
    {
      name: '',
      cell: (row) => (
        <div> 
          <img src={delIcon} alt="Delete" onClick={() => handleDelete(row.codigo)} />
          <img src={modIcon} onClick={() => handleModify(row.codigo)} 
          style={{ width: '50%', height: '40%', marginBottom: '10%', marginLeft: '12%'}} />        
        </div>
      ),
      ignoreRowClick: true,
    },
  ];

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <DataTable
      columns={columns}
      data={data}
      pagination
      responsive
      aginationPerPage={5}
      fixedHeader
      fixedHeaderScrollHeight="50%"
      customStyles={customStyles}
      paginationRowsPerPageOptions={[5, 10, 15, 20, 25, 30]}
    />
  );
}

export default DataTableComponent;