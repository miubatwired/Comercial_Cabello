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
    methods: ["POST", "GET"],
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
                    const name = data[0].nombre;
                    const token = jwt.sign({name}, "jwt-secret-key", {expiresIn: '1d'});
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

app.listen(8081, () => {
    console.log('Conectado al backend!');
})

