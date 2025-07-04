// server.js
const express    = require('express');
const mysql      = require('mysql2/promise');
const bodyParser = require('body-parser');
const path       = require('path');

const app = express();

// Motor de vistas
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Servir estáticos de /public
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }));

// Pool de conexión MySQL
const pool = mysql.createPool({
  host:     'localhost',
  user:     'root',
  password: 'admin',
  database: 'ControlDeReparaciones',
  waitForConnections: true,
  connectionLimit: 10,
});

// ——— Opción B: servir dashboard.html desde la ruta /dashboard.html ———
app.get('/dashboard.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'dashboard.html'));
});

// ——— GET: mostrar formulario con listas y posible mensaje de éxito ———
app.get('/reparaciones/nueva', async (req, res, next) => {
  try {
    const [equipos]     = await pool.query('SELECT equipo_id, nombre FROM equipos');
    const [marcas]      = await pool.query('SELECT marca_id, nombre FROM marcas');
    const [modelos]     = await pool.query('SELECT modelo_id, nombre FROM modelos');
    const [refacciones] = await pool.query('SELECT refaccion_id, nombre FROM refacciones');
    const [areas]       = await pool.query('SELECT area_id, nombre FROM areas');

    // Detectar si viene ?success=1
    const success = req.query.success === '1';

    res.render('form-reparacion', {
      equipos,
      marcas,
      modelos,
      refacciones,
      areas,
      success
    });
  } catch (err) {
    next(err);
  }
});

// ——— POST: procesar el formulario ———
app.post('/reparaciones', async (req, res, next) => {
  const {
    equipo_id,
    marca_id,
    modelo_id,
    inventario_equipo,
    refaccion_id,
    inventario_refaccion,
    descripcion,
    expediente,
    nombre,
    apellido_p,
    apellido_m,
    area_id
  } = req.body;

  try {
    // 1) (Opcional) actualizar inventario de refacción
    await pool.query(
      `UPDATE refacciones
         SET refaccion_inventario = ?
       WHERE refaccion_id = ?`,
      [inventario_refaccion, refaccion_id]
    );

    // 2) insertar usuario
    const [userResult] = await pool.query(
      `INSERT INTO usuarios
         (expediente, nombre, apellido_p, apellido_m, area_id)
       VALUES (?, ?, ?, ?, ?)`,
      [expediente, nombre, apellido_p || null, apellido_m || null, area_id]
    );
    const usuario_id = userResult.insertId;

    // 3) insertar reparación
    await pool.query(
      `INSERT INTO reparacion
         (equipo_id, inventario, refaccion_id, descripcion, fecha, usuario_id)
       VALUES (?, ?, ?, ?, CURDATE(), ?)`,
      [equipo_id, inventario_equipo, refaccion_id, descripcion, usuario_id]
    );

    // en lugar de res.send, redirigimos con flag de éxito
    res.redirect('/reparaciones/nueva?success=1');
  } catch (err) {
    next(err);
  }
});

// manejador de errores
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send('Error interno: ' + err.message);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅✅ Servidor corriendo en http://localhost:${PORT}✅✅`);
});
