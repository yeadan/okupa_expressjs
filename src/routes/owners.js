import {Router} from 'express'
const router = Router()

import {protectURL} from '../lib/security'
import { createOwner, getOwner, getOwners, deleteOwner, updateOwner } from '../controllers/owner.controller'

router.post('/',protectURL,createOwner)
router.get('/',protectURL,getOwners)
router.get('/:owner_id([0-9]+)',protectURL,getOwner)
router.delete ('/:owner_id([0-9]+)',protectURL,deleteOwner)
router.put('/:owner_id([0-9]+)',protectURL,updateOwner)

export default router