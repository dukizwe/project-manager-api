const TABLES = require("../constants/TABLES")
const { query } = require("../utils/db")
const md5 = require('md5')

const create = async (tableName, data) => {
          try {
                    if(tableName == TABLES.collaborateurs) {
                              if(data.MOT_DE_PASSE) {
                                        data.MOT_DE_PASSE = md5(data.MOT_DE_PASSE)
                              } else {
                                        data.MOT_DE_PASSE = md5("12345678")
                              }
                    }
                    return await query(`INSERT INTO ${tableName} SET ?`, [data])
          } catch (error) {
                    throw error
          }
}

const update = async (tableName, data, conditions) => {
          try {
                    var sqlQuery = `UPDATE ${tableName} SET ? WHERE 1 `
                    var binds = [data]
                    for(let key in conditions) {
                              sqlQuery += ` AND ${key} = ? `
                              binds.push(conditions[key])
                    }
                    return await query(sqlQuery, binds)
          } catch (error) {
                    throw error
          }
}

const findAll = async (tableName, conditions) => {
          try {
                    var sqlQuery = 'SELECT *'
                    if(tableName == TABLES.equipes) {
                              sqlQuery += " , cr.NOM, cr.PRENOM, cra.NOM NOM_RES_ADJOINT, cra.PRENOM PRENOM_RES_ADJOINT, equipes.ID_EQUIPE "
                    }
                    sqlQuery +=  ` FROM ${tableName} `
                    if(tableName == TABLES.collaborateurs) {
                              sqlQuery += " LEFT JOIN equipes ON equipes.ID_EQUIPE = collaborateurs.ID_EQUIPE LEFT JOIN postes ON postes.ID_POSTE = collaborateurs.ID_POSTE  "
                    }
                    if(tableName == TABLES.equipes) {
                              sqlQuery += " LEFT JOIN collaborateurs cr ON cr.ID_COLLABORATEUR = equipes.ID_RESPONSABLE LEFT JOIN collaborateurs cra ON cra.ID_COLLABORATEUR = equipes.ID_RESPONSABLE_ADJOINT "
                    }
                    if(tableName == TABLES.taches) {
                              sqlQuery += " LEFT JOIN projets p ON p.ID_PROJET = taches.ID_PROJET LEFT JOIN collaborateurs c ON c.ID_COLLABORATEUR = taches.ID_COLLABORATEUR "
                    }
                    sqlQuery += " WHERE 1 "
                    var binds = []
                    if(conditions) {
                              for(let key in conditions) {
                                        sqlQuery += ` AND ${tableName}.${key} = ? `
                                        binds.push(conditions[key])
                              }
                    }
                    sqlQuery += ` ORDER BY ${tableName}.DATE_INSERTION DESC `
                    return query(sqlQuery, binds)
          } catch (error) {
                    throw error
          }
}

const destroy = async (tableName, conditions) => {
          try {
                    var sqlQuery = `DELETE FROM ${tableName} WHERE 1`
                    var binds = []
                    if(conditions) {
                              for(let key in conditions) {
                                        sqlQuery += ` AND ${key} = ? `
                                        binds.push(conditions[key])
                              }
                    }
                    return await query(sqlQuery, binds)
          } catch (error) {
                    throw error
          }
}
module.exports = {
          create,
          update,
          findAll,
          destroy
}