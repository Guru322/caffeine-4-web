import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
        <nav className="navbar">
            <h1>Website Monitor</h1>
            <ul>
                <li>
                    <Link to="/">Dashboard</Link>
                </li>
                <li>
                    <Link to="/add-website">Add Website</Link>
                </li>
            </ul>
        </nav>
    );
};

export default Navbar;