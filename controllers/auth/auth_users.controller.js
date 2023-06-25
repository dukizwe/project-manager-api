const express = require('express');
const UserUpload = require('../../class/uploads/UserUpload');
const Validation = require('../../class/Validation');
const RESPONSE_CODES = require('../../constants/RESPONSE_CODES')
const RESPONSE_STATUS = require('../../constants/RESPONSE_STATUS');
const users_model = require('../../models/app/users.model');
const { query } = require('../../utils/db');
const generateToken = require('../../utils/generateToken');
const md5 = require('md5')

const login = async (req, res) => {
          try {
                    const { email, password, PUSH_NOTIFICATION_TOKEN, DEVICE } = req.body;
                    const validation = new Validation(
                              req.body,
                              {
                                        email: {
                                                  required: true,
                                                  email: true
                                        },
                                        password:
                                        {
                                                  required: true,
                                        },
                              }, {
                              password: {
                                        required: "Mot de passe est obligatoire",
                              },
                              email: {
                                        required: "L'email est obligatoire",
                                        email: "Email invalide"
                              }
                    }
                    );

                    await validation.run();
                    const isValid = await validation.isValidate()
                    const errors = await validation.getErrors()
                    if (!isValid) {
                              return res.status(RESPONSE_CODES.UNPROCESSABLE_ENTITY).json({
                                        statusCode: RESPONSE_CODES.UNPROCESSABLE_ENTITY,
                                        httpStatus: RESPONSE_STATUS.UNPROCESSABLE_ENTITY,
                                        message: "Probleme de validation des donnees",
                                        result: errors
                              })
                    }
                    var user = (await query("SELECT * FROM collaborateurs c LEFT JOIN postes p ON p.ID_POSTE = c.ID_POSTE WHERE EMAIL = ?", [email]))[0];
                    console.log({ user })
                    if (user) {
                              if (user.MOT_DE_PASSE == md5(password)) {
                                        const token = generateToken({ user: user.ID_COLLABORATEUR  }, 3 * 12 * 30 * 24 * 3600)
                                        const { MOT_DE_PASSE, ...other } = user
                                        res.status(RESPONSE_CODES.CREATED).json({
                                                  statusCode: RESPONSE_CODES.CREATED,
                                                  httpStatus: RESPONSE_STATUS.CREATED,
                                                  message: "Vous êtes connecté avec succès",
                                                  result: {
                                                            ...other,
                                                            token
                                                  }
                                        })
                              } else {
                                        validation.setError('main', 'Identifiants incorrects')
                                        const errors = await validation.getErrors()
                                        res.status(RESPONSE_CODES.NOT_FOUND).json({
                                                  statusCode: RESPONSE_CODES.NOT_FOUND,
                                                  httpStatus: RESPONSE_STATUS.NOT_FOUND,
                                                  message: "Utilisateur n'existe pas",
                                                  result: errors
                                        })
                              }
                    } else {
                              validation.setError('main', 'Identifiants incorrects')
                              const errors = await validation.getErrors()
                              res.status(RESPONSE_CODES.NOT_FOUND).json({
                                        statusCode: RESPONSE_CODES.NOT_FOUND,
                                        httpStatus: RESPONSE_STATUS.NOT_FOUND,
                                        message: "Utilisateur n'existe pas",
                                        result: errors
                              })
                    }
          } catch (error) {
                    console.log(error)
                    res.status(RESPONSE_CODES.INTERNAL_SERVER_ERROR).json({
                              statusCode: RESPONSE_CODES.INTERNAL_SERVER_ERROR,
                              httpStatus: RESPONSE_STATUS.INTERNAL_SERVER_ERROR,
                              message: "Erreur interne du serveur, réessayer plus tard",
                    })
          }
}

const createUser = async (req, res) => {
          try {
                    const { NOM, PRENOM, EMAIL, TELEPHONE, PASSWORD: password, PUSH_NOTIFICATION_TOKEN, DEVICE, ID_POSTE, ID_EQUIPE } = req.body
                    const { IMAGE } = req.files || {}
                    const validation = new Validation({ ...req.body, ...req.files },
                              {
                                        IMAGE: {
                                                  image: 21000000
                                        },
                                        NOM:
                                        {
                                                  required: true,
                                        },
                                        PRENOM:
                                        {
                                                  required: true,
                                        },
                                        EMAIL:
                                        {
                                                  required: true,
                                                  email: true,
                                                  unique: "collaborateurs,EMAIL"
                                        },
                                        PASSWORD:
                                        {
                                                  required: true,
                                        },
                              },
                              {
                                        IMAGE: {
                                                  IMAGE: "La taille invalide"
                                        },
                                        NOM: {
                                                  required: "Le nom est obligatoire"
                                        },
                                        PRENOM: {
                                                  required: "Le prenom est obligatoire"
                                        },
                                        EMAIL: {
                                                  required: "L'email est obligatoire",
                                                  email: "Email invalide",
                                                  unique: "Email déjà utilisé"
                                        },
                                        PASSEWORD: {
                                                  required: "Le mot de passe est obligatoire"
                                        },
                              }
                    )
                    await validation.run();
                    const isValide = await validation.isValidate()
                    const errors = await validation.getErrors()
                    if (!isValide) {
                              return res.status(RESPONSE_CODES.UNPROCESSABLE_ENTITY).json({
                                        statusCode: RESPONSE_CODES.UNPROCESSABLE_ENTITY,
                                        httpStatus: RESPONSE_STATUS.UNPROCESSABLE_ENTITY,
                                        message: "Probleme de validation des donnees",
                                        result: errors
                              })
                    }
                    const userUpload = new UserUpload()
                    var filename
                    if (IMAGE) {
                              const { fileInfo } = await userUpload.upload(IMAGE, false)
                              filename = fileInfo.fileName
                    }
                    const { insertId } = await query("INSERT INTO collaborateurs(ID_POSTE, ID_EQUIPE,  NOM, PRENOM, EMAIL, TELEPHONE, MOT_DE_PASSE) VALUES(?, ?, ?, ?, ?, ?, ?)", [
                              ID_POSTE, ID_EQUIPE, NOM, PRENOM, EMAIL, TELEPHONE, md5(password)
                    ])
                    const token = generateToken({ user: insertId  }, 3 * 12 * 30 * 24 * 3600)
                    res.status(RESPONSE_CODES.CREATED).json({
                              statusCode: RESPONSE_CODES.CREATED,
                              httpStatus: RESPONSE_STATUS.CREATED,
                              message: "Enregistrement est fait avec succès",
                              result: {
                                        ID_COLLABORATEUR : insertId,
                                        ID_POSTE,
                                        ID_EQUIPE,
                                        NOM,
                                        PRENOM,
                                        EMAIL,
                                        token
                              }
                    })
          }
          catch (error) {
                    console.log(error)
                    res.status(RESPONSE_CODES.INTERNAL_SERVER_ERROR).json({
                              statusCode: RESPONSE_CODES.INTERNAL_SERVER_ERROR,
                              httpStatus: RESPONSE_STATUS.INTERNAL_SERVER_ERROR,
                              message: "Erreur interne du serveur, réessayer plus tard",
                    })
          }
}

module.exports = {
          login,
          createUser
}