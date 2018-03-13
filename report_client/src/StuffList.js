import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as stuffActions from './actions';
import PropTypes from 'prop-types';
import React from 'react';


class stuffList extends React.Component {

    componentDidMount() {
        this.props.stuffActions.fetchStuff();
    }

    renderData() {
        return <div>{this.props.stuff}</div>;
    }


    render() {
        return (
            <div className="">
        {this.props.stuff.length > 0 ?
            this.renderData()
            :
    <div className="">
            No Data
        </div>
    }
    </div>
    );
    }
}

stuffList.propTypes = {
    stuffActions: PropTypes.object,
    stuff: PropTypes.array
};

function mapStateToProps(state) {
    return {
        stuff: state.stuff
    };
}

function mapDispatchToProps(dispatch) {
    return {
        stuffActions: bindActionCreators(stuffActions, dispatch)
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(stuffList);
