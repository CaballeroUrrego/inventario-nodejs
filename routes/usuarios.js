const express = require('express');
const router = express.Router();
const { poolPromise } = require('../config/db');

// Registrar usuario
const registrarUsuario = async (req, res) => {
  const { nombre, correo, contraseña, rol } = req.body;

  try {
    const pool = await poolPromise;

    const checkCorreo = await pool.request()
      .input('correo', correo)
      .query('SELECT COUNT(*) AS total FROM Usuarios WHERE correo = @correo');

    if (checkCorreo.recordset[0].total > 0) {
      return res.status(400).json({ error: 'El correo ya está registrado' });
    }

    await pool.request()
      .input('nombre', nombre)
      .input('correo', correo)
      .input('contraseña', contraseña)
      .input('rol', rol || 'usuario')
      .query(`
        INSERT INTO Usuarios (nombre, correo, contraseña, rol)
        VALUES (@nombre, @correo, @contraseña, @rol)
      `);

    res.status(201).json({ mensaje: 'Usuario registrado correctamente' });
  } catch (error) {
    console.error('Error al registrar usuario:', error);
    res.status(500).json({ error: 'Error al registrar el usuario' });
  }
};

// Obtener todos los usuarios
const obtenerUsuarios = async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query(`
      SELECT id, nombre, correo, rol, fechaRegistro
      FROM Usuarios
      ORDER BY id ASC
    `);
    res.json(result.recordset);
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
};

// Asocia las rutas al router
router.post('/', registrarUsuario);
router.get('/', obtenerUsuarios);

module.exports = router;