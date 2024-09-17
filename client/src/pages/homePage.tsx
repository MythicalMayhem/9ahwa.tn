import { useNavigate } from "react-router-dom";
import "../styles/homePage.css"
import { Button, Card } from "react-bootstrap";
function HomePage() {
  const navigate = useNavigate()
  return <div className="home-page">
    <header>Home Page</header>
    <section>

      <Card className="card"  >
        <Card.Img variant="top" src="imgs/games/chkobba.jpg" height={"150px"} />
        <Card.Body>
          <Card.Title>Card Title</Card.Title>
          <Card.Text>
            Lorem ipsum dolor sit, amet consectetur adipisicing elit.
            sit aut soluta eveniet quis aspernatur perspiciatis blanditiis.
            Obcaecati ab nemo impedit.
          </Card.Text>
          <Button variant="primary" onClick={() => navigate("/queue")}> chkoba </Button>
        </Card.Body>
      </Card>

    </section>
    <footer>Made By Mayhem</footer>
  </div>;
}

export default HomePage;
