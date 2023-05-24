import React from 'react'

function AdContents() {
    const elements = [
        <img src={require('../../assets/images/ad1.jpg')} alt="" style={{ maxWidth: '30vw', height: 'auto' }}/>,
        <img src={require('../../assets/images/ad2.jpg')} alt="" style={{ maxWidth: '30vw', height: 'auto' }}/>,
        <img src={require('../../assets/images/ad3.jpg')} alt="" style={{ maxWidth: '30vw', height: 'auto' }}/>,
        <img src={require('../../assets/images/ad4.jpg')} alt="" style={{ maxWidth: '30vw', height: 'auto' }}/>,
        <img src={require('../../assets/images/ad5.webp')} alt="" style={{ maxWidth: '30vw', height: 'auto' }}/>,
        <img src={require('../../assets/images/ad6.jpg')} alt="" style={{ maxWidth: '30vw', height: 'auto' }}/>,
        <img src={require('../../assets/images/ad7.jpg')} alt="" style={{ maxWidth: '30vw', height: 'auto' }}/>,
        <img src={require('../../assets/images/ad8.avif')} alt="" style={{ maxWidth: '30vw', height: 'auto' }}/>,
        <img src={require('../../assets/images/ad9.png')} alt="" style={{ maxWidth: '30vw', height: 'auto' }}/>,
        <img src={require('../../assets/images/ad10.jpg')} alt="" style={{ maxWidth: '30vw', height: 'auto' }}/>,
        <img src={require('../../assets/images/ad11.jpg')} alt="" style={{ maxWidth: '30vw', height: 'auto' }}/>,
        <img src={require('../../assets/images/ad12.jpg')} alt="" style={{ maxWidth: '30vw', height: 'auto' }}/>,
        <img src={require('../../assets/images/ad13.jpg')} alt="" style={{ maxWidth: '30vw', height: 'auto' }}/>,
        <img src={require('../../assets/images/ad14.jpg')} alt="" style={{ maxWidth: '30vw', height: 'auto' }}/>,
        <img src={require('../../assets/images/ad15.jpg')} alt="" style={{ maxWidth: '30vw', height: 'auto' }}/>,
        <img src={require('../../assets/images/ad16.jpg')} alt="" style={{ maxWidth: '30vw', height: 'auto' }}/>,
        <img src={require('../../assets/images/ad17.jpg')} alt="" style={{ maxWidth: '30vw', height: 'auto' }}/>,
        <img src={require('../../assets/images/ad18.jpg')} alt="" style={{ maxWidth: '30vw', height: 'auto' }}/>,

        // Add more elements as needed
    ];

    const getRandomElement = () => {
        const randomIndex = Math.floor(Math.random() * elements.length);
        return elements[randomIndex];
      };
    
      const randomAd = getRandomElement();
    
      return <>{randomAd}</>;
}

export default AdContents

