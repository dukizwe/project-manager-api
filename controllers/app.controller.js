const RESPONSE_CODES = require("../constants/RESPONSE_CODES")
const RESPONSE_STATUS = require("../constants/RESPONSE_STATUS")
const TABLES = require("../constants/TABLES")
const { findAll, create, update, findBy, destroy } = require("../models/model")
const { query } = require("../utils/db")


const createData = async (req, res, next, nameSpace) => {
          try {
                    const { insertId } = await create(nameSpace, req.body)
                    res.status(RESPONSE_CODES.CREATED).json({
                              statusCode: RESPONSE_CODES.CREATED,
                              httpStatus: RESPONSE_STATUS.CREATED,
                              result: {
                                        insertId
                              }
                    })
          } catch (error) {
                    console.log(error)
                    res.status(RESPONSE_CODES.INTERNAL_SERVER_ERROR).json({
                              statusCode: RESPONSE_CODES.INTERNAL_SERVER_ERROR,
                              httpStatus: RESPONSE_STATUS.INTERNAL_SERVER_ERROR,
                              message: "Erreur interne du serveur, réessayer plus tard",
                    })
          }
}
const updateData = async (req, res, next, nameSpace) => {
          try {
                    const { insertId } = await update(nameSpace, req.body, req.query)
                    res.status(RESPONSE_CODES.OK).json({
                              statusCode: RESPONSE_CODES.OK,
                              httpStatus: RESPONSE_STATUS.OK,
                              result: {
                                        insertId
                              }
                    })
          } catch (error) {
                    console.log(error)
                    res.status(RESPONSE_CODES.INTERNAL_SERVER_ERROR).json({
                              statusCode: RESPONSE_CODES.INTERNAL_SERVER_ERROR,
                              httpStatus: RESPONSE_STATUS.INTERNAL_SERVER_ERROR,
                              message: "Erreur interne du serveur, réessayer plus tard",
                    })
          }
}

const list = async (req, res, next, nameSpace) => {
          try {
                    var data = await findAll(nameSpace, req.query)
                    if(nameSpace == TABLES.projets) {
                              var sqlQuery = `
                              SELECT p.ID_PROJET, t.PROGRESSION
                              FROM taches t
                                        LEFT JOIN projets p ON p.ID_PROJET = t.ID_PROJET
                              WHERE p.ID_PROJET = ?
                              `
                              if(data.length > 0) {
                                        data = await Promise.all(data.map(async projet => {
                                                  var total = 0
                                                  const progressions = await query(sqlQuery, [projet.ID_PROJET])
                                                  if(projet.ID_PROJET == 3) {
                                                            console.log(progressions)
                                                  }
                                                  progressions.forEach(progression => {
                                                            total += progression.PROGRESSION
                                                  })
                                                  const PROGRESSION_GROBALE = total / progressions.length
                                                  return {
                                                            ...projet,
                                                            PROGRESSION_GROBALE
                                                  }
                                        }))
                              }
                    }
                    res.status(RESPONSE_CODES.OK).json({
                              statusCode: RESPONSE_CODES.OK,
                              httpStatus: RESPONSE_STATUS.OK,
                              result: data
                    })
          } catch (error) {
                    console.log(error)
                    res.status(RESPONSE_CODES.INTERNAL_SERVER_ERROR).json({
                              statusCode: RESPONSE_CODES.INTERNAL_SERVER_ERROR,
                              httpStatus: RESPONSE_STATUS.INTERNAL_SERVER_ERROR,
                              message: "Erreur interne du serveur, réessayer plus tard",
                    })
          }
}
const deleteData = async (req, res, next, nameSpace) => {
          try {
                    await destroy(nameSpace, req.query)
                    res.status(RESPONSE_CODES.OK).json({
                              statusCode: RESPONSE_CODES.OK,
                              httpStatus: RESPONSE_STATUS.OK,
                              message: "Les colonne ont ete supprimes avec success"
                    })
          } catch (error) {
                    console.log(error)
                    res.status(RESPONSE_CODES.INTERNAL_SERVER_ERROR).json({
                              statusCode: RESPONSE_CODES.INTERNAL_SERVER_ERROR,
                              httpStatus: RESPONSE_STATUS.INTERNAL_SERVER_ERROR,
                              message: "Erreur interne du serveur, réessayer plus tard",
                    })
          }
}

module.exports  = {
          list,
          createData,
          updateData,
          deleteData
}