const RESPONSE_CODES = require("../constants/RESPONSE_CODES")
const RESPONSE_STATUS = require("../constants/RESPONSE_STATUS")
const { query } = require("../utils/db")

const findAll = async (req, res) => {
          try {
                    const taches = await query("SELECT * FROM taches")
                    res.status(RESPONSE_CODES.OK).json({
                              statusCode: RESPONSE_CODES.OK,
                              httpStatus: RESPONSE_STATUS.OK,
                              message: "Liste des taches",
                              result: taches
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

const createTache = async (req, res) => {
          try {
                    const { ID_PROJET, ID_COLLABORATEUR, NOM_TACHE, DESCRIPTION_TACHE, DEBUT_TACHE, FIN_TACHE } = req.body
                    const { insertId } = await query("INSERT INTO taches(ID_PROJET, ID_COLLABORATEUR, NOM_TACHE, DESCRIPTION_TACHE, DEBUT_TACHE, FIN_TACHE) VALUES(?, ?, ?, ?, ?, ?)", [
                              ID_PROJET, ID_COLLABORATEUR, NOM_TACHE, DESCRIPTION_TACHE, DEBUT_TACHE, FIN_TACHE
                    ])
                    res.status(RESPONSE_CODES.CREATED).json({
                              statusCode: RESPONSE_CODES.CREATED,
                              httpStatus: RESPONSE_STATUS.CREATED,
                              message: "Tache cree avec succes",
                              result: {
                                        ID_TACHE: insertId
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

module.exports = {
          findAll,
          createTache
}