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
                        label='Your own personalized timetable'
                        src='images/calendar.svg'
                        text='Organise your classes, tasks, exams and your personal schedules with StudyMate'
                        path='/schedule'>
                        </CardItem>
                        <CardItem
                        label='Q&A Forum'
                        src='/images/discussion.svg'
                        text='Get to ask questions regarding academic and non-academic matters 
                        and connect students to help one another'
                        path='/forum'>
                        </CardItem>
                    </ul>
                    <ul className='cards-items'>
                        <CardItem
                        label ='Assignments & Exams List'
                        src='/images/task_list.svg'
                        text='StudyMate helps you to keep track of more than just homework'
                        path='/assignment-exam'>
                        </CardItem>
                        <CardItem
                        label ='Notification'
                        src='/images/notification.svg'
                        text='Get notified about incomplete tasks 
                        and upcoming exams with our website'
                        path='/notification'>
                        </CardItem>
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default card
