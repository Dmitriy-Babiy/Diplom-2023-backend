import express from 'express'
import mongoose from 'mongoose'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

import { validationResult } from 'express-validator'
import { registerValidation } from './validations/auth.js'

import userModel from './models/User.js'

const app = express()
app.use(express.json())

//Подключение к mongodb
mongoose
  .connect('mongodb+srv://admin:www@backend-data-base.6ogihfx.mongodb.net/BackendData?retryWrites=true&w=majority')
  .then(() => console.log('DB ok'))
  .catch((err) => console.log('DB error'))

//Запрос авторизации
app.post('/auth/login', async (req, res) => {
  try {
    const user = await userModel.findOne({ email: req.body.email })

    if (!user) {
      return req.status(404).json({
        message: 'Пользователь не найден',
      })
    }

    const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash)

    if (!isValidPass) {
      return res.status(400).json({
        message: 'Неверный логи или пароль',
      })
    }

    const token = jwt.sign(
      {
        _id: user._id,
      },
      'secretKey',
      {
        expiresIn: '30d',
      }
    )

    const { passwordHash, ...userData } = user._doc

    res.json({
      ...userData,
      token,
    })
  } catch (err) {
    console.log(err)
    res.status(500).json({
      message: 'Не удалось авторизироваться',
    })
  }
})

//Запрос регистрации
app.post('/auth/register', registerValidation, async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json(errors.array())
    }

    const password = req.body.password
    const salt = await bcrypt.genSalt(10)
    const Hash = await bcrypt.hash(password, salt)

    const doc = new userModel({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      passwordHash: Hash,
    })

    const user = await doc.save()

    const token = jwt.sign(
      {
        _id: user._id,
      },
      'secretKey',
      {
        expiresIn: '30d',
      }
    )

    const { passwordHash, ...userData } = user._doc
    res.json({
      ...userData,
      token,
    })
  } catch (err) {
    console.log(err)
    res.status(500).json({
      message: 'Не удалось зарегистрироваться',
    })
  }
})



//Запуск сервера
app.listen(4444, (err) => {
  if (err) {
    return console.log(err)
  }
  console.log('Server OK (http://localhost:4444/)')
})
