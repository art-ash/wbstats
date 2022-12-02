const express = require('express');
const axios = require('axios');
const app = express();

app.get('/api/getPopulation/:year/:itemsCount', async (req, res) => {
    const { year, itemsCount } = req.params;
    const url = `https://api.worldbank.org/v2/country/all/indicator/SP.POP.TOTL?date=${year}&per_page=${itemsCount}`;
    const response = await axios.get(url);
    res.set('Content-Type', 'text/xml');
    res.set('Cache-Control', 's-max-age=1, stale-while-revalidate');
    res.send(response.data);
});

app.get('/api/getGdp/:year/:itemsCount', async (req, res) => {
    const { year, itemsCount } = req.params;
    const url = `https://api.worldbank.org/v2/country/all/indicator/NY.GDP.MKTP.CD?date=${year}&per_page=${itemsCount}`;
    const response = await axios.get(url);
    res.set('Content-Type', 'text/xml');
    res.set('Cache-Control', 's-max-age=1, stale-while-revalidate');
    res.send(response.data);
});

app.get('/api/fetchShortWikiInfo/:itemName', async (req, res) => {
    const { itemName } = req.params;
    const url = `https://en.wikipedia.org/w/api.php?format=json&origin=*&action=query&prop=extracts&exintro&explaintext&redirects=1&titles=${itemName}`;
    const response = await axios.get(url);
    res.set('Content-Type', 'text/xml');
    res.set('Cache-Control', 's-max-age=1, stale-while-revalidate');
    res.send(response.data);
});

module.exports = app;
