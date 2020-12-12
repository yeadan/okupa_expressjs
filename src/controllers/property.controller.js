import Property from '../models/Properties'
import User from '../models/Users'
import Owner from '../models/Owners'
import Okupa from '../models/Okupas'
import { userValid } from '../lib/security'
const { check, validationResult } = require('express-validator')


export async function getPropertys(req, res) {
    try {
        if (!userValid(0, "user")) return res.status(403).json("Access forbidden")

        const property = await Property.findAll({
            include: [User, Owner, Okupa]
        })
        return res.status(200).json(property)
    }
    catch (e) {
        console.log(e)
    }
}

exports.createProperty = [ //Validation
    check('description').isLength({ min: 3, max: 200 }).trim().withMessage("Lenght 3-200"),

    async function (req, res) {

        if (!userValid(0, "admin")) return res.status(403).json("Access forbidden")

        try {
            const { owner_id, okupa_id, user_id, type, description, created, calle, numero, piso, puerta,
                codigo_postal, nucleo, poblacion, municipio, provincia, comunidad } = req.body

            //Validation
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ message: 'JSON invalid', errors: errors.array() });
            }

            let property = await Property.create({
                owner_id, okupa_id, user_id, type, description, created, calle, numero, piso, puerta,
                codigo_postal, nucleo, poblacion, municipio, provincia, comunidad
            }, {
                fields: ['owner_id', 'okupa_id', 'user_id', 'type', 'description', 'created', 'calle', 'numero', 'piso',
                    'puerta', 'codigo_postal', 'nucleo', 'poblacion', 'municipio', 'provincia', 'comunidad']
            }
            )
            if (property) {
                return res.status(201).json({
                    message: 'Property created successfully',
                    data: property
                })
            }
        }
        catch (e) {
            console.log(e)
            return res.status(500).json({
                message: 'Something went wrong',
                data: {}
            })
        }
    }
]
export async function getProperty(req, res) {
    try {
        if (!userValid(0, "user")) return res.status(403).json("Access forbidden")

        const property = await Property.findOne(
            {
                include: [User, Owner, Okupa],
                where: {
                    property_id: req.params.property_id
                }
            })
        return res.status(200).json(property)
    }
    catch (e) {
        console.log(e)
        return res.status(500).json({
            message: 'Something went wrong',
            data: {}
        })
    }
}
export async function deleteProperty(req, res) {
    try {
        if (!userValid(0, "admin")) return res.status(403).json("Access forbidden")

        const deleteRowCount = await Property.destroy({
            where: {
                property_id: req.params.property_id
            }
        })
        return res.status(204).json({
            message: 'Property deleted successfully',
            count: deleteRowCount
        })
    } catch (e) {
        console.log(e)
        return res.status(500).json({
            message: 'Something went wrong',
            data: {}
        })
    }
}
export async function updateProperty(req, res) {
    try {
        const { owner_id, okupa_id, user_id, type, description, created, calle, numero, piso, puerta,
            codigo_postal, nucleo, poblacion, municipio, provincia, comunidad } = req.body
        if (!userValid(0, "admin")) return res.status(403).json("Access forbidden")

        const property = await Property.findOne({
            where: {
                property_id: req.params.property_id
            }
        })

        if (property === null) {
            return res.status(404).json({
                message: "Cannot find property"
            })
        }
        property.update({
            owner_id, okupa_id, user_id, type, description, created, calle, numero, piso,
            puerta, codigo_postal, nucleo, poblacion, municipio, provincia, comunidad
        })
        return res.status(204).json({
            message: 'Property updated successfully',
            data: property
        })

    } catch (e) {
        console.log(e)
        return res.status(500).json({
            message: 'Something went wrong',
            data: {}
        })
    }
}