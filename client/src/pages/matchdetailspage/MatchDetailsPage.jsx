import "./match-details-page.css";
import CompetitionsList from "../../components/competitions-list/CompetitionsList";
import FeaturedNews from "../../components/featured-news/FeaturedNews";
import MatchDetails from "../../components/match-details/MatchDetails";
import { useLocation } from "react-router-dom";

function MatchDetailsPage() {
    const location = useLocation()
    const {matchUrl} = location.state

  return (
    <>
        <div className="content">
          <CompetitionsList />
          <MatchDetails matchUrl={matchUrl} />
          <FeaturedNews />
        </div>
    </>
  );
}

export default MatchDetailsPage;
