const express = require('express');
const mysql   = require('mysql2');
const path    = require('path');
// En Render, las variables de entorno ya están disponibles directamente.
// Localmente, se cargan desde variables/.env si el archivo existe.
require('dotenv').config({ path: path.join(__dirname, '../variables/.env') });

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, '../front')));

// CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// CONEXIÓN A MYSQL
// ssl: se activa automáticamente si el proveedor en la nube lo requiere (ej. Railway).
const db = mysql.createConnection({
  host:     process.env.DB_HOST,
  port:     process.env.DB_PORT,
  user:     process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : undefined
});

db.connect(err => {
  if (err) {
    console.log('Error al conectar:', err.message);
  } else {
    console.log('Conectado a MySQL.');
  }
});

// HEALTH
app.get('/api/health', (req, res) => {
  res.json({ estado: 'ok' });
});

// LISTAR BÁSICO
app.get('/api/horarios/list-basic', (req, res) => {
  db.query('SELECT * FROM horarios_docentes', (err, rows) => {
    if (err) return res.status(500).json({ mensaje: 'Error interno.' });
    res.json(rows);
  });
});

// LISTAR CON BÚSQUEDA Y ORDEN
app.get('/api/horarios/list', (req, res) => {
  const orden      = req.query.orderBy || 'idHorario';
  const q          = '%' + (req.query.q || '') + '%';
  const permitidos = ['idHorario', 'docente', 'materia'];

  if (!permitidos.includes(orden)) {
    return res.status(400).json({ mensaje: 'Campo de orden no permitido.' });
  }

  db.query(
    `SELECT * FROM horarios_docentes WHERE docente LIKE ? OR materia LIKE ? OR facultad LIKE ? ORDER BY ${orden}`,
    [q, q, q],
    (err, rows) => {
      if (err) return res.status(500).json({ mensaje: 'Error interno.' });
      res.json(rows);
    }
  );
});

// BUSCAR POR ID
app.get('/api/horarios/byidHorario', (req, res) => {
  const id = req.query.idHorario;
  if (!id) return res.status(400).json({ mensaje: 'idHorario inválida.' });

  db.query('SELECT * FROM horarios_docentes WHERE idHorario = ?', [id], (err, rows) => {
    if (err) return res.status(500).json({ mensaje: 'Error interno.' });
    if (rows.length === 0) return res.status(404).json({ mensaje: 'Horario No existe.' });
    res.json(rows[0]);
  });
});

// CREAR
app.post('/api/horarios', (req, res) => {
  const { docente, facultad, carrera, materia, fechaClase, horaIniciaClase, horaTerminaClase } = req.body;

  if (!docente || !facultad || !carrera || !materia || !fechaClase || !horaIniciaClase || !horaTerminaClase) {
    return res.status(400).json({ mensaje: 'Debes completar todos los datos.' });
  }

  db.query(
    'INSERT INTO horarios_docentes (docente, facultad, carrera, materia, fechaClase, horaIniciaClase, horaTerminaClase) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [docente, facultad, carrera, materia, fechaClase, horaIniciaClase, horaTerminaClase],
    (err, resultado) => {
      if (err) return res.status(500).json({ mensaje: 'Error interno.' });
      res.json({ mensaje: 'Registro creado.', id: resultado.insertId });
    }
  );
});

// EDITAR
app.put('/api/horarios/:id', (req, res) => {
  const id = req.params.id;
  const { docente, facultad, carrera, materia, fechaClase, horaIniciaClase, horaTerminaClase } = req.body;

  if (!docente || !facultad || !carrera || !materia || !fechaClase || !horaIniciaClase || !horaTerminaClase) {
    return res.status(400).json({ mensaje: 'Debes completar todos los datos.' });
  }

  db.query(
    'UPDATE horarios_docentes SET docente=?, facultad=?, carrera=?, materia=?, fechaClase=?, horaIniciaClase=?, horaTerminaClase=? WHERE idHorario=?',
    [docente, facultad, carrera, materia, fechaClase, horaIniciaClase, horaTerminaClase, id],
    (err, resultado) => {
      if (err) return res.status(500).json({ mensaje: 'Error interno.' });
      if (resultado.affectedRows === 0) return res.status(404).json({ mensaje: 'Horario No existe.' });
      res.json({ mensaje: 'Horario editado.' });
    }
  );
});

// BORRAR
app.delete('/api/horarios/by-idHorario', (req, res) => {
  const id = req.body.idHorario;
  if (!id) return res.status(400).json({ mensaje: 'idHorario inválida.' });

  db.query('DELETE FROM horarios_docentes WHERE idHorario = ?', [id], (err, resultado) => {
    if (err) return res.status(500).json({ mensaje: 'Error interno.' });
    if (resultado.affectedRows === 0) return res.status(404).json({ mensaje: 'Horario No existe.' });
    res.json({ mensaje: 'Horario borrado.' });
  });
});

// INICIAR SERVIDOR
// Render asigna su propio puerto vía process.env.PORT y requiere escuchar en 0.0.0.0
const PUERTO = process.env.PORT || 8080;
app.listen(PUERTO, '0.0.0.0', () => {
  console.log('Servidor corriendo en el puerto ' + PUERTO);
});