import React, { Component } from 'react';
import {Grid, Row, Col, PageHeader} from 'react-bootstrap';

class Home extends Component{

  constructor(props){
    super(props);
  }
  render() {
    return (
      <Grid>
        <Row>
          <Col xs={10}>
            <PageHeader>
              Decentralised Twitter <small>Built using Embark by Status</small>
            </PageHeader>
          </Col>
        </Row>
      </Grid>
    );
  }
}

export default Home