const axios = require('axios');
const providers = require('../config/apiProviders');
const buildQuery = require('../utils/queryBuilder');
const crypto = require('crypto');
const TinyQueue = require('tinyqueue');

class SearchService {
  constructor() {
    this.cache = {};
    this.seenAccommodations = new Map();
    this.aggregatedResults = new TinyQueue([], (a, b) => a.price - b.price);
  }

  async fetchResults(searchTerm, res) {
    try {
      // Clear previous results and cache for new search
      this.seenAccommodations.clear();
      this.aggregatedResults = new TinyQueue([], (a, b) => a.price - b.price);
      this.cache = {};

      const fetchPromises = providers.map(provider => this.fetchDataFromProvider(provider, searchTerm, res));
      await Promise.all(fetchPromises);
      res.write(`event: finished\ndata: {}\n\n`);
    } catch (error) {
      console.error('Error fetching results:', error);
      res.write(`event: error\ndata: {"error": "${error.message}"}\n\n`);
    }
  }

  async fetchDataFromProvider(provider, params, res) {
    try {
      const queries = buildQuery(provider, params);

      for (const query of queries) {
        console.log(`Fetching data for query: ${query}`); // Log the query

        if (this.cache[query]) {
          console.log(`Using cached results for query: ${query}`); // Log cache usage
          this.aggregateAndSendResults([{ provider: provider.name, data: this.cache[query] }], res);
          continue;
        }

        const requestBody = { query };
        try {
          const response = await axios.post(provider.url, requestBody, { timeout: 15000 });
          const responseData = response.data?.body?.accommodations || [];
          this.cache[query] = responseData;
          this.aggregateAndSendResults([{ provider: provider.name, data: responseData }], res);
        } catch (error) {
          console.error(`Error fetching data from ${provider.name}:`, error.message);
          this.aggregateAndSendResults([{ provider: provider.name, error: error.message }], res);
        }
      }
    } catch (error) {
      console.error(`Error fetching data from ${provider.name}:`, error.message);
      this.aggregateAndSendResults([{ provider: provider.name, error: error.message }], res);
    }
  }

  aggregateAndSendResults(results, res) {
    results.forEach(result => {
      if (result.data) {
        result.data.forEach(accommodation => {
          const uniqueId = this.generateUniqueId(accommodation);
          const groupSize = accommodation.group_size;
          const price = accommodation.price;
          
          const uniqueKey = `${uniqueId}-${groupSize}-${price}`;

          if (!this.seenAccommodations.has(uniqueKey)) {
            this.seenAccommodations.set(uniqueKey, accommodation);
            this.aggregatedResults.push(accommodation);
          }
        });
      }
    });

    const sortedResults = [];
    while (this.aggregatedResults.length) {
      sortedResults.push(this.aggregatedResults.pop());
    }
    this.aggregatedResults = sortedResults

    res.write(`data: ${JSON.stringify(sortedResults)}\n\n`);
  }

  generateUniqueId(accommodation) {
    // Create a hash of the accommodation object to ensure uniqueness
    const hash = crypto.createHash('sha256');
    hash.update(JSON.stringify(accommodation));
    return hash.digest('hex');
  }
}

module.exports = new SearchService();
