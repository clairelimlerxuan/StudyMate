import React from 'react'
import './footer.css'
import { Link } from 'react-router-dom';

function footer() {
    return (
        <div className='footer-container'>
            <section className='footer-subscription'>
                <div className='input-areas'>
                    <form>
                        <input type='email' name='email' placeholder=
                        "Your Email" className="footer-input">

                        </input>                 
                    </form>
                </div>
            </section>
            <div className='footer-links'>
                <div className="footer-link-wrapper">
                    <div className="footer-link-items">
                        <h2>About Us</h2>
                        <Link to='/'>How it works</Link>
                        <Link to="/">Testimonials</Link>
                        <Link to="/">Terms of Service</Link>
                    </div>
                    <div className="footer-link-items">
                        <h2>Contact Us</h2>
                        <Link to='/'>Detailst</Link>
                        <Link to="/">Support</Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default footer
