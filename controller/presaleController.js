
const models = require("../models/presaleTier.js")

const getPresale = async (req, res) => {
    let page = req.query.page;
    let pageSize = req.query.pageSize;
    let total = await models.presaletiers.count({});
    models.presaletiers.find({})
      // .select("name")
      .sort({ name: "asc" })
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

  const updatePresale = async(req, res) => {
    try {
        const data = await models.presaletiers.updateOne(
          {
            _id: req.body.id,
          },
          {
            $set: {
              tier_type: req.body.tier_type,
              quantity: req.body.quantity,
              price: req.body.price,
              duration_in_days: req.body.duration_in_days,
            },
          }
        );
        res.json({
            status:"success",
            msg: 'Success',
            data: data,
        })

        return
    } catch (err) {
        console.log(err)
        res.json({ status: 400, msg: 'Something went wrong' })
        return
    }
}


  module.exports = {getPresale,updatePresale}


