import React from 'react';
import { Link } from 'react-router-dom';

const IndexPage = () => {
    return (
        <div className="bg-custom rounded-4 p-5 m-3 text-center">
            <h1 className='lh-base'>Welcome to Forest Chat! Please <Link className="green-link"  to="/login">Login</Link> or <Link className="green-link" to="/register">Register</Link> to continue.</h1>
       <div className="leaf">
           <img src="https://excellentflowersinc.com/cdn/shop/products/Leather-Leaf-1.png?v=1598566359" alt=""/>
       </div>
        </div>
    );
};

export default IndexPage;
