import Sequelize from 'sequelize'
import { sequelize } from '../data/database'
import User from './Users'
import Okupa from './Okupas'
import Owner from './Owners'

const Property = sequelize.define('properties', {
  property_id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  owner_id: {
    type: Sequelize.INTEGER,
    references: {
      model: 'owners',
      key: 'owner_id'
    }
  },
  okupa_id: {
    type: Sequelize.INTEGER,
    references: {
      model: 'okupas',
      key: 'okupa_id'
    }
  },
  user_id: {
    type: Sequelize.INTEGER,
    references: {
      model: 'users',
      key: 'user_id'
    }
  },
  type: {
    type: Sequelize.TEXT
  },
  description: {
    type: Sequelize.TEXT
  },
  created: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.NOW
  },
  // Address
  calle: {
    type: Sequelize.TEXT
  },
  numero: {
    type: Sequelize.INTEGER
  },
  piso: {
    type: Sequelize.INTEGER
  },
  puerta: {
    type: Sequelize.TEXT
  },
  codigo_postal: {
    type: Sequelize.TEXT
  },
  nucleo: {
    type: Sequelize.TEXT
  },
  poblacion: {
    type: Sequelize.TEXT
  },
  municipio: {
    type: Sequelize.TEXT
  },
  provincia: {
    type: Sequelize.TEXT
  },
  comunidad: {
    type: Sequelize.TEXT
  },
}, {
  timestamps: false
}
)
Property.belongsTo(User,{foreignKey : 'user_id'})
Property.belongsTo(Okupa,{foreignKey : 'okupa_id'})
Property.belongsTo(Owner,{foreignKey : 'owner_id'})
User.hasMany(Property,{foreignKey : 'user_id'})
Okupa.hasMany(Property,{foreignKey : 'okupa_id'})
Owner.hasMany(Property,{foreignKey : 'owner_id'})

export default Property