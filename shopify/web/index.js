// @ts-nocheck
import { join } from 'path'
import { readFileSync } from 'fs'
import express from 'express'
import serveStatic from 'serve-static'

import shopify from './shopify.js'

const PORT = parseInt(
  process.env.BACKEND_PORT || process.env.PORT || '3001',
  10
)

const app = express()

var apiProxy = proxy('/api/latest', {target: 'http://www.example.org/api'});
app.use(apiProxy)

var frontEndProxy = proxy('/*', {target: 'http://localhost:3000'});
app.use(frontEndProxy)

app.listen(PORT)
