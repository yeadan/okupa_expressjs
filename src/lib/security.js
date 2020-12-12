import bcrypt from 'bcrypt'
import cache from '../app'
const jwt = require('jsonwebtoken');


// Protecting role function
export function userValid(user, role) {
  var usercache = null
  if (cache != null) 
    usercache = cache.get("user") 
  if (usercache == null) return false

  if (user <= 0) //No user required
    if (role == "") return true // No role required
    else if (role == usercache.role || usercache.role == "admin")
      return true // Role required and passed
    else return false // Role required and failed
  else //User required
    if (user == usercache.user_id || usercache.role == "admin")
      return true
  return false
}

// Compare new password with encrypted old password
export function bcryptPassComp(pass, cryptpass) {
  return new Promise(function (resolve, reject) {
    bcrypt.compare(pass, cryptpass, function (err, res) {
      if (err) {
        reject(err)
      } else {
        resolve(res)
      }
    })
  })
}

// Create JWT token
export function createJWT() {
  const payload = {
    check: true
  };
  const token = jwt.sign(payload, process.env.secret_key, {
    expiresIn: 1440
  });
  return token
}
//Middleware for protecting URL with token authorization
export function protectURL(req, res, next) {
  const bearer = req.headers.authorization
  if (bearer)
    var token = bearer.split(" ")[1]
  else token = false
  if (token) {
    jwt.verify(token, process.env.secret_key, (err, decoded) => {
      if (err) {
        return res.status(401).json({ mensaje: 'Token inválido' });
      } else {
        req.decoded = decoded;
        next();
      }
    });
  } else {
    return res.status(401).json({ message: 'No se ha encontrado token' })
  }
}