function shortName(compN){
    const competitions={
        'Champions League':'UCL',
        'Premier League':'EPL',
        'Europa League':'UEL',
        'Europa Conference League':'ECL',
    }
    if (competitions.hasOwnProperty(compN)) {
        compN = competitions[compN];
    }   
    return compN;
}

module.exports=shortName