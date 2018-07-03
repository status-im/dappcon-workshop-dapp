import React from 'react';
import { FormGroup, ControlLabel, FormControl, HelpBlock } from 'react-bootstrap';

const FieldGroup = ({ id, label, help, validationState, hasFeedback, ...props }) => {
    return (
        <FormGroup controlId={id} validationState={validationState}>
        <ControlLabel>{label}</ControlLabel>
        <FormControl {...props} />
        {hasFeedback ? <FormControl.Feedback/> : ''}
        {help && <HelpBlock>{help}</HelpBlock>}
        </FormGroup>
    );
}

export default FieldGroup;