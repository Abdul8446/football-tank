import React from 'react'
import CompetitionsList from '../../components/competitions-list/CompetitionsList'
import FeaturedNews from '../../components/featured-news/FeaturedNews'
import Favorites from '../../components/favorites/Favorites'
import { useLocation } from 'react-router-dom'

function FavoritesPage() {
  const location = useLocation()
  const {navMatches} = location.state

  return (
    <>
      <div className="content">
        <CompetitionsList/>
        <Favorites matches={navMatches}/>
        <FeaturedNews/>       
      </div>
    </>
  )
}

export default FavoritesPage
