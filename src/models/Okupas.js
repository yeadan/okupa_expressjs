import Sequelize from 'sequelize'
import { sequelize } from '../data/database'

const Okupa = sequelize.define('okupas', {
    okupa_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: Sequelize.TEXT
    },
    description: {
        type: Sequelize.TEXT
    },
    created: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
    }
}, {
    timestamps: false
    }
)

export default Okupa