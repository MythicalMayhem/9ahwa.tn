const http = require('http')
const io = require('socket.io')

const server = http.createServer()

server.listen(3001, () => {
    console.log('server running on 3001');
})
const socketeer = io(server, { cors: ['127.0.0.1:5500'] })

function init(table) {
    for (let player of table.players) Serve(table, player);
    while (table.ground.length < 4) table.ground.push(table.deck.pop());
}

function Serve(table, player) {
    while (player.hand.length < 3)
        player.hand.push(table.deck.pop());
}

function generateDeck() {
    const deck = [
        'd1', 'd2', 'd3', 'd4', 'd5', 'd6', 'd7',
        'd8', 'd9', 'd10', 'h1', 'h2', 'h3', 'h4',
        'h5', 'h6', 'h7', 'h8', 'h9', 'h10', 's1',
        's2', 's3', 's4', 's5', 's6', 's7', 's8',
        's9', 's10', 'c1', 'c2', 'c3', 'c4', 'c5',
        'c6', 'c7', 'c8', 'c9', 'c10']

    return deck.copyWithin().sort(() => Math.random() - 0.5);


}

function isValid(table, handSelected, groundSelected) {
    let res = 0;
    for (let index of groundSelected) {
        res += table.ground[index].num;
    }

    console.log(table.players[table.turn].hand[handSelected].num, res);
    return res === table.players[table.turn].hand[handSelected].num;
}

function ProcessInput(inp) {
    const handCardIndex = parseInt(inp.split('|')[0].trim());
    const indexes = inp.split('|')[1].split(',');
    const groundindexes = [];

    for (let i = 0; i < indexes.length; i++) {
        groundindexes.push(parseInt(indexes[i].trim()));
    }

    return [handCardIndex, groundindexes];
}

function Drop(table, handCardIndex) {
    table.ground.push(table.players[table.turn].hand.splice(handCardIndex, 1)[0]);
}

function Eat(table, handCardIndex, groundindexes) {
    const player = table.players[table.turn];
    player.ate.push(player.hand.splice(handCardIndex, 1)[0]);

    groundindexes.sort((a, b) => a - b);
    console.log(groundindexes);
    for (let index of groundindexes.reverse()) {
        console.log(index);
        console.log(table.ground);
        player.ate.push(table.ground.splice(index, 1)[0]);
    }

    table.lastAte = player;
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

function getRoomData(room) {
    const players = []
    for (const player of room.table.players) {
        players.push({
            name: player.name,
            id: player.id,
        })
    }
    return {
        id: room.id,
        players,
        deck: room.table.deck,
        ground: room.table.ground,
        turn: room.table.turn,
        round: room.table.round,
        jaria: room.table.jaria,
        lastAte: room.table.lastAte
    }
}


let k = 0
let rooms = {}
let queue = []
socketeer.on('connection', (socket) => {
    console.log('new socket ', socket.id);

    socket.on('queue', (id, name) => {

        if (!queue.find((el) => el.socket === socket)) {
            queue.push(new Player(id, name, socket))
            socket.emit('queueSuccess', true)
        }
        if (queue.length === 2) {
            for (const player of queue) {
                player.socket.join(k)
            }

            rooms[k] = new Room(k, [...queue])
            init(rooms[k].table)

            socketeer.to(k).emit('data', JSON.stringify(getRoomData(rooms[k])));
            k++
            queue = []
        }
        console.log(queue.map((el) => { return el.id }));
    })
    socket.on('unqueue', () => {
        queue = queue.filter((el) => el.socket.id != socket.id)
        socket.emit('queueSuccess', false)
        console.log(queue)
    })
    socket.on('disconnect', (reason) => {
        queue = queue.filter((el) => el.socket.id != socket.id)
    })
})

