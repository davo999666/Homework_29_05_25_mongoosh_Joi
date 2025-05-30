import Joi from "joi";

export const studentSchema = Joi.object({
    id: Joi.number().required(),
    name: Joi.string().required(),
    password: Joi.string().required()
})
export const findStudentSchema = Joi.object({
    _id: Joi.number().required(),
})

export const updateStudentSchema = Joi.object({
    name: Joi.string(),
    password: Joi.string()
})

export const scoreSchema = Joi.object({
    examName: Joi.string().required(),
    score: Joi.number().min(0).max(100).required()
})


export const findByNameSchema = Joi.object({
    names: Joi.alternatives().try(
        Joi.string().min(2).required(),
        Joi.array().items(Joi.string().min(2))
    ).required()
});