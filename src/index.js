import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

const SHADESOFBLUE = [
    ["Blue", "#0000FF"],
    ["Slate", "#708090"],
    ["Sky", "#87ceeb"],
    ["Navy", "#0A1172"],
    ["Indigo", "#4B0082"],
    ["Cobalt", "#0047ab"],
    ["Teal", "#008080"],
    ["Ocean", "#006699"],
    ["Peacock", "#005f69"],
    ["Azure", "#007FFF"],
    ["Cerulean", "#007ba7"],
    ["Lapis", "#26619c"],
    ["Spruce", "#44575c"],
    ["Stone", "#888c8d"],
    ["Aegean", "#468fa2"],
    ["Berry", "#4f86f7"],
    ["Denim", "#1560bd"],
    ["Admiral", "#2c3863"],
    ["Sapphire", "#0f52ba"],
    ["Arctic", "#5ea3b3"]
];

ReactDOM.render(
    <React.StrictMode>
        <App SHADESOFBLUE={SHADESOFBLUE}/>
    </React.StrictMode>,
    document.getElementById('root')
);
