const searchService = require('../services/searchService');

let clients = {}
class SearchController {
  

  async search(req, res) {

    const searchTerm = JSON.parse(req.query.searchTerm);
    const userId = searchTerm.id;
    const clientRes = clients[userId];
    if (!clientRes) {
      res.status(400).json({ message: 'No client subscribed with this ID' });
      return;
    }
    try {
      await searchService.fetchResults(searchTerm, clientRes);
      res.json({ message: 'Search initiated' });
  
    } catch (error) {
      console.error('Search error:', error);
      res.write(`event: error\ndata: ${JSON.stringify({ message: 'Internal Server Error' })}\n\n`);
    } finally {
      res.end();
    }
  }
  async subscribe(req,res){
    const id = req.query.id
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
  
    // Send a comment to keep the connection alive
    res.write(':ok\n\n');
  
    // Add client to the list
    clients[id] = res;
    // console.log(clients)
    // Remove client on close
    req.on('close', () => {
      delete clients[id]
    });
  }
}

module.exports = new SearchController();
