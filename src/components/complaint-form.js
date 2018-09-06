import React from 'react';
import {reduxForm, Field, SubmissionError} from 'redux-form';
import {required, nonEmpty, reqLength, isNumber} from '../validators';
import Input from './input';

export class ComplaintForm extends React.Component {
  onSubmit(values) {
    console.log('onSubmit ran!');
    console.log('values');
    return fetch('https://us-central1-delivery-form-api.cloudfunctions.net/api/report', {
      method: 'POST',
      body: JSON.stringify(values),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(res => {
        if (!res.ok) {
            if (
                res.headers.has('content-type') &&
                res.headers
                    .get('content-type')
                    .startsWith('application/json')
            ) {
                // It's a nice JSON error returned by us, so decode it
                return res.json().then(err => Promise.reject(err));
            }
            // It's a less informative error returned by express
            return Promise.reject({
                code: res.status,
                message: res.statusText
            });
        }
        return;
    })
    .then(() => console.log('Submitted with values', values))
    .catch(err => {
        const {reason, message, location} = err;
        if (reason === 'ValidationError') {
            // Convert ValidationErrors into SubmissionErrors for Redux Form
            return Promise.reject(
                new SubmissionError({
                    [location]: message
                })
            );
        }
        return Promise.reject(
            new SubmissionError({
                _error: 'Error submitting message'
            })
        );
    });
  }
  render() {
    let successMessage;
    if (this.props.submitSucceeded) {
      successMessage = (
        <div className="message message-success">
          Message submitted successfully
        </div>
      );
    }

    let errorMessage;
    if (this.props.error) {
      errorMessage = (
        <div className="message message-error">{this.props.error}</div>
      );
    }
    return (
    <div className="complaintForm">
      <h2>Report a problem with your delivery</h2>
      <form onSubmit={this.props.handleSubmit(values => this.onSubmit(values))}>
        {successMessage}
        {errorMessage}
        <Field 
        component={Input}
        type="text"
        id="trackingNumber"
        name="trackingNumber"
        label="Tracking Number"
        validate={[required, nonEmpty, reqLength, isNumber]}
        />
        <label htmlFor="issue">What is your issue?</label>
        <Field
        component="select"
        name="issue"
        id="issue"
        >
          <option value="not-delivered">My delivery hasn't arrived</option>
          <option value="wrong-item">The wrong item was delivered</option>
          <option value="missing-part">Part of my order was missing</option>
          <option value="damaged">Some of my order arrived damaged</option>
          <option value="other">Other (give details below)</option>
        </Field>
        {/* <label htmlFor="details">Give more details (optional)</label> */}
        <Field
        component={Input}
        element="textarea"
        id="details"
        name="details"
        label="Give more details (optional)"
        ></Field>
        <button type="submit">Submit</button>
      </form>
    </div>
    )
  }
}

export default reduxForm({
  form: 'complaint'
})(ComplaintForm);

