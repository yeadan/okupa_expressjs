import {Router} from 'express'
const router = Router()

import {protectURL} from '../lib/security'
import { createOkupa, getOkupa, getOkupas, deleteOkupa, updateOkupa } from '../controllers/okupa.controller'

router.post('/',protectURL,createOkupa)
router.get('/',protectURL,getOkupas)
router.get('/:okupa_id([0-9]+)',protectURL,getOkupa)
router.delete ('/:okupa_id([0-9]+)',protectURL,deleteOkupa)
router.put('/:okupa_id([0-9]+)',protectURL,updateOkupa)

export default router