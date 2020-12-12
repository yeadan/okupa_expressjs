import { userValid } from '../lib/security'
import UserOkupa from '../models/UserOkupa'
import User from '../models/Users'
import Okupa from '../models/Okupas'

export async function createUserOkupa(req, res) {
  const { user_id } = req.params

  try {
    if (!userValid(user_id, "admin")) return res.status(403).json("Access forbidden")

    const user = await User.findOne({
      where: {
        user_id: req.params.user_id
      }
    })
    const okupa = await Okupa.findOne({
      where: {
        okupa_id: req.params.okupa_id
      }
    })
    if (user == null || okupa == null)
      return res.status(404).json("Not Found")

    if (await existUserOkupa(user_id, req.params.okupa_id) != null)
      return res.status(400).json("Already exists")

    let userOkupa = await UserOkupa.create({
      user_id,
      okupa_id: req.params.okupa_id,
      created: req.body.created
    }, { fields: ['user_id', 'okupa_id', 'created'] }
    )
    if (userOkupa) {
      return res.status(201).json({
        message: 'User/Okupa created successfully',
        data: userOkupa
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
export async function existUserOkupa(user_id, okupa_id) {
  try {
    const userOkupa = await UserOkupa.findOne({
      where: {
        user_id,
        okupa_id
      }
    })
    return userOkupa
  }
  catch (e) {
    console.log(e)
    res.status(500).json({
      message: 'Something went wrong',
      data: {}
    })
  }
}
export async function deleteUserOkupa(req, res) {
  try {
    const { user_id } = req.params
    if (!userValid(user_id, "admin")) return res.status(403).json("Access forbidden")

    const user = await User.findOne({
      where: {
        user_id: req.params.user_id
      }
    })
    const okupa = await Okupa.findOne({
      where: {
        okupa_id: req.params.okupa_id
      }
    })
    if (user == null || okupa == null)
      return res.status(404).json("Not Found")

    var userOkupa = await existUserOkupa(user_id, req.params.okupa_id)

    if (userOkupa == null)
      return res.status(404).json("Not Found")

    const userokupa_id = userOkupa.userokupa_id

    const deleteRowCount = await UserOkupa.destroy({
      where: {
        userokupa_id
      }
    })
    return res.status(204).json({
      message: 'User deleted successfully',
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

//Get users from one okupa
export async function getUserOkupa(req, res) {
  try {
    if (!userValid(0, "user")) return res.status(403).json("Access forbidden")

    const okupa = await Okupa.findOne({
      where: {
        okupa_id: req.params.okupa_id
      }
    })
    if (okupa == null)
      return res.status(404).json("Not Found")

    var userOkupa = await UserOkupa.findAll({
      where: {
        okupa_id: req.params.okupa_id
      },
      include: [User]
    })
    //Only "user" field wanted
    const result = userOkupa.map(({ user }) => (user));
    return res.status(200).json(result)
  }
  catch (e) {
    console.log(e)
    res.status(500).json({
      message: 'Something went wrong',
      data: {}
    })
  }
}
