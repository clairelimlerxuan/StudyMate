import React from 'react'
import CardItem from './landingcard';
import './card.css';
import { Button } from './button';
import Calendar from '../images/calendar.svg';
import Task from '../images/task_list.svg'
import Discussion from '../images/discussion.svg';
import NotificationPic from '../images/notification.svg';
import { Typography } from '@material-ui/core';
function card() {
    return (
        <div className='cards'>
            <Typography variant="h4" style={{textAlign: "center", marginBottom: "20px", color: "#D7745A"}}>
                Check Out All The Features That We Offer
            </Typography>
            <div className='cards-container'>
                <div className='cards-warpper'>
                    <ul className='cards-items'>
                        <CardItem
                        label='Your own personalized timetable'
                        src={Calendar}
                        text='Organise your classes, tasks, exams and your personal schedules with StudyMate'>
                        </CardItem>
                    </ul>
                    <ul>
                        <CardItem
                        label='Q&A Forum'
                        src={Discussion}
                        text='Get to ask questions regarding academic and non-academic matters 
                        and connect students to help one another'
                        >
                        </CardItem>
                    </ul>
                    <ul className='cards-items'>
                        <CardItem
                        label ='Assignments & Exams List'
                        src={Task}
                        text='StudyMate helps you to keep track of more than just homework'
                        >
                        </CardItem>
                    </ul>
                    <ul>
                        <CardItem
                        label ='Notification'
                        src={NotificationPic}
                        text='Get notified about incomplete tasks 
                        and up coming exams with our website'
                        >
                        </CardItem>
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default card
