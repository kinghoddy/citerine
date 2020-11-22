import React from 'react';
import Wrapper from '../../components/layout/appLayout';
import Link from 'next/link'

class Activate extends React.Component {
    render() {
        return (
            <Wrapper route="My account"  >
                <h6 className="text-warning" >How to Activate my account </h6>
                <ol>
                    <li>First,  click on the <b>"start activation"</b>  button below. You will be asked to input your bank details. <i className="text-info">Note: Make sure you input the correct bank details. If the information you provide is wrong , this may lead to you not getting paid </i>   </li>
                    <li>You will have to state your request on the system by clicking the "Pay Activation Fee" button below.</li>
                    <li>You will be required to pay a one time Activation fee of N 1,000 to citrine rewards (<b>Bank Details available is on your dashboard</b>) </li>
                    <li>You can make payment through bank transfer, bank deposit or internet banking.</li>
                    <li>After making this payment, Click on the I've Paid button and upload your Proof of Payment to notify the system that you have made this payment.</li>
                    <li>After confirmation, Your account will be activated and you can start your investment immediately.</li>
                </ol>
                <h6 className="text-warning" >Why am i paying activation fee</h6>
                <ul>
                    <li>
                        This is a security mechanism put in place to ensurn that only serious participants gain entrance into the system. </li>
                    <li>This is to prove to the system that you are a serious participant and you will make payment of any pledge you make on the platform.
                    </li>
                </ul>
                <Link href="/activate/bank">
                    <a className="btn btn-primary  px-4 ml-auto">Start Activation </a>
                </Link>

            </Wrapper >
        )
    }
}

export default Activate