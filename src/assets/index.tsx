import * as React from 'react';
import * as ReactDOM from 'react-dom';
import BusybeeTestResultsComponent from 'busybee-results-react';
import 'bootstrap/dist/css/bootstrap.min.css'

declare module window {
    const busybeeResults:any;
}

ReactDOM.render(<BusybeeTestResultsComponent results={window.busybeeResults} />, document.getElementById('app'));