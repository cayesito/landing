const express = require('express');
const fs = require('fs');
const app = express();
const cors = require('cors'); // Importa el paquete cors
const PORT = 3000;

// Middleware para habilitar CORS
app.use(cors());

// Middleware para manejar datos JSON
app.use(express.json());

// Ruta para guardar los datos en el archivo JSON
app.post('/guardar-datos', (req, res) => {
    const nuevosDatos = req.body;  // Recibe los datos enviados por el cliente

    // Leer el archivo JSON existente
    fs.readFile('./data/datos.json', 'utf8', (err, data) => {
        if (err) {
            console.error('Error al leer el archivo:', err);
            return res.status(500).json({ mensaje: 'Error al leer el archivo JSON' });
        }

        // Si el archivo está vacío o no existe, inicializa como un array vacío
        let datosExistentes = [];
        if (data) {
            try {
                // Intenta parsear los datos JSON
                datosExistentes = JSON.parse(data);
            } catch (parseError) {
                console.error('Error al parsear el archivo JSON:', parseError);
                return res.status(500).send('Error al parsear los datos');
            }
        }

        const usuarioExistente = datosExistentes.find(user => user.usuario === nuevosDatos.usuario);

        if (usuarioExistente) {
            return res.status(400).json({ error: 'userAlreadyExists' });
        }

        const emailExistente = datosExistentes.find(user => user.email === nuevosDatos.email);

        if (emailExistente) {
            return res.status(400).json({ error: 'emailAlreadyExists' });
        }

        // Agregar el nuevo dato al array
        datosExistentes.push(nuevosDatos);

        // Guardar los datos actualizados en el archivo JSON
        fs.writeFile('./data/datos.json', JSON.stringify(datosExistentes, null, 2), 'utf8', (err) => {
            if (err) {
                console.error('Error al guardar los datos:', err);
                return res.status(500).send('Error al guardar los datos');
            }

            // Responder al cliente con éxito
            res.status(200).json({ message: 'Datos guardados correctamente' });
        });
    });
});

app.get('/obtener-datos', (req, res) => {
    // Leer el archivo JSON existente
    fs.readFile('./data/datos.json', 'utf8', (err, data) => {
        if (err) {
            console.error('Error al leer el archivo:', err);
            return res.status(500).json({ mensaje: 'Error al leer los datos' });
        }

        try {
            const usuarios = JSON.parse(data);
            res.json(usuarios);  // Envía el array de usuarios al cliente
        } catch (parseError) {
            console.error('Error al parsear el archivo JSON:', parseError);
            return res.status(500).send('Error al parsear los datos');
        }
    });
});

app.put('/update', (req, res) => {

    const { userId, newPassword } = req.body;

    if (!userId || !newPassword) {
        return res.status(400).json({ error: 'Debe proporcionar un userId y una nueva contraseña.' });
    }

    // Ruta del archivo JSON
    const filePath = './data/datos.json';

    // Leer el archivo JSON
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error al leer el archivo JSON:', err);
            return res.status(500).json({ error: 'Error al leer el archivo JSON.' });
        }

        try {
            // Parsear el contenido JSON

            const usuarios = JSON.parse(data);

            // Buscar al usuario por userId
            const usuario = usuarios.find(user => user.usuario === String(userId) || user.email === String(userId));

            if (!usuario) {
                return res.status(404).json({ error: 'Usuario no encontrado.' });
            }

            // Verificar si la nueva contraseña es igual a la actual
            if (usuario.password === newPassword) {
                return res.status(400).json({ error: 'samePassword' });
            }

            // Actualizar la contraseña del usuario
            usuario.password = newPassword;

            // Guardar los datos actualizados en el archivo JSON
            fs.writeFile(filePath, JSON.stringify(usuarios, null, 2), 'utf8', (err) => {
                if (err) {
                    console.error('Error al escribir en el archivo JSON:', err);
                    return res.status(500).json({ error: 'Error al guardar los datos.' });
                }

                res.status(200).json({ message: 'Contraseña actualizada con éxito.' });
            });
        } catch (parseError) {
            console.error('Error al parsear el JSON:', parseError);
            res.status(500).json({ error: 'Error al procesar los datos.' });
        }
    });
});

// Servir el archivo HTML
app.use(express.static('.'));

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});