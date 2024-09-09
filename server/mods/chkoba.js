import { io } from "../index.js"



export const ChkobaTable = class {
    constructor(players, roomid) {
        this.roomId = roomid
        this.players = players
        this.deck = generateDeck();
        this.ground = [];
        this.turn = 0;
        this.lastAte = null;
    }
    next() {
        // this.turn = (this.turn + 1) % this.players.length;
        console.log(this.turn)
        // if ((this.turn === 0) && this.players[this.turn].hand.length === 0) {
        // console.log(this.deck.length, this.players.map((el) => el.hand))
        // if (this.deck.length === 0) {
        // this.lastAte?.ate.push(...this.ground);
        // wrapUP(this)
        // io.to(this.roomId).emit('gameEnd', 'game End info')
        // return
        // }
        // else for (const player of this.players) { Serve(this, player) }
        // }
        // io.to(this.roomId).emit('gamedata', JSON.stringify(getRoomData(this)));
    }
}



function Serve(table, player) {
    if (table.deck.length < 0) table.deck = generateDeck()
    while (player.hand.length < 3) player.hand.push(table.deck.pop())
    player.socket.emit('hand', player.hand)
}
export const getRoomData = (table) => ({
    players: table.players.map((plr) => plr.name),
    ground: table.ground, id: table.roomId, deck: table.deck,
    turn: table.turn
})
export function init(table) {
    for (const player of table.players) {
        Serve(table, player)
    }
    while (table.ground.length < 4) table.ground.push(table.deck.pop(0));
}

const deck = [
    'd0', 'd1', 'd2', 'd3', 'd4', 'd5', 'd6', 'd7', 'd8', 'd9',
    'h0', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'h7', 'h8', 'h9',
    's0', 's1', 's2', 's3', 's4', 's5', 's6', 's7', 's8', 's9',
    'c0', 'c1', 'c2', 'c3', 'c4', 'c5', 'c6', 'c7', 'c8', 'c9',
]
export function generateDeck() { return deck.copyWithin().sort(() => Math.random() - 0.5) }
function isValid(table, handSelected, groundSelected) {
    let res = 0
    for (let index of groundSelected) { res += table.ground[index][1] }
    return res === table.players[table.turn].hand[handSelected][1];
}
const numbers = []
for (let i = 0; i < 10; i++) { numbers.push(String(i)) }
function isCharInt(c) { return numbers.indexOf(c) !== -1 } //very demure, very mindful
function isStrInt(str) { for (let i = 0; i < str.length; i++) { if (!isCharInt(str[i])) throw new Error('invalid input') } }


export function Drop(table, handCardIndex) {
    const hand = table.players[table.turn].hand
    table.ground.push(hand[handCardIndex])
    table.players[table.turn].hand = hand.filter((el, ind) => ind !== handCardIndex)
    console.log(table.players[table.turn].hand, table.ground)
}

function Eat(table, handCardIndex, groundindexes) {
    const player = table.players[table.turn]
    player.ate.push(player.hand.splice(handCardIndex, 1)[0])
    for (let index of groundindexes) { player.ate.push(table.ground.splice(index, 1)[0]) }
    table.lastAte = player

}
function wrapUP(table) {
    table.lastAte.ate = table.lastAte.ate.concat(table.ground);
    // for (let player of table.players) console.log(player.ate.map(k => String(k)));
}


//* wannabe Lexer 
export function ProcessInput(inp) {
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

export function play(playerid, table, data) {

    if (table.players[table.turn].id !== playerid) return table.players.find((el) => el.id === playerid).hand
    if (data[0] == 'd') Drop(table, parseInt(data[1]))
    // else {
    // Eat(table, ...ProcessInput(data))
    // table.lastAte = table.players[table.turn]
    // }
    table.next()
    return table.players[table.turn].hand
}
export const createRoomChkoba = (id, players) => new Room(k, queue, 'chkoba') 
