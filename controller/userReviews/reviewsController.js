const logger = require('../../logger')
const userReview = require('../../models/userReviews/reviews')

const submit = async(req,res) =>{
  try{
    comment = req.body.comment;
    rating = req.body.rating;
    gamePlay = req.body.gameplay;
    complexity = req.body.complexity;
    earningPotential = req.body.earningpotential;
    costEffective = req.body.costeffective,
    users = req.body.users;
    games = req.body.games;

    if (!comment) {
      res.json({ status: 400,
         msg: 'Comment is required'
         })
      return
     }
    if (!rating) {
      res.json({ status: 400,
        msg: 'Rating Review is required'
        })
      return
     }
    if (!gamePlay) {
      res.json({ status: 400,
        msg: 'GamePlay Review is required '
        })
      return
     }
    if (!complexity) {
      res.json({ status: 400,
        msg: 'Complexity Review is required'
        })
      return
     }
    if (!earningPotential) {
      res.json({ status: 400,
        msg: 'EarningPotential Review is required'
        })
      return
     }
    if (!costEffective) {
      res.json({ status: 400,
        msg: 'CostEffective Review is required'
        })
      return
     }

    const submit = new userReview({
      comment : comment,
      rating : rating,
      gamePlay : gamePlay,
      complexity : complexity,
      earningPotential : earningPotential,
      costEffective : costEffective,
      users : users,
      games : games
    })

     const data = await submit.save();
     res.status(201).json({
      status: "200",
      msg: "Data saved successfully!",
      data: data
     });
     return;
  }
  catch (error) {
    console.log(error);
   res.status(500).json({
    err:"Internal Server Error"
  });
   }
}

const reviews = async(req,res)=>{
  try{
    const reviews = await userReview.find()
    .populate("users")
    .populate("games")
    .sort({ createdAt : -1})
    .limit(5);
    res.status(200).json({
       data : reviews,
       msg: "Success"
      });
    return;
  }
  catch(err){
     // logger.error(error);
    console.log(err);
    res.status(500).json({err:"Internal Server Error"})
  }
};



module.exports = { submit, reviews }