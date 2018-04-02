import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { ListGroup } from 'react-bootstrap';
import 'App.css';

const SeamaSidebarStyle = {
    background:"rgb(24,55,106)",
//    position:"fixed",
    width:"240px",
    height:"100%",
    // top:"52px",
    // borderRight:"1px",
    // borderRightColor:"#e0e0e0",
    // borderRightStyle:"solid"
};

const SeamaListStyleActive = {
    textAlign:"left",
    paddingLeft:"20px",
    backgroundColor:"rgb(24,55,106)",
    color:"white"
};

const SeamaListStyleInactive = {
    textAlign:"left",
    paddingLeft:"20px",
    color:"rgba(255,255,255,.7)",
    backgroundColor:"rgb(24,55,106)"
};

const ImageStyle = {
    resize:"both",
    width:"240px",
    height:"80px",
};


function CustomComponent1({ children }) {
    return (
        <li className="list-group-item" style={SeamaListStyleActive}>
            {children}
        </li>
    );
}
function CustomComponent2({ children }) {
    return (
        <li className="list-group-item" onClick={() => {}} style={SeamaListStyleInactive}>
            {children}
        </li>
    );
}

class SeamaSidebar extends Component {
    render() {
        return (
            <div className="SeamaNavSidebar" style={SeamaSidebarStyle}>
                <div>
                    {<img src={require('images/sema-sidebar-logo.png')} alt="logo" style={ImageStyle} />}
                </div>
                <header>
                    <nav>
                        <ul>
                            <li><Link to='/'>Water Operations</Link></li>
                            <li><Link to='/Sales'>Sales</Link></li>
                            <li><Link to='/DistributionMap'>Distribution Map</Link></li>
                        </ul>
                    </nav>
                </header>
            </div>
        );
    }
}

// class SeamaSidebar extends Component {
//     render() {
//         return (
//             <div className="SeamaNavSidebar" style={SeamaSidebarStyle}>
//                 <div>
//                     {<img src={require('images/sema-sidebar-logo.png')} alt="logo" style={ImageStyle} />}
//                 </div>
//                 <ListGroup>
//                     <CustomComponent1  href="#" active style={SeamaListStyleActive}><i class="glyphicon glyphicon-map-marker" style={{paddingRight:"15px"}}/>
//                         <Link to='/'>Water Operations</Link></CustomComponent1>
//                     <CustomComponent1 href="#" active style={SeamaListStyleActive}><i class="	glyphicon glyphicon-shopping-cart" style={{paddingRight:"15px"}}/>
//                         <Link to='/'>Sales</Link></CustomComponent1>
//                     <CustomComponent2 href="#" disabled style={SeamaListStyleInactive}><i class="glyphicon glyphicon-globe" style={{paddingRight:"15px"}}/>Distribution Map</CustomComponent2>
//                     <CustomComponent2 href="#" disabled style={SeamaListStyleInactive}><i class="glyphicon glyphicon-time" style={{paddingRight:"15px"}}/>Delivery Schedule</CustomComponent2>
//                     <CustomComponent2 href="#" disabled style={SeamaListStyleInactive}><i class="glyphicon glyphicon-inbox" style={{paddingRight:"15px"}}/>Inventory Management</CustomComponent2>
//                     <CustomComponent2 href="#" disabled style={SeamaListStyleInactive}><i class="glyphicon glyphicon-usd" style={{paddingRight:"15px"}}/>Financials</CustomComponent2>
//                 </ListGroup>
//             </div>
//         );
//     }
// }
//

export default SeamaSidebar;
