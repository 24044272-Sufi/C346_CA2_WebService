const express = require('express')
const mysql = require('mysql2/promise');
require('dotenv').config()
const port = 3000

const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    waitForConnections: true,
    connectionLimit: 100,
    queueLimit: 0,
}

// Create the pool once when the app starts
const pool = mysql.createPool(dbConfig)

const app = express()
app.use(express.json())

app.get('/foodwaste', async (req, res) => {
    try {
        // Get a connection from the pool
        const [rows] = await pool.query("SELECT * FROM defaultdb.food_waste_entries")
        res.json(rows);
    }
    catch(err) {
        console.error(err);
        res.status(500).json({message: "Server error for food_waste", reason: "Aiven Database is down, please power on service"})
    }
})

app.post('/addfoodwaste', async (req, res) => {
    const {category, weight, waste_reason} = req.body
    try {
        await pool.execute('INSERT INTO defaultdb.food_waste_entries (category, weight, waste_reason) VALUES (?, ?, ?)', [category, weight, waste_reason])
        res.status(201).json({message: `Food waste entry for ${category} added successfully`})
    }
    catch(err) {
        console.error(err);
        res.status(500).json({message: "Server error - could not add food waste entry for " + category, reason: "Aiven Database is down, please power on service"})
    }
})

app.delete('/deletefoodwaste/:id', async (req, res) => {
    const {id} = req.params
    try {
        const [result] = await pool.execute('DELETE FROM defaultdb.food_waste_entries WHERE id = ?', [id])
        
        if (result.affectedRows === 0) {
            res.status(404).json({message: `Food waste entry with id ${id} not found`})
        } else {
            res.status(200).json({message: `Food waste entry with id ${id} deleted successfully`})
        }
    }
    catch(err) {
        console.error(err);
        res.status(500).json({message: "Server error - could not delete food waste entry with id " + id, reason: "Aiven Database is down, please power on service"})
    }
})

app.put('/updatefoodwaste/:id', async (req, res) => {
    const {id} = req.params
    const {category, weight, waste_reason} = req.body
    try {
        const [result] = await pool.execute('UPDATE defaultdb.food_waste_entries SET category = ?, weight = ?, waste_reason = ? WHERE id = ?', [category, weight, waste_reason, id])
        
        if (result.affectedRows === 0) {
            res.status(404).json({message: `Food waste entry with id ${id} not found`})
        } else {
            res.status(200).json({message: `Food waste entry for ${category} updated successfully`})
        }
    }
    catch(err) {
        console.error(err);
        res.status(500).json({message: "Server error - could not update food waste entry with id " + id, reason: "Aiven Database is down, please power on service"})
    }
})

app.listen(port, () => {
    console.log("Server running on port", port)
})