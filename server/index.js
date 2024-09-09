import { createServer } from 'http'
import { Server } from 'socket.io'
import express from 'express'

import { init, ChkobaTable, getRoomData, play } from './mods/chkoba.js'
const app = express()
const server = createServer()

export const io = new Server(server, {
    cors: ['127.0.0.1:5500'],
    connectionStateRecovery: {
        maxDisconnectionDuration: 2 * 60 * 1000,
        skipMiddlewares: true,
    }
})
server.listen(3001, () => console.log('server running on 3001'))

class Player {
    constructor(name, id, socket) {
        this.socket = socket
        this.ip = socket.handshake.address
        this.name = name
        this.id = id
        this.hand = []
        this.ate = []
    }
}
class Room {
    constructor(id, players, gameMode) {
        this.id = String(id)
        this.table = new ChkobaTable(players, id)
        this.gameMode = gameMode
    }
}


let k = 0
let rooms = {}
let queue = []
io.on('connection', (socket) => {
    console.log(socket.handshake.address);
    socket.on('queue', (playerid, name, gameMode) => {
        if (!queue.find((el) => el.socket === socket)) {
            queue.push(new Player(name, playerid, socket))
            io.to(socket.id).emit('queueSuccess', true)
        }
        if (queue.length === 2) {
            rooms[k] = new Room(k, queue, 'chkoba')
            init(rooms[k].table)
            for (const player of queue) player.socket.join(String(k))
            io.to(String(k)).emit('gamestarted', (getRoomData(rooms[k].table)))
            queue = []
            k++
        }
        console.log(queue.map((el) => el.name))
    })
    socket.on('unqueue', () => {
        queue = queue.filter((el) => el.socket.id != socket.id)
        io.to(socket.id).emit('queueSuccess', false)
    })
    socket.on('play', (roomid, playerid, data) => {
        console.log(roomid, playerid, data);
        const room = rooms[roomid]
        const hand = play(playerid, room.table, data)
        io.to(socket.id).emit('hand', hand)
        io.to(String(roomid)).emit('gamedata', (getRoomData(rooms[roomid].table)))

    })
    socket.on('disconnect', (reason) => {
        queue = queue.filter((el) => el.socket.id != socket.id)
    })
})

