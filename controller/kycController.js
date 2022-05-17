
const mongoose = require('mongoose')
const models = require("../models/kyc")

const getKYC = async (req, res) => {
    let page = req.query.page;
    let pageSize = req.query.pageSize;
    let total = await models.kycs.count({});
    models.kycs.find({})
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


  const getKYCById = async(req, res) => {
    const id = req.params.id;
    models.kycs.findById(id)
        .then(data => {
            if (!data)
                res.status(200).json({status:"error", message: "KYC not Found "});
            else res.status(200).json({status:"success", data:data});
        })
        .catch(err => {
            res
                .status(500)
                .json({status:"error", message: "Error retrieving KYC " });
        });
  }

  const getKYCByUserId = async(req, res) => {
    const userId = req.params.userId;
    models.kycs.findOne({userId: userId})
     .then(data => {
            if (!data)
                res.status(200).json({status:"error", message: "KYC not Found "});
            else res.status(200).json({status:"success", kyc:data});
        })
        .catch(err => {
            res
                .status(500)
                .json({status:"error", message: "Error retrieving KYC " });
        });
  }
  
  const saveKYC = async(req, res) => {
    try { 

      const keys = ["userId", "first_name", "middle_name", "last_name","dob","country","personal_id","citizen","current_citizen_by","current_resident_by","address_line_1","address_line_2","town","postcode","state","occupation","source_funds","intent_invest","document_type","selfi_url"];
      for (i in keys) {
        if (req.body[keys[i]] === undefined || req.body[keys[i]] === '') {
          res.json({ status: "error", msg: keys[i] + " are required" });
          return;
        }
      } 

     
      const query = {
        userId: req.body.userId,
        first_name: req.body.first_name,
        middle_name: req.body.middle_name,
        last_name: req.body.last_name,
        dob: req.body.dob,
        country: req.body.country,
        personal_id: req.body.personal_id,
        citizen: req.body.citizen,
        current_citizen_by: req.body.current_citizen_by,
        current_resident_by: req.body.current_resident_by,
        // address: req.body.address,
        address_line_1: req.body.address_line_1,
        address_line_2: req.body.address_line_2,
        town:req.body.town,
        postcode:req.body.postcode,
        state:req.body.state,
        occupation: req.body.occupation,
        source_funds: req.body.source_funds,
        intent_invest: req.body.intent_invest,
        document_type: req.body.document_type,
        document_front_url: req.body.document_front_url,
        document_back_url: req.body.document_back_url,
        selfi_url: req.body.selfi_url,
        utility_bill_url: req.body.utility_bill_url,
        bank_statement_url: req.body.bank_statement_url,
        address_proof_url: req.body.address_proof_url,
        comments: "Your Selfi not clear your face. so we are reject your KYC ",
        status: "SUBMITED"
      };

      const checkUser = await models.kycs.findOne({userId:req.body.userId})

   
      if(!checkUser) {

        // console.log("carete function");
        const createKYC = new models.kycs(query);
        const kycInfo = await createKYC.save();
        res.status(201).json({
          status: "success",
          msg: "Success! KYC created",
          data: kycInfo,
        });
      }else{
        const data = await models.kycs.updateOne(
          {
          userId: req.body.userId,
          first_name: req.body.first_name,
          middle_name: req.body.middle_name,
          last_name: req.body.last_name,
          dob: req.body.dob,
          country: req.body.country,
          personal_id: req.body.personal_id,
          citizen: req.body.citizen,
          current_citizen_by: req.body.current_citizen_by,
          current_resident_by: req.body.current_resident_by,
          // address: req.body.address,
          address_line_1: req.body.address_line_1,
          address_line_2: req.body.address_line_2,
          town:req.body.town,
          postcode:req.body.postcode,
          state:req.body.state,
          occupation: req.body.occupation,
          source_funds: req.body.source_funds,
          intent_invest: req.body.intent_invest,
          document_type: req.body.document_type,
          document_front_url: req.body.document_front_url,
          document_back_url: req.body.document_back_url,
          selfi_url: req.body.selfi_url,
          utility_bill_url: req.body.utility_bill_url,
          bank_statement_url: req.body.bank_statement_url,
          address_proof_url: req.body.address_proof_url,
          comments: "Your Selfi not clear your face. so we are reject your KYC ",
          status: "RESUBMITED"
          }
          );
        res.status(201).json({
          status: "success",
          msg: "Success! KYC Update",
          data: data,
        });
        // const kycInfo = await createKYC.save();
      }


      // const createKYC = new models.kycs(query);
      // const checkUser = await models.kycs.findOne({userId:req.body.userId})
      // // if (checkUser == null) {
      //     // const kycInfo = await createKYC.create();
      //     // res.json({ status: 400, msg: 'User not Found' })
      //     // return
      // // }else{
       
      //   const kycInfo = await createKYC.save();
      // // }
      
     
      return;
      
    } catch (error) {
      res.json({
        status: 400,
        msg: error.toString(),
      });
      return;
    }
    
  }


  const updateKYC = async(req, res) => {
    try {
        const keys = ["id","userId", "first_name", "middle_name", "last_name","dob","country","personal_id","citizen","current_citizen_by","current_resident_by","address_line_1","address_line_2","town","postcode","state","occupation","source_funds","intent_invest","document_type","selfi_url"];
        for (i in keys) {
          if (req.body[keys[i]] == undefined || req.body[keys[i]] == "") {
            res.json({ status: "error", msg: keys[i] + " are required" });
            return;
          }
        }
        

        const checkKYC = await models.kycs.findById(req.body.id)
        console.log(checkKYC.length)
        if (checkKYC == null) {
            res.json({ status: 400, msg: 'KYC not Found' })
            return
        }

        const checkUser = await models.kycs.findOne({userId:req.body.userId})
        if (checkUser == null) {
            res.json({ status: 400, msg: 'User not Found' })
            return
        }
        const data = await models.kycs.updateOne(
          {
            _id: req.body.id,
          },
          {
            $set: {
              userId: req.body.userId,
              first_name: req.body.first_name,
              middle_name: req.body.middle_name,
              last_name: req.body.last_name,
              dob: req.body.dob,
              country: req.body.country,
              personal_id: req.body.personal_id,
              citizen: req.body.citizen,
              current_citizen_by: req.body.current_citizen_by,
              current_resident_by: req.body.current_resident_by,
              // address: req.body.address,
              address_line_1: req.body.address_line_1,
              address_line_2: req.body.address_line_2,
              town:req.body.town,
              postcode:req.body.postcode,
              state:req.body.state,
              occupation: req.body.occupation,
              source_funds: req.body.source_funds,
              intent_invest: req.body.intent_invest,
              document_type: req.body.document_type,
              document_front_url: req.body.document_front_url,
              document_back_url: req.body.document_back_url,
              selfi_url: req.body.selfi_url,
              utility_bill_url: req.body.utility_bill_url,
              bank_statement_url: req.body.bank_statement_url,
              address_proof_url: req.body.address_proof_url,
              status: "RESUBMITED",
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
        res.json({ status: 400, msg: "Invalid Value" })
        return
    }
}


  module.exports = {getKYC,getKYCById,saveKYC,updateKYC,getKYCByUserId}


