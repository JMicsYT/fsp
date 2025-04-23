const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); //  Путь к вашему экземпляру Sequelize

const Achievement = sequelize.define('Achievement', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users', //  Название таблицы users
            key: 'id',
        },
    },
    event_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'events', //  Название таблицы events
            key: 'id',
        },
    },
    achievement_type: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
    },
    createdAt: {
        type: DataTypes.DATE,
    },
    updatedAt: {
        type: DataTypes.DATE,
    },
}, {
    tableName: 'achievements', //  Укажите имя таблицы
});

//  Определение ассоциаций (если необходимо)
Achievement.belongsTo(sequelize.models.User, { foreignKey: 'user_id', as: 'user' });
Achievement.belongsTo(sequelize.models.Event, { foreignKey: 'event_id', as: 'event' });

module.exports = Achievement;