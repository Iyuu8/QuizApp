import {Link} from 'react-router-dom';
const NotFound = ()=>{
    return (
        <div className="page-not-found">
            <h1>Page Not Found</h1>
            <p>Return to the home page: <Link to='/'>Home</Link></p>
        </div>
    )
}

export default NotFound;