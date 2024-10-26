import '../styles/board.css'

const Card = (props: any) => <div key={props.key} style={props.style} className="card"></div>
const SideBoard = (props: any) =>
  <div className='side-board'>
    {props.children}
  </div>

const Board = (props: any) => <div className='board'>
  {props.children}
</div>

function MainGame() {
  const handCards = ["d0",  ]
  return (
    <div className="board-wrapper ">
      <Board >
        <Card />
      </Board>
      <SideBoard >
        {handCards.map((el, i) => <Card key={i} style={{ "left":  String(10*handCards.length - 10*handCards.length/3 + 50*i/2)+"%"  }} />)} 
      </SideBoard>
    </div>
  );
}

export default MainGame;