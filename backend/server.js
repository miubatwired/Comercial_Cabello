import express from 'express';
import mysql2 from 'mysql2';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import cookieParser from 'cookie-parser';
const salt = 10;
 
const app = express();
app.use(express.json());
app.use(cors({
    origin: ["http://localhost:5173"],
    methods: ["POST", "GET", "DELETE", "OPTIONS"],
    credentials: true
}));
app.use(cookieParser());

const db = mysql2.createConnection({
    host:"localhost",
    user:"root",
    password:"Cabello1998",
    database:"comercial_cabello"
})

db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database: ' + err.stack);
        return;
  }
    console.log('Connected to the database as ID ' + db.threadId);
});

app.post('/register_user', (req, res) => {
    const sql = "INSERT INTO trabajadores(`nombre`,`apellido_paterno`,`apellido_materno`,`usuario`,`contrasena`,`rol`) VALUES (?)";
    bcrypt.hash(req.body.password.toString(), salt, (err, hash) => {
        if(err)return res.json({Error: "Error al encriptar la contraseña"});
        const values = [req.body.name, req.body.first_last_name, req.body.second_last_name, req.body.username, hash, req.body.role];
        db.query(sql, [values], (err, result) => {
            if(err) return res.json({Error: "Error al registrar el usuario"});
            return res.json({Message: "Exito"});
        })
    })
})

app.post('/login', (req, res) => {
    const sql = "SELECT * FROM trabajadores WHERE usuario = ?";
    db.query(sql, [req.body.username], (err, data) => {
        if(err) return res.json({Error: "Error al buscar el usuario"});
        if(data.length>0){
            bcrypt.compare(req.body.password.toString(), data[0].contrasena, (err, response) => {
                if(err) return res.json({Error: "Error al comparar la contrseña"});
                if(response){
                    const name = data[0].usuario;
                    const token = jwt.sign({name}, "jwt-secret-key", {expiresIn: '1d'}, {path: "/"});
                    res.cookie('token', token);
                    return res.json({Status: "Exito"});
                } else{
                    return res.json({Error: "Contraseña incorrecta"});
                }

            })
        }else{
            return res.json({Error: "Usuario no registrado"});
        }
    })
})

app.post('/insertarProducto',(req, res) => {
    const sql = "INSERT INTO productos(codigo,nombre,precio,cantidad,cantidad_minima) VALUES(?,?,?,?,?)";
    const sql_select_codigo = "SELECT * from productos where codigo=?";
    const sql_select_nombre = "SELECT * from productos where nombre=?";
    const num_values = [Number(req.body.codigo), Number(req.body.cantidad), Number(req.body.cantidad_minima), Number(req.body.precio)];
    const values = [req.body.codigo,req.body.nombre,req.body.precio,req.body.cantidad, req.body.cantidad_minima];
    db.query(sql_select_codigo, [req.body.codigo], (err,data) => {
        console.log(data.sql);
        if(data.length>0){
            return res.json({Error: "El CÓDIGO del producto YA está REGISTRADO"})
        }else{
            db.query(sql_select_nombre, [req.body.nombre], (err, data) => {
                if(data.length>0){
                    console.log(data.sql);
                    return res.json({Error: "El NOMBRE del producto YA está REGISTRADO"});
                }else{
                    if(Number.isInteger(num_values[0]) && Number.isInteger(num_values[1]) && Number.isInteger(num_values[2])){
                        db.query(sql, values, (err,data) => {
                            if(err) return res.json({Error: "Ha habido un error al insertar el producto"});
                            return res.json({Status: "Exito"});
                        })
                    }else{
                        return res.json({Error: "Por favor, ingrese cantidades ENTERAS"});
                    }
                }
            })
        }
    })
})


const verifyUser = (req, res, next) => {
    const token = req.cookies.token;
    if(!token){
        return res.json({Error: "No estás autenticado"});
    }else{
        jwt.verify(token, "jwt-secret-key", (err, decoded) => {
            if(err) return res.json({Error: "Token inválido"});
            req.name = decoded.name;
            next();
        })
    }
}

app.get('/', verifyUser, (req, res) => {
    return res.json({Status: "Exito", name: req.name});
})


app.get('/logout', (req, res) => {
    res.clearCookie('token');
    return res.json({Status: "Exito"});
})

app.get('/data', (req, res) => {
    db.query('SELECT * FROM PRODUCTOS', (error, results, fields) => {
      if (error) {
        console.error('Database query error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
        return;
      }
      res.json(results); 
    });
  });

  app.delete('/deleteProducto/:codigo', (req, res) => {
    const codigo = req.params.codigo;
    const sql = 'DELETE FROM productos WHERE codigo = ?';

    db.query(sql, [codigo], (err, result) => { 
        if (err) {
            return res.status(500).json({ Error: "Error al eliminar el producto" }); 
        }
        if (result.affectedRows > 0) {
            res.json({ message: 'Se eliminó el producto éxitosamente' });
        } else {
            res.status(404).json({ error: 'No se encontró el producto' });
        }
    });
});

app.get('/GetUser', (req, res) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ Error: "No token provided" });
    }

    try {
        const tokenDecoded = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
        const username = tokenDecoded.name;

        if (!username) {
          return res.status(400).json({ Error: "Username not found in token" });
        }

        const sql = 'SELECT nombre, apellido_paterno, rol FROM trabajadores WHERE usuario = ?';

        db.query(sql, [username], (err, results) => {
            if (err) {
                console.error("Database error:", err);
                return res.status(500).json({ Error: "Error fetching user data" });
            }

            if (results.length === 0) {
                return res.status(404).json({ Error: "User not found" });
            }

            const user = results[0];
            const fullName = user.nombre.split(" ");
            const firstName = fullName[0];
            const lastName = user.apellido_paterno;
            const name = firstName + " " + lastName;
            const rol = user.rol;
            return res.json({ name,rol });
        });

    } catch (error) {
        console.error("Token decoding error:", error);
        return res.status(400).json({ Error: "Invalid token format" }); // Handle decoding errors
    }
})

app.listen(8081, () => {
    console.log('Conectado al backend!');
})