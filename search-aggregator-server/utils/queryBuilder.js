
const buildQuery = (provider, params) => {
    const  query  = provider.query;
    
    const queries = [];
    const builtQuery = {};
    for (const key in query) {
      if (query.hasOwnProperty(key) && params.hasOwnProperty(key)) {
        // generic query params!
        builtQuery[query[key]] = params[key];
      }
    }
    queries.push(builtQuery)
    if (params.group_size < 12){
      const builtQuery2 = {...builtQuery, group_size: params.group_size +1};
      const builtQuery3 = {...builtQuery, group_size: params.group_size +2};

      queries.push(builtQuery2,builtQuery3)
    }
    return queries;
  };
  
  module.exports = buildQuery;
  