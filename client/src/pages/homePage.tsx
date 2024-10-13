import { useNavigate } from "react-router-dom";
import "../styles/homePage.css"
function HomePage() {
  const navigate = useNavigate()
  return <div className="home-page">
    <div className="header">Sbe7 lward</div>
    <section>

      <div className="card">
        <div className="text">
          <h1>Chkoba</h1>
          <br />
          <p>
            Chkobba is a card game brought to Tunisia by Italian migrants.
            The game pits two players or two teams of two players against each other most often, 
            but it is possible to play with three or four independent players.
          </p>
          <br />
          <button onClick={() => navigate("/queue")}> Queue </button>
        </div>
      </div>

    </section>
    <footer>Made By Mayhem</footer>
  </div>;
}

export default HomePage;
