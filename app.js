const boom = require('boom')
const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const passport = require('passport')
const logger = require('morgan')
const session = require('express-session')
const cors = require('cors')

const indexRouter = require('./routes/index')
const usersRouter = require('./routes/users')
const loginRouter = require('./routes/login')

const app = express()

app.use(cors())
// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

app.use(bodyParser.json())
app.use(methodOverride())
app.use(session({
  secret: process.env.SECRET_KEY,
  resave: true,
  saveUninitialized: true
}))
// Initialize Passport!  Also use passport.session() middleware, to support
// persistent login sessions (recommended).
app.use(passport.initialize())
app.use(passport.session())


app.use('/', indexRouter)
app.use('/users', usersRouter)
app.use('/auth', loginRouter)

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(boom.notFound())
})

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

module.exports = app
