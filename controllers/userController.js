// controller/userController.js
const bcrypt = require('bcryptjs')
const userService = require('../services/userService')
const jwtUtils = require('../utils/jwtUtils')

// ฟังก์ชันสำหรับลงทะเบียนผู้ใช้ใหม่
exports.registerUser = async (req, res) => {
  // รับค่าจาก client
  const { username, password, fullname, email, tel } = req.body

  // สร้างผู้ใช้ใหม่
  try {
    // เข้ารหัสผ่านและสร้างผู้ใช้ใหม่
    const hashedPassword = await bcrypt.hash(password, 10)
    const newUser = await userService.createUser(username, hashedPassword, fullname, email, tel)
    res.status(201).json(newUser)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Error registering user' })
  }
}

// ฟังก์ชันสำหรับเข้าสู่ระบบ
exports.loginUser = async (req, res) => {
  const { username, password } = req.body
  try {
    // ค้นหาผู้ใช้ตามชื่อผู้ใช้
    const user = await userService.findUserByUsername(username)

    if(!user){
      return res.status(400).json({ message: 'Invalid credentials' })
    }

    // ตรวจสอบรหัสผ่าน
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if(!isPasswordValid){
      return res.status(400).json({ message: 'Invalid credentials' })
    }

    // สร้าง Access Token และ Refresh Token
    const accessToken = jwtUtils.generateAccessToken(user.id)
    const refreshToken = jwtUtils.generateRefreshToken(user.id)

    // ส่งกลับข้อมูลผู้ใช้พร้อม token
    res.status(200).json({ 
      user: {
        id: user.id,
        username: user.username,
        fullname: user.fullname,
        email: user.email,
        tel: user.tel,
      }, 
      accessToken, 
      refreshToken 
    })

  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Error logging in' })
  }
}

// ฟังก์ชันสำหรับการ Refresh Token
exports.refreshToken = async (req, res) => {
  const { refreshToken } = req.body
  
  if (!refreshToken) return res.status(401).json({ message: 'Refresh token is required' })
  
  if (!jwtUtils.isRefreshTokenValid(refreshToken)) {
    return res.status(403).json({ message: 'Invalid refresh token' })
  }

  try{
    const decoded = jwtUtils.verifyRefreshToken(refreshToken) // ถอดรหัส Refresh Token
    const userId = (decoded).id // ดึงข้อมูล userId จาก decoded
    const newAccessToken = jwtUtils.generateAccessToken(userId) // สร้าง Access Token ใหม่
    res.status(200).json({ accessToken: newAccessToken })
  }catch (error) {
    console.error(error)
    res.status(403).json({ message: 'Invalid refresh token' })
  }
}

// ฟังก์ชันสำหรับออกจากระบบ
exports.logoutUser = async (req, res) => {
  const { refreshToken } = req.body
  if (!refreshToken) return res.status(400).json({ message: 'Refresh token is required' })
  jwtUtils.removeRefreshToken(refreshToken)
  res.json({ message: 'User logged out successfully' })
}