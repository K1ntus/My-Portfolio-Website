var elasticsearch = require('elasticsearch')
var elasticClient = new elasticsearch.Client({
  host: 'elasticsearch:9200',
  log: 'warning',
  sniffOnStart: true
})

module.exports = {
  ping: function (req, res) {
    elasticClient.ping({
        requestTimeout: 30000,
        maxRetries: 5,
      },
      function (error) {
        if (error) {
          console.error("ElasticSearch cluster is down!");
          console.error(error.message)
          return false;
        } else {
          console.log("Success! Elasticsearch cluster is up!");
          return true;
        }
      }
    )
  },

  // 1. Create index
  initIndex: function (req, res, index_name) {
    elasticClient.indices
      .create({
        index: index_name
      })
      .then(
        function (resp) {
          console.log("Successfully Created index: " + index_name);
          return true;
        },
        function (err) {
          console.error("Unable to init index: " + index_name)
          console.error(err.message)
          return false;
        }
      )
  },

  // 2. Check if index exists
  indexExists: function (req, res, index_name) {
    elasticClient.indices
      .exists({
        index: index_name
      })
      .then(
        function (resp) {
          console.log("Index: " + index_name + " already exists!");
          return true;
        },
        function (err) {
          console.error("Index: " + index_name + " does not exist!");
          console.error(err.message)
          return false;
        }
      )
  },

  // 3.  Preparing index and its mapping
  initMapping: function (req, res, index_name, type_name, type_string) {
    elasticClient.indices
      .putMapping({
        index: index_name,
        type: type_name,
        body: { properties: { 'id': { 'type': type_string } } }})
      .then(
        function (resp) {
          console.log("Successfully Created mapping on index: " + index_name);
          return true;
          res.status(200)
          return res.json(resp)
        },
        function (err) {
          console.error("Unable to init mapping on index: " + index_name)
          console.error(err.message)
          return false;
          res.status(500)
          return res.json(err)
        }
      )
  },

  // 4. Add/Update a document
  addDocument: function (req, res, index_name, _id, docType, payload) {
    elasticClient
      .index({
        index: index_name,
        type: docType,
        id: _id,
        body: payload
      })
      .then(
        function (resp) {
          // console.log(resp);
          res.status(200)
          return res.json(resp)
        },
        function (err) {
          // console.log(err.message);
          res.status(500)
          return res.json(err)
        }
      )
  },

  // 5. Update a document
  updateDocument: function (req, res, index, _id, docType, payload) {
    elasticClient.update(
      {
        index: index,
        type: docType,
        id: _id,
        body: payload
      },
      function (err, resp) {
        if (err) return res.json(err)
        return res.json(resp)
      }
    )
  },

  // 6. Search
  search: function (req, res, index_name, docType, payload) {
    elasticClient
      .search({
        index: index_name,
        type: docType,
        body: payload
      })
      .then(
        function (resp) {
          console.log(resp)
          return res.json(resp)
        },
        function (err) {
          console.log(err.message)
          return res.json(err.message)
        }
      )
  },

  /*
   *	[xxxxxxxxxxxxxxxxx=-----  DANGER AREA [RESTRICTED USE] -----=xxxxxxxxxxxxxxxxxxxxx]
   */

  // Delete a document from an index
  deleteDocument: function (req, res, index, _id, docType) {
    elasticClient.delete(
      {
        index: index,
        type: docType,
        id: _id
      },
      function (err, resp) {
        if (err) return res.json(err)
        return res.json(resp)
      }
    )
  },

  // Delete all
  deleteAll: function (req, res) {
    elasticClient.indices.delete(
      {
        index: '_all'
      },
      function (err, resp) {
        if (err) {
          console.error(err.message)
        } else {
          console.log('Indexes have been deleted!', resp)
          return res.json(resp)
        }
      }
    )
  }

  // [xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx]
}
