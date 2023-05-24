import React from 'react'
import './team-overview-page.css'
import CompetitionsList from '../../components/competitions-list/CompetitionsList'
import FeaturedNews from '../../components/featured-news/FeaturedNews'
import TeamOverview from '../../components/team-overiew/TeamOverview'
import { useLocation } from 'react-router-dom'

function TeamOverviewPage() {
  const location=useLocation()
  const {teamOverview} = location.state
  
  return (
    <>
      <div className="content">
        <CompetitionsList/>
        <TeamOverview details={teamOverview}/>
        <FeaturedNews/>
      </div>
    </>
  )
}

export default TeamOverviewPage
