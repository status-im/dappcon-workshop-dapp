import Header from './Header'
import Main from './Main'

import {DTwitter} from 'Embark/contracts';
import EmbarkJS from 'Embark/EmbarkJS';
import React from 'react';

window.EmbarkJS = EmbarkJS;
window.DTwitter = DTwitter;

const App = () => (
  <div>
    <Header />
    <Main />
  </div>
)

export default App