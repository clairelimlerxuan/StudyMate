import React from 'react'
import CardItem from './carditems';
import './card.css';
import { Button } from './button';
function card() {
    return (
        <div className='cards'>
            <h1>Check out all the features that we offer!</h1>
            <div className='cards-container'>
                <div className='cards-warpper'>
                    <ul className='cards-items'>
                        <CardItem
                        label='YZour own personalized timetable'
                        src='/images/homepage.jpg'
                        text='Create your own timetable'
                        path='/schedule'>
                        </CardItem>
                    </ul>
                    <ul className='cards-items'>
                        <CardItem
                        src='/images/homepage.jpg'
                        text='Create your own timetable'
                        path='/schedule'>
                        </CardItem>
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default card
