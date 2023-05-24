import React from "react";
import { useLocation } from "react-router-dom";
import CompetitionOverview from "../../components/competition-overview/CompetitionOverview";
import CompetitionsList from "../../components/competitions-list/CompetitionsList";
import FeaturedNews from "../../components/featured-news/FeaturedNews";
import "./competition-overview.css";

function CompetitionOverviewPage() {
  const location=useLocation()
  const {overview} = location.state

  return (
    <>
      <div className="content">
        <CompetitionsList/>
        <CompetitionOverview details={overview}/>
        <FeaturedNews/>
      </div>
    </>
  );
}

export default CompetitionOverviewPage;
