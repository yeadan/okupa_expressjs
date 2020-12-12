import Owner from '../models/Owners'
import { userValid } from '../lib/security'
const { check, validationResult } = require('express-validator')


export async function getOwners(req, res) {
    try {
        if (!userValid(0, "user")) return res.status(403).json("Access forbidden")
        const owner = await Owner.findAll()
        res.status(200).json(owner)
    }
    catch (e) {
        console.log(e)
        return res.status(500).json({
            message: 'Something wents wrong',
            data: {}
        })
    }
}

exports.createOwner = [ //Validation
    check('name').isLength({ min: 3, max: 30 }).trim().withMessage("Lenght 3-30")
        .matches(/^[A-Za-z0-9\s]+$/).trim().withMessage('Must be alphanumeric'),
    check('description').isLength({ min: 3, max: 200 }).trim().withMessage("Lenght 3-200"),
    check('created').isISO8601().trim().withMessage("Must be a valid ISO8601 datetime"),
    check("type_owner").isLength({ min: 2, max: 20 }).trim().withMessage("Lenght 2-20")
        .matches(/^[A-Za-z0-9\s]+$/).trim().withMessage('Must be alphanumeric'),

    async function (req, res) {

        try {
            const { name, type_owner } = req.body

            if (!userValid(0, "admin")) return res.status(403).json("Access forbidden")

            //Validation
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ message: 'JSON invalid', errors: errors.array() });
            }

            let owner = await Owner.create({
                name,
                type_owner,
                description: req.body.description,
                created: req.body.created
            }, { fields: ['name', 'type_owner', 'description', 'created'] }
            )
            if (owner) {
                return res.status(201).json({
                    message: 'Owner created successfully',
                    data: owner
                })
            }
        }
        catch (e) {
            console.log(e)
            return res.status(500).json({
                message: 'Something wents wrong',
                data: {}
            })
        }
    }]
export async function getOwner(req, res) {
    try {
        if (!userValid(0, "user")) return res.status(403).json("Access forbidden")

        const owner = await Owner.findOne({
            where: {
                owner_id: req.params.owner_id
            }
        })
        return res.status(200).json(owner)
    }
    catch (e) {
        console.log(e)
        return res.status(500).json({
            message: 'Something went wrong',
            data: {}
        })
    }
}
export async function deleteOwner(req, res) {
    try {
        if (!userValid(0, "admin")) return res.status(403).json("Access forbidden")

        const deleteRowCount = await Owner.destroy({
            where: {
                owner_id: req.params.owner_id
            }
        })
        return res.status(204).json({
            message: 'Owner deleted successfully',
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
exports.updateOwner = [
    check('name').isLength({ min: 3, max: 30 }).trim().withMessage("Lenght 3-30")
        .matches(/^[A-Za-z0-9\s]+$/).trim().withMessage('Must be alphanumeric'),
    check('description').isLength({ min: 3, max: 200 }).trim().withMessage("Lenght 3-200"),
    check('owner_id').isInt().withMessage('Must be an integer'),
    check("type_owner").isLength({ min: 2, max: 20 }).trim().withMessage("Lenght 2-20")
        .matches(/^[A-Za-z0-9\s]+$/).trim().withMessage('Must be alphanumeric'),

    async function (req, res) {
        try {
            if (!userValid(0, "admin")) return res.status(403).json("Access forbidden")

            //Validation
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ message: 'JSON invalid', errors: errors.array() });
            }

            const { owner_id } = req.params
            const { name, type_owner } = req.body

            const owner = await Owner.findOne({
                where: {
                    owner_id
                }
            })

            if (owner === null) {
                return res.json({
                    message: "Cannot find owner"
                })
            }
            owner.update({
                name,
                type_owner,
                description: req.body.description
            })
            return res.status(204).json({
                message: 'Owner updated successfully',
                data: owner
            })

        } catch (e) {
            console.log(e)
            return res.status(500).json({
                message: 'Something went wrong',
                data: {}
            })
        }
    }]