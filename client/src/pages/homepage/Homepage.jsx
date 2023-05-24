import Matches from "../../components/matches/Matches";
import "./homepage.css";
import CompetitionsList from "../../components/competitions-list/CompetitionsList";
import FeaturedNews from "../../components/featured-news/FeaturedNews";

function Homepage() {
 
  return (
    <>
    <div className="content">
      <CompetitionsList />
      <Matches />
      <FeaturedNews />
    </div>
    </>
  );
}

export default Homepage;
