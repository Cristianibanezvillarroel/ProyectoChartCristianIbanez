import { fetchApi } from "./fetch.js";

const url = 'https://calendarific.com/api/v2/countries?api_key=aKBsNd6nSiKHYGM3jt0MNRpSUbXScXmi';
fetchApi(url)
    .then(data => renderData(data));

function renderData(data) {
    const objectCountries = data;
    const arrayCountries = objectCountries.data.response.countries;
    let countries = [];
    let totalholidays = [];
    countries = arrayCountries.map(country => country.country_name);
    totalholidays = arrayCountries.map(country => country.total_holidays);
    
    const dataTableTittle = document.querySelector('#table-tittle')
    let htmlTittle = '';
    htmlTittle += `<th>Pais</th>
             <th style="text-align: left;">Total Feriados</th>`;
    dataTableTittle.innerHTML = htmlTittle;

    const dataTable = document.querySelector('#table-data');
    let html = '';
    let sumHolydaysTotal = 0;
    let sumCountriesTotal = 0;
    arrayCountries.forEach(country => {
        sumCountriesTotal ++;
        sumHolydaysTotal = sumHolydaysTotal + parseInt(country['total_holidays']);
        html += `<tr><td>${country['country_name']}</td><td style="text-align: left;">${country['total_holidays']}</td></tr>`;
    });
    dataTable.innerHTML = html;

    let averageHolydays = sumHolydaysTotal/sumCountriesTotal;
    document.querySelector('#input-average').value = averageHolydays;
    
    const dataSelect = document.querySelector('select');
    let htmlOptions = '';
    htmlOptions += '<option value=0>Todos</option>';
    arrayCountries.forEach(country => {
        htmlOptions += `<option value=${country['iso-3166']}>${country['country_name']}</option>`;
    });
    dataSelect.innerHTML = htmlOptions;

    let canvas = document.createElement('canvas');
    canvas.id='myChart';
    document.querySelector('#canvas').appendChild(canvas);
    
    const ctx = document.getElementById('myChart');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: countries,
            datasets: [{
                label: '# Total Feriados',
                data: totalholidays,
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

document.querySelector('#button-function').addEventListener('click', async function(){
    let country = document.querySelector('select').value;
    if(country == 0) {
        window.location.reload();
        die();
    };
    let countrySelect = document.querySelector('select');
    let countryText = countrySelect.options[countrySelect.selectedIndex].text;

    let year = document.querySelector('#year').value;
    if (year === '' || year < 2014) return alert('debe registrar un año superior al año 2013');
    const result = await fetch(`https://calendarific.com/api/v2/holidays?&api_key=aKBsNd6nSiKHYGM3jt0MNRpSUbXScXmi&country=${country}&year=${year}`);
    const data = await result.json();
    
    const objectCountry = data;
    const arrayHolydays = objectCountry.response.holidays;
    let holidays = [];
    holidays = arrayHolydays.map(holiday => holiday.name);

    const dataTableTittle = document.querySelector('#table-tittle')
    let htmlTittle = '';
    htmlTittle += `<th style="width: 100px">Numero</th>
             <th style="text-align: left;">Nombre</th>`;
    dataTableTittle.innerHTML = htmlTittle;

    const dataTable = document.querySelector('#table-data');
    let html = '';
    let sumHolidaysCountry = 0;
    arrayHolydays.forEach((holiday,indice) => {
        sumHolidaysCountry ++;
        html += `<tr><td style="width: 100px">${indice + 1}</td><td style="text-align: left;">${holiday['name']}</td></tr>`;
    });
    dataTable.innerHTML = html;

    let averageCountries = document.querySelector('#input-average').value;
    let nameCountryAverage = 'Promedio Mundial';
    let arrayLabels = [nameCountryAverage, countryText];
    let arrayData = [averageCountries, sumHolidaysCountry];

    document.getElementById('myChart').remove();
    let canvas = document.createElement('canvas');
    canvas.id='myChart';
    document.querySelector('#canvas').appendChild(canvas);

    const ctx = document.getElementById('myChart');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: arrayLabels,
            datasets: [{
                label: '# Total Feriados',
                data: arrayData,
                borderWidth: 1,
                backgroundColor: ['rgba(255, 159, 64, 0.2)','rgba(167, 157, 148, 1)']
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
});