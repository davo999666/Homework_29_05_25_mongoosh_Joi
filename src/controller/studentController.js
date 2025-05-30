import * as service from '../services/studentService.js'
import {
    findByNameSchema,
    findStudentSchema,
    scoreSchema,
    studentSchema,
    updateStudentSchema
} from "../validator/studentValidator.js";

export const addStudent = async (req, res) => {
    const {error} = studentSchema.validate(req.body);
    if (error) {
        return res.status(400).json({error: error.details[0].message});
    }
    const success = await service.addStudent(req.body);
    res.sendStatus(success ? 201 : 409);
}

export const findStudent = async (req, res) => {
    const {error} = findStudentSchema.validate({ _id: +req.params.id });
    if(error){
        return res.status(400).json({error: error.details[0].message});
    }
    const success = await service.findStudent(+req.params.id);
    res.json(success ? success : 409);
}

export const updateStudent = async (req, res) => {
    const {error} = updateStudentSchema.validate(req.body);
    if (error) {
        return res.status(400).json({error: error.details[0].message});
    }
    const student = await service.updateStudent(+req.params.id, req.body);
    res.json(student ? student : 409);

}

export const deleteStudent = async (req, res) => {
    const {error} = findStudentSchema.validate({ _id: +req.params.id});
    if(error){
        return res.status(400).json({error: error.details[0].message});
    }
    const success = await service.deleteStudent(+req.params.id);
    res.json(success ? success : 409);
}

export const addScore = async (req, res) => {
    const {error} = scoreSchema.validate(req.body);
    if (error) {
        return res.status(400).json({error: error.details[0].message});
    }
    const success = await service.addScore(+req.params.id, req.body.examName, +req.body.score);
    res.sendStatus(success ? 204 : 409);
}

export const findByName = async (req, res) => {
    const {error} = findByNameSchema.validate(req.params.name);
    if(!error){
        return false
    }
    const success = await service.findByName(req.params.name);
    res.json(success ? success : 409);
}




export const countByNames = async (req, res) => {
    const {error} = findByNameSchema.validate(req.query.names);
    if(!error){
        return false
    }
    const success = await service.countByNames(req.query.names);
    res.json(success ? success : 409)
}

export const findByMinScore = async (req, res) => {
    const {error} = scoreSchema.validate(req.params.exam, +req.params.minScore)
    if(!error){
        return false
    }
    const success = await service.findByMinScore(req.params.exam, req.params.minScore);
    res.json(success ? success : 410)
}