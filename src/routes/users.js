import { Router } from 'express'
const router = Router()
import { upload } from '../lib/upload'
import { protectURL } from '../lib/security'
import { login, getUsers, getUser, createUser, deleteUser, updateUser, uploadImage } from '../controllers/users.controller'



//Not protected
router.post('/', createUser)
router.post('/login', login)

//Protected
router.get('/', protectURL, getUsers)
router.get('/:user_id([0-9]+)', protectURL, getUser)
router.delete('/:user_id([0-9]+)', protectURL, deleteUser)
router.put('/:user_id([0-9]+)', protectURL, updateUser)

//Images  
router.post('/image/:user_id([0-9]+)', protectURL, upload.single('image'), uploadImage)

export default router