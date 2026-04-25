import * as React from 'react';
import { createRoot } from 'react-dom/client';
import BusybeeTestResultsComponent from 'busybee-results-react';
import 'bootstrap/dist/css/bootstrap.min.css';

declare namespace window {
    const busybeeResults: any;
}

createRoot(document.getElementById('app')!).render(
    <BusybeeTestResultsComponent results={window.busybeeResults} />
);
