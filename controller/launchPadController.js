
const models = require("../models/launchpads")




 const getLaunchPad = async (req, res) => {
    let page = req.query.page;
    let pageSize = req.query.pageSize;
    let total = await models.launchpads.count({});
    models.launchpads.find({})
      // .select("name")
      .sort({ price:1 })
      .limit(pageSize)
      .skip(pageSize * page)
      .then((results) => {
        return res
          .status(200)
          .json({ status:"success", total: total, page: page, pageSize: pageSize, data: results });
      })
      .catch((err) => {
        return res.status(500).send(err);
      });
  };


  const getLaunchPadById = async(req, res) => {
    const id = req.params.id;
    models.launchpads.findById(id)
        .then(data => {
            if (!data) {
                res.status(200).json({status:"error", message: "Not found Campaign with id " + id });
            } else  {
              data['current_date'] = new Date().toISOString();
              res.status(200).json({status:"success", data:data})
            }
        })
        .catch(err => {
            res
                .status(500)
                .json({status:"error", message: "Error retrieving Campaign with id=" + id });
        });
  }

  module.exports = {getLaunchPad,getLaunchPadById}


