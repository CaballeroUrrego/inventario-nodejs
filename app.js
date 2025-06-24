const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { poolPromise } = require('./config/db');

const usuariosRoutes = require('./routes/usuarios');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public')); // ✅ Servir archivos HTML desde carpeta 'public'

const port = process.env.PORT || 3000;

// Rutas
app.use('/api/usuarios', usuariosRoutes);

// Ruta de prueba de conexión
app.get('/api/test-db', async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query('SELECT GETDATE() AS fechaActual');
    res.json(result.recordset[0]);
  } catch (err) {
    console.error('Error al consultar la base de datos:', err);
    res.status(500).json({ error: 'Error de conexión a la base de datos', detalles: err.message });
  }
});

app.listen(port, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${port}`);
});
