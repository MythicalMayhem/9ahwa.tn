import random
import time 
import os 

class Player :
    def __init__(self,uid,name) -> None:
        self.name = name 
        self.id = uid
        self.hand = []
        self.ate = []
        self.selecting = []
    def __str__(self) -> str:
        return self.name
class Table:
    def __init__(self) -> None:
        self.players = ()
        self.deck = []
        self.ground = []
        
        self.turn = 0
        self.round = 0
        self.jaria = 0
        self.lastAte = None
    
    def next (self):
        self.round = self.round + 1 
        self.turn += 1
        if self.turn == len(self.players):
            self.turn = 0 
        if self.round == 3*len(self.players):
            for player in self.players:
                Serve(self,player)
            self.jaria += 1
            self.round = 0

class Card:
    def __init__(self,shape,num):
        self.shape = shape
        self.num   = num 
    def __str__(self) -> str:
        return str(self.num) + self.shape[0]

def generateDeck():
    types = ['spade','heart','star','fly']
    nums = [1,2,3,4,5,6,7,8,9,10]
    deck = []
    for i in range(4):
        for j in range(10):
            deck.append(Card(types[i],nums[j]))
    random.shuffle(deck)
    return deck

    

def Serve(table:Table,player):
    while len(player.hand) <3:
        player.hand.append(table.deck.pop())

def init(table):
    for player in table.players:
        Serve(table,player)
    while len(table.ground)<4 :
            table.ground.append(table.deck.pop())



uno = Player(int(time.time()),'patron')
dos = Player(int(time.time()),'mosh')

table = Table()
table.deck = generateDeck() 
table.players = (uno,dos)


 
init(table)

def isValid( table:Table, handSelected:Card,groundSelected:list)-> bool:
    res = 0
    for index in groundSelected:
        res = res + table.ground[index].num

    print(table.players[table.turn].hand[handSelected].num, res)
    return res == table.players[table.turn].hand[handSelected].num

def ProcessInput(inp): 

    handCardIndex = int(inp.split('|')[0].strip())
    indexes = inp.split('|')[1].split(',')
    groundindexes = []
    for i in range(len(indexes)):
        groundindexes.append(int(indexes[i].strip()))

    return handCardIndex,groundindexes

def Drop(table,handCardIndex):
    table.ground.append(table.players[table.turn].hand.pop(handCardIndex))

def Eat(table:Table,handCardIndex,groundindexes:list):
    player = table.players[table.turn]
    player.ate.append(player.hand.pop(handCardIndex))
     
    groundindexes.sort()
    print(groundindexes)
    for index in list(reversed(groundindexes)):
        print(index)
        print(table.ground)
        player.ate.append(table.ground.pop(index))

    table.lastAte = player

def wrapUP(table):
    table.lastAte.ate += table.ground 
    for player in table.players:
        print([str(k) for k in player.ate])

while True:
    if len(table.deck) == 0:
        wrapUP(table)
        break
    os.system('cls')
    print(f'{table.turn = }')
    print(f'{[str(card) for card in table.ground]  }')
    print(f'{table.players[0].name} = {[str(card) for card in table.players[0].hand]  }') 
    print(f'{table.players[1].name} = {[str(card) for card in table.players[1].hand]  }') 
    
    while True: 
        inp = input()
        if inp[0] =='d': 
            Drop(table,int(inp[1])) 
            break
        handCard,tableCards = ProcessInput( inp ) #1 card in hand | indexes, of, ground 
        if isValid(table,handCard,tableCards):
            Eat(table,handCard,tableCards)
            break 
    print(    table.round)

    table.next()