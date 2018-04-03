import React, { Component } from 'react';
import { Form, FormGroup, Col, FormControl, Button, Alert } from 'react-bootstrap';
import * as RestServices from "actions/RestServices"
import 'css/SeamaLog.css';

class SeamaLogIn extends Component {
    constructor(props, context) {
        super(props, context);
        console.log("SeamaLogIn-constructor");
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(event){
        console.log("SeamaLogIn - handleClick");
        RestServices.fetchUserRole(this.inputUser.value, this.inputPassword.value);
        event.preventDefault();
//        RestServices.fetchWaterQuality(kioskParams);
    };

    render(){
        return (
            <div className="LogIn">
                <Form horizontal style={{margin: "auto", width: "30%", padding: "10% 0"}}>
                    <FormGroup controlId="formUser">
                        <Col sm={10}>
                            <FormControl type="text" placeholder="User" inputRef={ref => { this.inputUser = ref; }}/>
                        </Col>
                    </FormGroup>

                    <FormGroup controlId="formPassword">
                        <Col sm={10}>
                            <FormControl type="password" placeholder="Password" inputRef={ref => { this.inputPassword = ref; }}/>
                        </Col>
                    </FormGroup>
                    <FormGroup>
                        <Col sm={10}>
                            <Button type="submit" onClick={this.handleClick}
                                    style={{width: "100%", color: "white", background: "rgb(40,88,167)"}}>Sign in</Button>
                        </Col>
                    </FormGroup>
                </Form>
                { this.props.seamaState.LogState === "NoService" ? <NoService
                    header="Service Not Currently Available"
                    message="The Service is not currently available. Please try again later."/> : null }
                { this.props.seamaState.LogState === "BadCredentials" ? <NoService
                    header="Invalid Credentials"
                    message="User name and/or password are not valid"/> : null }
            </div>

        );
    };
    noService (){
    }
}
class NoService extends Component {
    constructor(props, context) {
        super(props, context);
        console.log("NoService-constructor");
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(event){
        console.log("SeamaLogIn - handleClick");
        RestServices.clearLogin();
        event.preventDefault();
    };

    render(){
        return (
            <Alert bsStyle="info" className="SeamaServiceError" style={{textAlign:"center", height:"130px"}}>
                <h4>{this.props.header}</h4>
                <p>{this.props.message}</p>
                <Button bsStyle="info" onClick={this.handleClick} style={{marginTop:"15px"}}>Ok</Button>
            </Alert>
        );
    }

}
export default SeamaLogIn;