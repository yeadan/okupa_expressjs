import {Router} from 'express'
const router = Router()

import {protectURL} from '../lib/security'
import { createUserOkupa, getUserOkupa, deleteUserOkupa } from '../controllers/userOkupa.controller'

router.post('/:okupa_id([0-9]+)/:user_id([0-9]+)',protectURL,createUserOkupa)
router.get('/users/:okupa_id([0-9]+)',protectURL,getUserOkupa)
router.delete ('/:okupa_id([0-9]+)/:user_id([0-9]+)',protectURL,deleteUserOkupa)

export default router