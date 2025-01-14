const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const cors = require('cors'); // Importa el paquete cors
const port = 3000;

// Middleware para habilitar CORS
app.use(cors());

app.use(express.static(path.join(__dirname, 'landing')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'landing', 'index.html'));
});

app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});

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
    fs.readFile('./data/datos.json', 'utf8', (err, data) => {
        if (err) {
            console.error('Error al leer el archivo:', err);
            return res.status(500).json({ mensaje: 'Error al leer los datos' });
        }

        try {
            const usuarios = JSON.parse(data);
            res.json(usuarios); 
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

app.get('/buscar-usuario', (req, res) => {
    const { userId } = req.query;  // Recibe el userId (puede ser usuario o email desde la query)

    if (!userId) {
        return res.status(400).json({ error: 'Debe proporcionar un userId.' });
    }

    // Leer el archivo JSON
    fs.readFile('./data/datos.json', 'utf8', (err, data) => {
        if (err) {
            console.error('Error al leer el archivo:', err);
            return res.status(500).json({ mensaje: 'Error al leer los datos' });
        }

        try {
            const usuarios = JSON.parse(data);

            // Buscar al usuario por usuario o email
            const usuario = usuarios.find(user => user.usuario === userId || user.email === userId);

            if (!usuario) {
                return res.status(404).json({ error: 'Usuario no encontrado.' });
            }

            // Si el usuario existe, devolver toda su información
            res.status(200).json(usuario);
        } catch (parseError) {
            console.error('Error al parsear el archivo JSON:', parseError);
            return res.status(500).send('Error al parsear los datos');
        }
    });
});

app.get('/buscar-producto', (req, res) => {
    const { prodId } = req.query;  // Recibe el userId (puede ser usuario o email desde la query)

    if (!prodId) {
        return res.status(400).json({ error: 'Debe proporcionar un prodId.' });
    }

    // Leer el archivo JSON
    fs.readFile('./data/prod.json', 'utf8', (err, data) => {
        if (err) {
            console.error('Error al leer el archivo:', err);
            return res.status(500).json({ mensaje: 'Error al leer los datos' });
        }

        try {
            const productos = JSON.parse(data);

            // Buscar al usuario por usuario o email
            const producto = productos.find(user => user.id == prodId);

            if (!producto) {
                return res.status(404).json({ error: 'Usuario no encontrado.' });
            }

            // Si el usuario existe, devolver toda su información
            res.status(200).json(producto);
        } catch (parseError) {
            console.error('Error al parsear el archivo JSON:', parseError);
            return res.status(500).send('Error al parsear los datos');
        }
    });
});

app.put('/updateAll', (req, res) => {

    const { nuevosDatos } = req.body;

    if (!nuevosDatos) {
        return res.status(400).json({ error: 'Debe proporcionar los nuevos datos del usuario.' });
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
            const userId = nuevosDatos.usuario
 
            // Buscar al usuario por userId
            const usuarioIndex = usuarios.findIndex(user => user.usuario === userId || user.email === userId);

            if (usuarioIndex === -1) {
                return res.status(404).json({ error: 'Usuario no encontrado.' });
            }

            // Verificar si la nueva contraseña es igual a la actual
            if (usuarios[usuarioIndex].password === nuevosDatos.password) {
                return res.status(400).json({ error: 'samePassword' });
            }

            if (nuevosDatos.password === ""){
                nuevosDatos.password = usuarios[usuarioIndex].password
            }

            usuarios[usuarioIndex] = { ...usuarios[usuarioIndex], ...nuevosDatos };

            // Guardar los datos actualizados en el archivo JSON
            fs.writeFile(filePath, JSON.stringify(usuarios, null, 2), 'utf8', (err) => {
                if (err) {
                    console.error('Error al escribir en el archivo JSON:', err);
                    return res.status(500).json({ error: 'Error al guardar los datos.' });
                }

                res.status(200).json({ message: 'Usuario actualizada con éxito.' });
            });
        } catch (parseError) {
            console.error('Error al parsear el JSON:', parseError);
            res.status(500).json({ error: 'Error al procesar los datos.' });
        }
    });
});

app.put('/update-compra', (req, res) => {

    const content = req.body;

    if (!content) {
        return res.status(400).json({ error: 'Debe proporcionar un userId y un prodId del usuario.' });
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
            const userId = content.nuevosDatos.userId
            const prodId = content.nuevosDatos.prodId
 
            // Buscar al usuario por userId
            const usuarioIndex = usuarios.findIndex(user => user.usuario === userId || user.email === userId);

            if (usuarioIndex === -1) {
                return res.status(404).json({ error: 'Usuario no encontrado.' });
            }

            let datosSub = {
                tipoSuscripcion : "",
                estado: ""
            }

            if(prodId == 1){
                datosSub.tipoSuscripcion = "Básica"
                datosSub.estado = "Activa"
            } else if(prodId == 2){
                datosSub.tipoSuscripcion = "Avanzada"
                datosSub.estado = "Activa"
            } else {
                datosSub.tipoSuscripcion = "Premium"
                datosSub.estado = "Activa"
            }

                usuarios[usuarioIndex] = { ...usuarios[usuarioIndex], ...datosSub };

            // Guardar los datos actualizados en el archivo JSON
            fs.writeFile(filePath, JSON.stringify(usuarios, null, 2), 'utf8', (err) => {
                if (err) {
                    console.error('Error al escribir en el archivo JSON:', err);
                    return res.status(500).json({ error: 'Error al guardar los datos.' });
                }

                res.status(200).json({ message: 'Suscripción añadidad con exito' });
            });
        } catch (parseError) {
            console.error('Error al parsear el JSON:', parseError);
            res.status(500).json({ error: 'Error al procesar los datos.' });
        }
    });
});

app.put('/update-estado', (req, res) => {

    const content = req.body;

    if (!content) {
        return res.status(400).json({ error: 'Debe proporcionar un userId y un prodId del usuario.' });
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
            const userId = content.datosUpdate.userId
            const estadoNuevo = content.datosUpdate.estado
 
            // Buscar al usuario por userId
            const usuario = usuarios.find(user => user.usuario === String(userId) || user.email === String(userId));

            if (usuario === -1) {
                return res.status(404).json({ error: 'Usuario no encontrado.' });
            }
            
            usuario.estado = estadoNuevo

            // Guardar los datos actualizados en el archivo JSON
            fs.writeFile(filePath, JSON.stringify(usuarios, null, 2), 'utf8', (err) => {
                if (err) {
                    console.error('Error al escribir en el archivo JSON:', err);
                    return res.status(500).json({ error: 'Error al guardar los datos.' });
                }

                res.status(200).json({ message: 'Compra realizada con exito' });
            });
        } catch (parseError) {
            console.error('Error al parsear el JSON:', parseError);
            res.status(500).json({ error: 'Error al procesar los datos.' });
        }
    });
});

app.put('/comprar', (req, res) => {

    const content = req.body;

    if (!content) {
        return res.status(400).json({ error: 'Debe proporcionar un userId y un prodId del usuario.' });
    }   

    // Ruta del archivo JSON
    const filePathUser = './data/datos.json';
    const filePathProd = './data/prod.json';

    fs.readFile(filePathUser, 'utf8', (err, dataUser) => {
        if (err) {
            console.error('Error al leer el archivo JSON de usuarios:', err);
            return res.status(500).json({ error: 'Error al leer el archivo de usuarios.' });
        }
    
        try {
            const usuarios = JSON.parse(dataUser);
            const userId = content.nuevosDatos.userId;
    
            const usuario = usuarios.find(user => user.usuario === String(userId) || user.email === String(userId));
    
            if (!usuario) {
                return res.status(404).json({ error: 'Usuario no encontrado.' });
            }
    
            fs.readFile(filePathProd, 'utf8', (err, dataProd) => {
                if (err) {
                    console.error('Error al leer el archivo JSON de productos:', err);
                    return res.status(500).json({ error: 'Error al leer el archivo de productos.' });
                }
    
                try {
                    const productos = JSON.parse(dataProd);
                    const prodId = content.nuevosDatos.prodId;
    
                    // Buscar el producto por prodId
                    const producto = productos.find(p => p.id == prodId);
    
                    if (!producto) {
                        return res.status(404).json({ error: 'Producto no encontrado.' });
                    }
                    
                    usuario.totalGastado += producto.precio * parseFloat(content.nuevosDatos.cantidad)
                    usuario.compras += 1;

                    // Verificar si hay suficiente stock
                    if (producto.stock >= parseInt(content.nuevosDatos.cantidad)) {
                        producto.stock -= parseInt(content.nuevosDatos.cantidad); // Reducir el stock
                    } else {
                        return res.status(500).json({
                            error: `Lo lamentamos, tan solo nos quedan ${producto.stock} ${producto.nombre}. Le avisaremos cuando ampliemos stock.`
                        });
                    }
    
                    // Guardar los datos actualizados en ambos archivos JSON
                    fs.writeFile(filePathUser, JSON.stringify(usuarios, null, 2), 'utf8', (err) => {
                        if (err) {
                            console.error('Error al escribir en el archivo JSON de usuarios:', err);
                            return res.status(500).json({ error: 'Error al guardar los datos de usuarios.' });
                        }
    
                        // Guardar también los productos actualizados
                        fs.writeFile(filePathProd, JSON.stringify(productos, null, 2), 'utf8', (err) => {
                            if (err) {
                                console.error('Error al escribir en el archivo JSON de productos:', err);
                                return res.status(500).json({ error: 'Error al guardar los datos de productos.' });
                            }
                            // Todo ha salido bien, respondemos al cliente
                            res.status(200).json({ message: 'Compra realizada con éxito.' });
                        });
                    });
    
                } catch (parseError) {
                    console.error('Error al parsear el JSON de productos:', parseError);
                    res.status(500).json({ error: 'Error al procesar los datos de productos.' });
                }
            });
    
        } catch (parseError) {
            console.error('Error al parsear el JSON de usuarios:', parseError);
            res.status(500).json({ error: 'Error al procesar los datos de usuarios.' });
        }
    });
});

app.get('/allProductos', (req, res) => {
    fs.readFile('./data/prod.json', 'utf8', (err, data) => {
        if (err) {
            console.error('Error al leer el archivo:', err);
            return res.status(500).json({ mensaje: 'Error al leer los datos' });
        }

        try {
            const usuarios = JSON.parse(data);
            res.json(usuarios); 
        } catch (parseError) {
            console.error('Error al parsear el archivo JSON:', parseError);
            return res.status(500).send('Error al parsear los datos');
        }
    });
});