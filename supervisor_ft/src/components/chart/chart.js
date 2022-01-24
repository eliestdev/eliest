import React, { useState } from 'react'
import { Bar } from 'react-chartjs-2';

const rand = () => Math.floor(Math.random() * 255);

const options = {
    scales: {
        yAxes: [
            {
                ticks: {
                    beginAtZero: true,
                },
            },
        ],
    },
};

const getChartDate = () => {
    var timestamp = 1633000767;
    var a = new Date(timestamp * 1000);
    var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    var dayOfWeek = days[a.getDay()]
    return dayOfWeek;
}

const addDays = (date, days) => {
    var result = new Date(date * 1000);
    result.setDate(result.getDate() + days);
    return result;
}

const Chart = ({ transactions }) => {
    // findDate(1633000767);
    const amounts = transactions.map(a => a.amount);

    const genData = () => ({
        labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        datasets: [
            {
                type: 'line',
                label: 'This Week\'s funding',
                borderColor: `rgb(${rand()}, ${rand()}, ${rand()})`,
                borderWidth: 2,
                fill: false,
                data: amounts,
            },
            // {
            //     type: 'line',
            //     label: 'Last Week\'s funding',
            //     borderColor: `rgb(${rand()}, ${rand()}, ${rand()})`,
            //     borderWidth: 2,
            //     fill: false,
            //     data: [rand(), rand(), rand(), rand(), rand(), rand(), rand()],
            // },
        ],
    });

    const data = genData();

    const [clickedDataset, setClickedDataset] = useState('');
    const [clickedElement, setClickedElement] = useState('');
    const [clickedElements, setClickedElements] = useState('');

    const getDatasetAtEvent = dataset => {
        if (!dataset.length) return;

        const datasetIndex = dataset[0].datasetIndex;
        setClickedDataset(data.datasets[datasetIndex].label);
    };

    const getElementAtEvent = element => {
        if (!element.length) return;

        const { datasetIndex, index } = element[0];
        setClickedElement(
            `${data.labels[index]} - ${data.datasets[datasetIndex].data[index]}`
        );
    };

    const getElementsAtEvent = elements => {
        if (!elements.length) return;

        setClickedElements(elements.length);
    };

    return (
        <Bar
            data={data}
            options={options}
            getDatasetAtEvent={getDatasetAtEvent}
            getElementAtEvent={getElementAtEvent}
            getElementsAtEvent={getElementsAtEvent}
        />
    );
}

export default Chart