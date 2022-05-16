const Influencer = require("../models/influencer");



const saveInfluencer = async (req, res, next) => {

    const keys = [ "userId", "userName", "firstName", "lastName", "email", "phoneNumber" ];
    for (i in keys) {
      if (req.body[keys[i]] == undefined || req.body[keys[i]] == "") {
        res.json({ status: "error", msg: keys[i] + " are required" });
        return;
      }
    }

    const { userId, userName, firstName, lastName, email, phoneNumber, businessName, businessAddress, businessPhoneNumber, businessEmail, facebook, instagram, twitter, youtube, telegram, discord, tikTok } = req.body;

    try {

        const influencer = await Influencer.findOne({ userId: userId })

        if (influencer) {

            influencer["userId"] = userId;
            influencer["userName"] = userName;
            influencer["firstName"] = firstName;
            influencer["lastName"] = lastName;
            influencer["email"] = email;
            influencer["phoneNumber"] = phoneNumber;
            influencer["businessName"] = businessName;
            influencer["businessAddress"] = businessAddress;
            influencer["businessPhoneNumber"] = businessPhoneNumber;
            influencer["businessEmail"] = businessEmail;
            influencer["facebook"] = facebook;
            influencer["instagram"] = instagram;
            influencer["twitter"] = twitter;
            influencer["youtube"] = youtube;
            influencer["telegram"] = telegram;
            influencer["discord"] = discord;
            influencer["tikTok"] = tikTok;


            await influencer.save()

            return res.send({ message: "influencer updated successfully", influencer: influencer })

        } else {

            const newInfluencer = new Influencer({
                 userId: userId,
                 userName: userName,
                 firstName: firstName,
                 lastName: lastName,
                 email: email,
                 phoneNumber: phoneNumber,
                 businessName: businessName,
                 businessAddress: businessAddress,
                 businessPhoneNumber: businessPhoneNumber,
                 businessEmail: businessEmail,
                 facebook: facebook,
                 instagram: instagram,
                 twitter: twitter,
                 youtube: youtube,
                 telegram: telegram,
                 discord: discord,
                 tikTok: tikTok

            })

            await newInfluencer.save()

            return res.send({ message: "influencer created successfully", influencer: newInfluencer })

        }

    } catch (err) {

        if (!err.statusCode) {
            err.statusCode = 500;
        }

        res.status(500).send({err, message: "some error occured"})

    }
}

module.exports = {saveInfluencer}
