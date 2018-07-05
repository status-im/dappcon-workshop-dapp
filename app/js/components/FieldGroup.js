import React from 'react';
import { FormGroup, ControlLabel, FormControl, HelpBlock, InputGroup } from 'react-bootstrap';

const FieldGroup = ({ id, label, help, validationState, hasFeedback, inputAddOn, ...props }) => {

  return (
    <React.Fragment>
      <FormGroup controlId={id} validationState={validationState}>
        <ControlLabel>{label}</ControlLabel>
        
        { inputAddOn ? 
          <InputGroup>
            { inputAddOn.location === 'before' ? <InputGroup.Addon>{ inputAddOn.addOn }</InputGroup.Addon> : '' }
            <FormControl {...props} />
            { inputAddOn.location === 'after' ? <InputGroup.Addon>{ inputAddOn.addOn }</InputGroup.Addon> : '' }
          </InputGroup>
          :
          <FormControl {...props} />
        }
        {hasFeedback ? <FormControl.Feedback /> : ''}
        {help && <HelpBlock>{help}</HelpBlock>}
      </FormGroup>
      
    </React.Fragment>
  );
}

export default FieldGroup;