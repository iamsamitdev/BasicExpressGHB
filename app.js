const express = require('express')
const db = require('./utils/db')
const productRoutes = require('./routes/productRoutes')

const app = express()
app.use(express.json())

app.use('/products', productRoutes)

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

app.listen(3000, () => {
  console.log('App is running on port 3000')
})