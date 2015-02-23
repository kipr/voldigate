jade = require 'jade'
fs = require 'fs'
url = require 'url'
path_tools = require 'path'

index = jade.compile(fs.readFileSync('apps/kiss/index.jade', 'utf8'), filename: "./apps/kiss/index.jade")

module.exports =
  handle: (request, response) ->
    path = url.parse(request.url).pathname
    name = path_tools.basename(path)
    if name is 'kiss'
      response.writeHead 200, { 'Content-Type': 'text/html' }
      return response.end index(), 'utf8'
    response.writeHead 404, { 'Content-Type': 'text/plain' }
    response.end 'Pade not found\n'