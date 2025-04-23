const Joi = require('joi');

const validateEvent = (event) => {
    const schema = Joi.object({
        title: Joi.string().required().min(3).max(255),
        description: Joi.string().required().min(10),
        discipline_id: Joi.number().integer().required(),
        start_date: Joi.date().required(),
        end_date: Joi.date().required().greater(Joi.ref('start_date')), // end_date должна быть позже start_date
        format: Joi.string().valid('open', 'regional', 'federal').required(),
        organizer_id: Joi.number().integer().required(),
        region_id: Joi.number().integer().allow(null), // Может быть null для открытых соревнований
        max_participants: Joi.number().integer().positive(),
    });

    return schema.validate(event);
};

const validateUser = (user) => {
    const schema = Joi.object({
        role: Joi.string().valid('admin', 'regional_representative', 'athlete').required(),
        name: Joi.string().required().min(2).max(255),
        region_id: Joi.number().integer().allow(null),
        email: Joi.string().email().required(),
        password: Joi.string().required().min(6), //  В реальном приложении пароль нужно хешировать!
    });

    return schema.validate(user);
};

const validateApplication = (application) => {
    const schema = Joi.object({
        event_id: Joi.number().integer().required(),
        team_id: Joi.number().integer().allow(null), //  Может быть null, если индивидуальная заявка
        user_id: Joi.number().integer().required(), //  ID подающего заявку (спортсмена или капитана)
        status: Joi.string().valid('pending', 'approved', 'rejected').required(),
    });

    return schema.validate(application);
};

const validateTeam = (team) => {
    const schema = Joi.object({
        name: Joi.string().required().min(2).max(255),
        captain_id: Joi.number().integer().required(),
        event_id: Joi.number().integer().required(),
        description: Joi.string().allow(null).max(1000),
    });

    return schema.validate(team);
};


//  Добавьте другие функции валидации для User, Application и т.д.

module.exports = {
    validateEvent,
    validateUser,
    validateApplication,
    validateTeam,
    //  ... другие функции
};