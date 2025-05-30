import * as repo from '../repository/studentRepository.js'
import {findStudentsByName} from "../repository/studentRepository.js";

export const addStudent = async ({id, name, password}) => {
    const existing = await repo.findStudentById(id);
    if (existing) {
        return false;
    }
    await repo.createStudent({_id: id, name, password});
    return true;
}

export const findStudent = async (id) => {
    const existing = await repo.findStudentById(id);
    if (!existing) {
        return false;
    }
    return existing.toObject();

}
export const updateStudent = async (id, data) => {
    const existing = await repo.findStudentById(id);
    if (!existing) {
        return false
    }
    const updated = await repo.updateStudent(id, data);
    updated.scores = undefined
    return updated.toObject();

}

export const deleteStudent = async (id) => {
    const success = await repo.deleteStudentById(id);
    if (!success) {
        return false;
    }
    return success.toObject();
}


export const addScore = async (id, exam, score) => {
    const success = await repo.updateStudentScore(id, exam, score);
    if (!success) {
        return false;
    }
    return success.toObject();
}

export const findByName = async (name) => {
    const success = await repo.findStudentsByName(name)
    if(!success) {
        return false;
    }
    return success.map(student => {
        return student.toObject();
    });
}

export const countByNames = async (names) => {
    const namesArr = Array.isArray(names) ? names : [names]
    const success = await repo.countStudentsByNames(namesArr);
    if(!success){
        return false
    }
    return success.toObject();
}

export const findByMinScore = async (exam, minScore) => {
    const success = await repo.findStudentsByMinScore(exam, minScore);
    if(!success){
        return false;
    }
    return success.toObject();
}
