import User from '../models/Users'
import bcrypt from 'bcrypt'
import { bcryptPassComp, createJWT, userValid } from '../lib/security'
import cache from '../app'
import { Resize } from '../lib/resize'
const path = require('path')
const { check, validationResult } = require('express-validator')

export async function getUsers(req, res) {
  try {
    if (!userValid(0, "admin")) return res.status(403).json("Access forbidden")
    const users = await User.findAll()
    res.status(200).json(users)
    return null
  }
  catch (e) {
    console.log(e)
    return res.status(403).end()
  }
}
export async function getUser(req, res) {
  try {
    if (!userValid(0, "user")) return res.status(403).json("Access forbidden")

    if (req.params.user_id > 0) {
      const user = await User.findOne({
        where: {
          user_id: req.params.user_id
        }
      })
      return res.status(200).json(user)
    } else return res.status(400).json({ message: "Bad Request" })
  }
  catch (e) {
    console.log(e)
    return res.status(500).json({
      message: 'Something went wrong',
      data: {}
    })
  }
}
exports.createUser = [ //Validation
  check("username").isEmail().trim().withMessage("Invalid email")
    .isLength({ min: 4, max: 40 }).trim().withMessage("Length 4-40"),
  check('password').isLength({ min: 5, max: 40 }).trim().withMessage("Length 5-40"),
  //*** Quitar admin en un futuro ***
  check('role').isIn(['user', 'admin', 'anonymous']).trim().withMessage("Select 'user', 'admin' or 'anonymous'"),
  check('full_name').isLength({ min: 3, max: 30 }).trim().withMessage("Lenght 3-30")
    .matches(/^[A-Za-z\s]+$/).trim().withMessage('Must be alphabetic'),
  check('registered').isISO8601().trim().withMessage("Must be a valid ISO8601 datetime"),

  async function (req, res) {
    try {
      //Validation
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ message: 'JSON invalid', errors: errors.array() });
      }

      const { username, password, role, full_name, registered } = req.body

      const user = await User.findOne({
        where: {
          username
        }
      })
      if (user != null) {
        return res.status(400).json({
          message: 'The username is already being used',
          data: {}
        })
      }
      // Avatar sample
      let avatar = '@/images/avatar_sample.jpg'
      
      //Creating user
      let newUser = await User.create({
        username,
        password: bcrypt.hashSync(password, 10),
        role,
        full_name,
        avatar,
        registered
      }, { fields: ['username', 'password', 'role', 'full_name', 'avatar', 'registered'] }
      )
      if (newUser) {
        return res.status(201).json({
          message: 'User created successfully',
          data: newUser
        })
      }
    }
    catch (e) {
      if (e.name == 'SequelizeDatabaseError') {
        console.log('Error(400) -', e.name)
        return res.status(400).json({
          message: 'JSON invalid',
          data: {}
        })

      }
      console.log('Error(500) -', e)
      return res.status(500).json({
        message: 'Something went wrong',
        e
      })
    }
  }
]
export async function deleteUser(req, res) {
  try {
    if (!userValid(0, "admin")) return res.status(403).json("Access forbidden")

    if (req.params.user_id <= 0) return res.status(400).json({ message: "Bad Request" })

    const deleteRowCount = await User.destroy({
      where: {
        user_id: req.params.user_id
      }
    })
    if (deleteRowCount > 0)
      return res.status(204).json({
        message: 'User deleted successfully',
      })
    else
      return res.status(404).json({
        message: 'User not found'
      })
  } catch (e) {
    console.log(e)
    return res.status(500).json({
      message: 'Something went wrong',
      data: {}
    })

  }
}
export async function login(req, res) {
  const { username, password } = req.body

  try {
    //Username exist
    const user = await User.findOne({
      where: {
        username
      }
    })
    if (user === null || password === null) {
      return res.status(401).json({
        message: 'User or password incorrect',
        data: {}
      })
    }
    //User ok
    const pass_ok = await bcryptPassComp(password, user.password)
    if (pass_ok == false) {
      //Same message, Don't need to know if user exist (better)
      return res.status(401).json({
        message: 'User or password incorrect',
        data: {}
      })
    }
    //Password ok
    var user_id = user.user_id
    var role = user.role
    var token = createJWT()

    //Set cache with user info
    cache.set("user", { 'user_id': user.user_id, 'username': user.username, 'role': user.role, 'token': token })

    return res.status(200).json({
      message: 'User logged',
      user_id, role, token
    })
  }
  catch (e) {
    if (e.name == 'SequelizeDatabaseError') {
      console.log('Error(400) -', e.name)
      return res.status(400).json({
        message: 'JSON invalid',
        data: {}
      })
    }
    console.log(e)
    return res.status(500).json({
      message: 'Something went wrong',
      data: {}
    })
  }
}
exports.updateUser = [ //Validation
    check('password').isLength({ min: 5, max: 40 }).trim().withMessage("Length 5-40").optional(),
    check('role').isIn(['user', 'admin', 'anonymous']).trim().withMessage("Select 'user', 'admin' or 'anonymous'"),
    check('full_name').isLength({ min: 3, max: 30 }).trim().withMessage("Lenght 3-30")
      .matches(/^[A-Za-z\s]+$/).trim().withMessage('Must be alphabetic'),
    check('user_id').isInt().withMessage('Must be an integer'),
  
async function (req, res) {
  try {
      //Validation
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ message: 'JSON invalid', errors: errors.array() });
      }
    const { user_id } = req.params
    if (!userValid(user_id, "admin")) return res.status(403).json("Access forbidden")

    let newdata = { full_name: req.body.full_name }
    
    //If password -> encrypt password
    if (req.body.password)
      newdata.password = bcrypt.hashSync(req.body.password, 10)

    const user = await User.findOne({
      where: {
        user_id
      }
    })

    if (user === null) {
      return res.status(404).json({
        message: "Cannot find user"
      })
    }
    //Only admin can update rule
    if (cache.get("user").role == "admin") newdata.role = req.body.role
    user.update(newdata)
    return res.status(204).json({
      message: 'User updated successfully',

    })
  } catch (e) {
    console.log(e)
    res.status(500).json({
      message: 'Something went wrong',
      data: {}
    })
  }
}]
export async function uploadImage(req, res) {
  try {
    const { user_id } = req.params
    if (!userValid(user_id, "admin")) return res.status(403).json("Access forbidden")

    const user = await User.findOne({
      where: {
        user_id
      }
    })

    if (user === null) {
      return res.status(404).json({
        message: "Cannot find user"
      })
    }

    const imagePath = path.join(__dirname, '/../../images/avatars')
    const fileUpload = new Resize(imagePath);
    if (!req.file) {
      return res.status(401).json({ error: 'Please provide an image' })
    }

    fileUpload.save(req.file.buffer)
      .then((target) => {
        var newdata = {}
        newdata.avatar = "avatars/" + target
        user.update(newdata)
        return res.status(201).json({
          message: 'Image uploaded successfully',
          data: newdata.avatar
        })
      })
      .catch((e) => { console.log(e) })
  }
  catch (e) {
    console.log(e)
    res.status(500).json({
      message: 'Something went wrong',
      data: {}
    })
  }
}