import React, { Component } from 'react';
import {Button, Glyphicon} from 'react-bootstrap';
import "./index.scss";
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';

export default class PaymentOverview extends Component {
    constructor(props) {
        super(props);
        this.state = {
          payments: [],
          paymentCreation: false,
          whatCurrUserOwes: [],
          whatCurrUserIsOwed: [],
          paymentView: false
        };
    }
    componentDidMount(prevProps) {
        this.getPayments();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.groupID !== this.props.groupID) {
            this.getPayments();
        }
    }

    handlePaymentCreateButtonPress() {
        this.paymentCreation = true;
    }

    getPayments() {
        let ref = this.props.database.ref('payments/');
        ref.orderByChild("groupID").equalTo(this.props.groupID).on("value", (data) => {
            let payments = [];
            data.forEach((child) => {
                payments.push(child.val());
            });
            this.setState({
                payments: payments,
            })
        });       

      }

    
    render() {
        

        let whatCurrUserOwes = this.state.payments.filter((item) => {
            return item.payerUID === this.props.user.uid;
        });

        let whatCurrUserIsOwed = this.state.payments.filter((item) => {
            return this.props.personsInGroup.find(person => {
                return (person.uid === item.payerUID) && (person.uid !== this.props.user.uid)
            });
        });

        let totalUserOwes = 0;
        whatCurrUserOwes.forEach(item => totalUserOwes += item.amount);

        let owedComponents = whatCurrUserIsOwed.map((payment) => {
            let name = this.props.personsInGroup.find(person => person.uid === payment.payerUID).name;
            return( 
            <div className="overview-header" onClick={() => this.props.handleViewPayments(payment, true)} >
                {name} owes you <b>${payment.amount}</b> <Glyphicon className="pull-right" glyph="menu-right" />
            </div>);
        })

        let overview = (
            <div id="overview">
                <div className="overview-header" onClick={() => this.props.handleViewPayments(whatCurrUserOwes, true)} >
                    You owe <b>${totalUserOwes}</b> total <Glyphicon className="pull-right" glyph="menu-right" />
                </div>
                {owedComponents}
          </div>
       
        );

        return (
            <div className="Payments">
                {overview}
            </div>
        )
    }
}

