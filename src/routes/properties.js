import {Router} from 'express'
const router = Router()

import {protectURL} from '../lib/security'
import { createProperty, getProperty, getPropertys, deleteProperty, updateProperty } from '../controllers/property.controller'

router.post('/',protectURL,createProperty)
router.get('/',protectURL,getPropertys)
router.get('/:property_id([0-9]+)',protectURL,getProperty)
router.delete ('/:property_id([0-9]+)',protectURL,deleteProperty)
router.put('/:property_id([0-9]+)',protectURL,updateProperty)

export default router