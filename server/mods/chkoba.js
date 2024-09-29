function Serve(table, player) {
    while (player.hand.length < 3) player.hand.push(table.deck.pop())
    player.socket.emit('hand', player.hand)
}
export const ChkobaTable = class {
    constructor(players, roomid) {
        this.roomId = roomid
        this.players = players
        this.deck = [
            'd0', 'd1', 'd2', 'd3', 'd4', 'd5', 'd6', 'd7', 'd8', 'd9',
            'h0', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'h7', 'h8', 'h9',
            's0', 's1', 's2', 's3', 's4', 's5', 's6', 's7', 's8', 's9',
            'c0', 'c1', 'c2', 'c3', 'c4', 'c5', 'c6', 'c7', 'c8', 'c9',
        ].sort(() => Math.random() - 0.5);
        this.lastAte = null;
        this.ground = [];
        this.turn = 0;
    }
    next() {
        this.wrapUP()
        this.turn = (this.turn + 1) % this.players.length;
        if ((this.turn === 0) && this.players[this.turn].hand.length === 0) {
            if (this.deck.length === 0) {
                this.lastAte?.ate.push(...this.ground);
                return this.wrapUP()
            }
            else for (const player of this.players) { Serve(this, player) }
        }
        return false
    }
    wrapUP() {
        const res = {}
        if (this.lastAte) this.lastAte.ate = this.lastAte.ate.concat(this.ground);
        for (let player of this.players) res[player.name] = player.ate
        return res
    }
}


export const getRoomData = (table) => ({
    players: table.players.map((plr) => plr.name),
    ground: table.ground, id: table.roomId, deck: table.deck,
    turn: table.turn
})
export function init(table) {
    for (const player of table.players) Serve(table, player)
    while (table.ground.length < 4) table.ground.push(table.deck.pop(0))
}
function isValid(table, handSelected, groundSelected) {
    let res = 0

    for (let index of groundSelected) res += parseInt(table.ground[index][1]) + 1
    console.log(handSelected, groundSelected, parseInt(table.players[table.turn].hand[handSelected][1]) + 1, res);
    return res === parseInt(table.players[table.turn].hand[handSelected][1]) + 1;
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
    if (!isValid(table, handCardIndex, groundindexes)) throw new Error("invalid");

    const player = table.players[table.turn]
    for (let i = 0; i < groundindexes.length; i++)
        player.ate.push(table.ground[groundindexes[i]])


    table.ground = table.ground.filter((el, i) => groundindexes.findIndex((e) => e === i) === -1)
    player.ate.push(player.hand[handCardIndex])
    table.players[table.turn].hand = table.players[table.turn].hand.filter((el, ind) => ind !== handCardIndex)
    table.lastAte = table.players[table.turn]

}

//* wannabe Lexer
//! Unnecessary, just wrap everything inside trycatch
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
    groundindexes.push(parseInt(currentToken))
    return [parseInt(hand), groundindexes]
}
export function play(playerid, table, data) {
    if (table.players[table.turn].id !== playerid) { return [table.players.find((el) => el.id === playerid).hand, false] }
    if (data[0] == 'd') { Drop(table, parseInt(data[1])) }
    else {
        console.clear()
        const [hand, groundindexes] = ProcessInput(data)
        Eat(table, hand, groundindexes)
        table.lastAte = table.players[table.turn]
    }

    const tur = table.turn
    const playerHand = table.players[tur].hand
    const state = table.next()
    console.log([playerHand, state]);
    return [playerHand, true || state]
}

export const createRoomChkoba = (id, players) => new Room(k, queue, 'chkoba') 
