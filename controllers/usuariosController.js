const { poolPromise } = require('../config/db');

const registrarUsuario = async (req, res) => {
  const { nombre, correo, contraseña, rol } = req.body;

  try {
    const pool = await poolPromise;

    const result = await pool.request()
      .input('nombre', nombre)
      .input('correo', correo)
      .input('contraseña', contraseña) // En producción, debes encriptarla con bcrypt
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

const obtenerUsuarios = async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query('SELECT id, nombre, correo, rol, fechaRegistro FROM Usuarios');
    res.json(result.recordset);
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
};

module.exports = {
  registrarUsuario,
  obtenerUsuarios
};


