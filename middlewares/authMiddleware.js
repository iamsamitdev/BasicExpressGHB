const jwtUtils = require("../utils/jwtUtils")

// Bearer eyc0f3080380339089380r83
exports.authenticateJWT = (req, res, next) => {
  const authHeader = req.header("Authorization")
  const token = authHeader && authHeader.split(" ")[1]

  if(!token){
    return res.status(401).json({message: "Unauthorized"})
  }

  try{
    const user = jwtUtils.verifyAccessToken(token)
    req.user = user
    next() // ถ้า token ถูกต้อง ให้ไปทำ middleware ถัดไป
  }catch(error){
    console.error("Token verification failed:", error) // เพิ่มการ log ข้อผิดพลาด
    res.status(403).json({ message: "Forbidden: Invalid or expired token" }) // กรณี token ไม่ถูกต้อง
  }
}