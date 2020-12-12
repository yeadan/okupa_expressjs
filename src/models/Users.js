import Sequelize from 'sequelize'
import { sequelize } from '../data/database'

const User = sequelize.define('users', {
    user_id: {
        type: Sequelize.INTEGER,
        primaryKey: true, 
        autoIncrement: true
    },
    username: {
        type: Sequelize.TEXT
    },
    password: {
        type: Sequelize.TEXT
    },
    role: {
        type: Sequelize.TEXT
    },
    full_name: {
        type: Sequelize.TEXT
    },
    avatar: {
        type: Sequelize.TEXT
    },
    registered: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
    }
}, {
    timestamps: false
}
)

export default User