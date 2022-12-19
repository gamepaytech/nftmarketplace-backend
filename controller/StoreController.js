const Store =  require("../models/Store")


const gpyStore = async (req,res) => {
    try{
        const {
            purchase,
            available
        } = req.body

        const store =  new Store({
            purchase,
            available
        });

        const data = await store.save();
        return res.status(201).json({
            status: "200",
            msg: "successfully.",
            data: data,
        });
    }
    catch (err) {
        res.status(500).json("error")
        console.log(err);
    }
}

module.exports = { gpyStore }