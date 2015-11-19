'use strict';

(function () {

  /**
   * Retrieves area information by area id.
   * @param req
   * @param res
   */
  exports.byId = function (req, res) {

    var areaId = req.params.id;

    db.Area.find({
      where: {
        id: areaId
      },
      order: [['title', 'ASC']]
    }).then(function (tags) {
      // JSON response
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.end(JSON.stringify(tags));

    });
  };

  /**
   * Retrieves a list of all areas.
   * @param req
   * @param res
   */
  exports.list = function (req, res) {

    db.Area.findAll({
      order: [['position', 'ASC']]
    }).then(function (tags) {
      // JSON response
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.end(JSON.stringify(tags));

    });
  };

  /**
   * Adds new area, setting the area position to the
   * end of the current area list.
   * @param req
   * @param res
   */
  exports.add = function (req, res) {

    var title = req.body.title;

    db.Area.findAll()
      .then(function (result) {
        addArea(result.length + 1);
      })
      .error(function (err) {
        console.log(err);
      });

    function addArea(position) {
      db.Area.create({
        title: title,
        position: position
      }).then(function () {
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.end(JSON.stringify({status: 'success'}));
      }).error(function (err) {
        console.log(err);
      });
    }

  };

  /**
   * Updates an existing area.
   * @param req
   * @param res
   */
  exports.update = function (req, res) {
    var title = req.body.title;
    var url = req.body.url;
    var searchUrl = req.body.searchUrl;
    var description = req.body.description;
    var linkLabel = req.body.linkLabel;
    var id = req.body.id;

    db.Area.update({
        title: title,
        url: url,
        linkLabel: linkLabel,
        searchUrl: searchUrl,
        description: description
      },
      {
        where: {
          id: id
        }
      }).then(function (result) {
      // JSON response
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.end(JSON.stringify({status: 'success', id: result.id}));
    });
  };

  /**
   * Updates area position to new value based on the
   * order of the new array passed in via POST. The new position
   * can be used to order query results for clients (order by position).
   * Requires bluebird Promise library.
   * @param req
   * @param res
   */
  exports.reorder = function (req, res) {

    var areas = req.body.areas;
    var areaCount = areas.length;
    console.log('area count ' + areaCount);
    console.log(Promise.method);

    /**
     * Promise method that returns the count value if the
     * limit condition has not been reached.
     */
    var promiseFor = db.sequelize.Promise.method(function (condition, action, value) {
      // limit reached
      if (!condition(value)) {
        return value;
      }
      // continue with action
      return action(value).then(promiseFor.bind(null, condition, action));
    });

    promiseFor(function (count) {
        // Test for limit (condition)
        return count < areaCount;
      },
      // Do update (action)
      function (count) {
        return db.Area.update(
          {
            // position attribute based on current array index
            position: count + 1
          },
          {
            where: {
              id: areas[count].id
            }
          })
          .then(function () {
            // Return the incremented count value
            return ++count;
          });
      },
      // initialize count value
      0).then(
      // called Promise method after limit is reached.
      function () {
        // JSON response
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.end(JSON.stringify({status: 'success'}));
      })
      .error(function (err) {
        console.log(err);
      });


  };

  /**
   * Delete an area.
   * @param req
   * @param res
   */
  exports.delete = function (req, res) {

    var id = req.body.id;

    db.Area.destroy({
      where: {
        id: id
      }
    }).then(function () {
      // JSON response
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.end(JSON.stringify({status: 'success'}));
    });
  };


})();
