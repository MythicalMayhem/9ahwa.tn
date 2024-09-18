import { useNavigate } from "react-router-dom";
import "../styles/homePage.css"
function HomePage() {
  const navigate = useNavigate()
  return <div className="home-page">
    <div className="header">Home Page</div>
    <section>

      <div className="card"  >

        <div className="text">
          <h1>Card Title</h1>
          <p>
            Lorem ipsum dolor sit, amet consectetur adipisicing elit.
            sit aut soluta eveniet quis aspernatur perspiciatis blanditiis.
            Obcaecati ab nemo impedit.
          </p>
          <button onClick={() => navigate("/queue")}> Queue </button>
        </div>
      </div>

    </section>
    <footer>Made By Mayhem</footer>
  </div>;
}

export default HomePage;
