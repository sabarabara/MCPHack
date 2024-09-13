import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import App1 from './comp1/App';
import App2 from './comp2/App';
import App3 from './comp3/App';
import App4 from './comp4/App';
import App5 from './comp5/App';
import App6 from './comp6/App';

ReactDOM.render(
  <Router>
    <Routes>
      <Route path="/" element={<App1 />} />
      <Route path="/page2" element={<App2 />} />
      <Route path="/page3/:text" element={<App3 />} />
      <Route path="/page4" element={<App4 />} />
      <Route path="/page5" element={<App5 />} />
      <Route path="/page6" element={<App6 />} />
    </Routes>
  </Router>,
  document.getElementById('root')
);