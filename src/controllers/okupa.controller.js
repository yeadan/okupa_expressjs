import Okupa from '../models/Okupas'
import { userValid } from '../lib/security'
const { check, validationResult } = require('express-validator')

export async function getOkupas(req, res) {
    try {
        if (!userValid(0, "user")) return res.status(403).json("Access forbidden")
        const okupa = await Okupa.findAll()
        return res.status(200).json(okupa)
    }
    catch (e) {
        console.log(e)
        return res.status(500).json({
            message: 'Something went wrong',
            data: {}
        })
    }
}
exports.createOkupa = [ //Validation
    check('name').isLength({ min: 3, max: 30 }).trim().withMessage("Lenght 3-30")
        .matches(/^[A-Za-z0-9\s]+$/).trim().withMessage('Must be alphanumeric'),
    check('description').isLength({ min: 3, max: 200 }).trim().withMessage("Lenght 3-200"),
    check('created').isISO8601().trim().withMessage("Must be a valid ISO8601 datetime"),

    async function (req, res) {
        try {
            //Validation
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ message: 'JSON invalid', errors: errors.array() });
            }
            const { name } = req.body
            if (!userValid(0, "admin")) return res.status(403).json("Access forbidden")

            if (!name) {
                return res.status(400).json({
                    message: 'Data missing',
                    data: {}
                })
            }
            let okupa = await Okupa.create({
                name,
                description: req.body.description,
                created: req.body.created
            }, { fields: ['name', 'description', 'created'] }
            )
            if (okupa) {
                return res.status(201).json({
                    message: 'Okupa created successfully',
                    data: okupa
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
    }]
export async function getOkupa(req, res) {
    try {
        if (!userValid(0, "user")) return res.status(403).json("Access forbidden")

        const okupa = await Okupa.findOne({
            where: {
                okupa_id: req.params.okupa_id
            }
        })
        return res.status(200).json(okupa)
    }
    catch (e) {
        console.log(e)
        return res.status(500).json({
            message: 'Something went wrong',
            data: {}
        })
    }
}
export async function deleteOkupa(req, res) {
    try {
        if (!userValid(0, "admin")) return res.status(403).json("Access forbidden")

        const deleteRowCount = await Okupa.destroy({
            where: {
                okupa_id: req.params.okupa_id
            }
        })
        res.status(204).json({
            message: 'Okupa deleted successfully',
            count: deleteRowCount
        })
    } catch (e) {
        console.log(e)
        res.status(500).json({
            message: 'Something went wrong',
            data: {}
        })
    }
}
exports.updateOkupa = [ //Validation
    check('name').isLength({ min: 3, max: 30 }).trim().withMessage("Lenght 3-30")
        .matches(/^[A-Za-z0-9\s]+$/).trim().withMessage('Must be alphanumeric'),
    check('description').isLength({ min: 3, max: 200 }).trim().withMessage("Lenght 3-200").optional(),
    check('okupa_id').isInt().withMessage('Must be an integer'),
    async function (req, res) {
        try {
            if (!userValid(0, "admin")) return res.status(403).json("Access forbidden")

            //Validation
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ message: 'JSON invalid', errors: errors.array() });
            }

            const { name } = req.body

            const okupa = await Okupa.findOne({
                where: {
                    okupa_id: req.params.okupa_id
                }
            })

            if (okupa === null) {
                return res.status(404).json({
                    message: "Cannot find okupa"
                })
            }
            okupa.update({
                name,
                description: req.body.description,
            })
            return res.status(204).json({
                message: 'Okupa updated successfully',
                data: okupa
            })
        } catch (e) {
            console.log(e)
            return res.status(500).json({
                message: 'Something went wrong',
                data: {}
            })
        }
    }]