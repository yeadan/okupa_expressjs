import Sequelize from 'sequelize'
import { sequelize } from '../data/database'
import User from './Users'
import Okupa from './Okupas'

const UserOkupa = sequelize.define('user_okupas', {
    userokupa_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        type: Sequelize.INTEGER,
        references: {
            model: 'users',
            key: 'user_id'
        }
    },
    okupa_id: {
        type: Sequelize.INTEGER,
        references: {
            model: 'okupas',
            key: 'okupa_id'
        }
    },
    created: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
    }
}, {
    timestamps: false
}
)
UserOkupa.belongsTo(User, { foreignKey: 'user_id' })
UserOkupa.belongsTo(Okupa, { foreignKey: 'okupa_id' })
User.hasMany(UserOkupa, { foreignKey: 'user_id' })
Okupa.hasMany(UserOkupa, { foreignKey: 'okupa_id' })

export default UserOkupa