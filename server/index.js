const http = require('http')
const io = require('socket.io')

const server = http.createServer()

server.listen(3001, () => { console.log('server running on 3001') })
const socketeer = io(server, { cors: ['127.0.0.1:5500'] })

function init(table) {
    for (let player of table.players) Serve(table, player);
    while (table.ground.length < 4) table.ground.push(table.deck.pop(0));
}

function Serve(table, player) { while (player.hand.length < 3) player.hand.push(table.deck.pop()); }

const deck = [
    'd0', 'd1', 'd2', 'd3', 'd4', 'd5', 'd6', 'd7', 'd8', 'd9',
    'h0', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'h7', 'h8', 'h9',
    's0', 's1', 's2', 's3', 's4', 's5', 's6', 's7', 's8', 's9',
    'c0', 'c1', 'c2', 'c3', 'c4', 'c5', 'c6', 'c7', 'c8', 'c9',
]
function generateDeck() { return deck.copyWithin().sort(() => Math.random() - 0.5) }
function isValid(table, handSelected, groundSelected) {
    let res = 0
    for (let index of groundSelected) { res += table.ground[index][1] }
    return res === table.players[table.turn].hand[handSelected][1];
}

const numbers = []
for (let i = 0; i < 10; i++) { numbers.push(String(i)) }
function isCharInt(c) { return numbers.indexOf(c) !== -1 } //very demure, very mindful
function isStrInt(str) { for (let i = 0; i < str.length; i++) { if (!isCharInt(str[i])) throw new Error('invalid input') } }

function ProcessInput(inp) {
    const [hand, ground] = inp.split('!')
    if (!hand || !ground) { throw new Error('invalid input') }
    isStrInt(hand)
    let currentToken = ''
    const groundindexes = []
    for (let i = 0; i < ground.length; i++) {
        const letter = ground[i]
        if (letter === ' ') {
            groundindexes.push(parseInt(currentToken))
            currentToken = ''
            continue
        } else if (isCharInt(letter)) {
            currentToken += letter
            continue
        } else { throw new Error('invalid input') }
    }
    return [hand, groundindexes]
}

function Drop(table, handCardIndex) { table.ground.push(table.players[table.turn].hand[handCardIndex]) }
function Eat(table, handCardIndex, groundindexes) {
    const player = table.players[table.turn]
    player.ate.push(player.hand.splice(handCardIndex, 1)[0])
    for (let index of groundindexes) { player.ate.push(table.ground.splice(index, 1)[0]) }
    table.lastAte = player
}

function wrapUP(table) {
    table.lastAte.ate = table.lastAte.ate.concat(table.ground);
    for (let player of table.players) {
        console.log(player.ate.map(k => String(k)));
    }
}


class Player {
    players = []
    constructor(name, id, socket) {
        this.name = name
        this.id = id
        this.hand = []
        this.ate = []
        this.socket = socket
    }
}

class Table {
    constructor(players) {
        this.players = players;
        this.deck = generateDeck();
        this.ground = [];
        this.turn = 0;
        this.round = 0;
        this.jaria = 0;
        this.lastAte = null;
    }

    next() {
        this.round += 1;
        this.turn += 1;
        if (this.turn === this.players.length) {
            this.turn = 0;
        }
        if (this.round === 3 * this.players.length) {
            for (const player of this.players) {
                Serve(this, player);
            }
            this.jaria += 1;
            this.round = 0;
        }
    }
}


class Room {
    constructor(id, players) {
        this.id = id
        this.table = new Table(players)
    }
}

const getRoomData = (room) => ({ id: room.id, players: room.table.players.map((plr) => plr.name), deck: room.table.deck, ground: room.table.ground })
let k = 0
let rooms = {}
let queue = []
socketeer.on('connection', (socket) => {
    socket.on('queue', (playerid, name) => {
        if (!queue.find((el) => el.socket === socket)) {
            queue.push(new Player(name, playerid, socket))
            socket.emit('queueSuccess', true)
        }
        if (queue.length === 2) {
            for (const player of queue) {
                player.socket.join(String(k))
            }
            rooms[k] = new Room(k, [...queue])
            init(rooms[k].table)
            socketeer.to(String(k)).emit('gamestarted', JSON.stringify(getRoomData(rooms[k])));
            k++
            queue = []
        }
        console.log(queue)
    })
    socket.on('unqueue', () => {
        queue = queue.filter((el) => el.socket.id != socket.id)
        socket.emit('queueSuccess', false)
    })
    socket.on('play', (roomid, playerid, data) => {
        const room = rooms[roomid]
        if (data[0] == 'd') { Drop(room.table, parseInt(data[1])) }
        else { Eat(room.table, ...ProcessInput(data)) }
        socketeer.to(roomid).emit('gamedata', JSON.stringify(getRoomData(rooms[roomid])));
    })
    socket.on('disconnect', (reason) => {
        queue = queue.filter((el) => el.socket.id != socket.id)
    })
})

