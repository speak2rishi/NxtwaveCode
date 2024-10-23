const express = require('express')
const path = require('path')
const {open} = require('sqlite')
const sqlite3 = require('sqlite3')
const app = express()
const dbPath = path.join(__dirname, 'cricketTeam.db')
let db = null
app.use(express.json())
const initializeDbAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    })
    app.listen(3000, () => {
      console.log('server is running......')
    })
  } catch (e) {
    console.log(`DB error:${e.message}`)
    process.exit(1)
  }
}

initializeDbAndServer()

//Get Player API
app.get('/players/', async (request, response) => {
  const getPlayersQuery = `SELECT * FROM cricket_team;`
  const playersList = await db.all(getPlayersQuery)
  response.send(playersList)
})

//post Player API
app.post('/players/', async (request, response) => {
  const playerDetails = request.body
  const {playerName, jerseyNumber, role} = playerDetails
  const getPlayersQuery = `INSERT INTO cricket_team (player_name,jersey_number,role) VALUES ('${playerName}',${jerseyNumber},'${role}')`

  const playersList = await db.run(getPlayersQuery)
  response.send('Player Added to Team')
})

//Get Player Through ID
app.get('/players/:playerId/', async (request, response) => {
  const {playerId} = request.params
  const getPlayersQuery = `SELECT * FROM cricket_team WHERE player_id=${playerId};`
  const playerList = await db.run(getPlayersQuery)
  response.send(playerList)
})

//Put Player Details
app.put('/players/:playerId/', async (request, response) => {
  const {playerId} = request.params
  const playerDetails = request.body
  const {playerName, jerseyNumber, role} = playerDetails
  const getPlayersQuery = `UPDATE cricket_team SET player_name='${playerName}',jersey_number=${jerseyNumber},role='${role}) WHERE player_id=${playerId}`

  const playersList = await db.run(getPlayersQuery)
  response.send('Player Details Updated')
})
//Delete Player name
app.delete('/players/:playerId/', async (request, response) => {
  const {playerId} = request.params
  const getPlayersQuery = `DELETE FROM cricket_team WHERE player_id=${playerId}`

  const playersList = await db.run(getPlayersQuery)
  response.send('Player Removed')
})
