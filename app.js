const express = require('express')
const dotenv = require('dotenv')
const db = require('./utils/db')
const productRoutes = require('./routes/productRoutes')
const userRoutes = require('./routes/userRoutes')
const setupSwagger = require('./utils/swagger')

dotenv.config()

const app = express()
app.use(express.json())
setupSwagger(app)

app.use('/products', productRoutes)
app.use('/users', userRoutes)

app.get('/', (req, res) => {
  res.send('Hello World!')
})

// ทดสอบการเชื่อมต่อฐานข้อมูล
app.get('/testdb', async(req, res) => {
  try {
    const client = await db.connect() // เชื่อมต่อฐานข้อมูล
    const result = await client.query('SELECT NOW()')
    client.release()

    // แปลงเวลา UTC เป็นเวลาท้องถิ่น
    const utcTime = result.rows[0].now
    const localTime = new Date(utcTime).toLocaleString('th-TH', { timeZone: 'Asia/Bangkok' })

    res.status(200).json({
      message: 'Database connection successful',
      time: localTime
    })

  } catch (error){
    res.status(500).json({
      message: 'Database connection failed',
      error: error.message
    })
  }
})

const PORT = process.env.PORT || 3000
const HOST = process.env.HOST || 'localhost'

app.listen(PORT, () => {
  console.log(`App is running on http://${HOST}:${PORT}`)
  console.log(`API documentation available at http://${HOST}:${PORT}/api-docs`)
})