const mongoose = require('mongoose')
const Schema = mongoose.Schema

const kycSchema = new Schema(
    {
        id: { type: Number },
        userId: { type: String, required: true },
        first_name: { type: String, required: true },
        middle_name: { type: String},
        last_name: { type: String, required: true },
        dob: { type: String, required: true },
        country: { type: String},
        phone_number: { type: String},
        citizen: { type: String, required: true },
        current_citizen_by: { type: Boolean },
        current_resident_by: { type: String, required: true },
        // address: { type: String, required: true },
        address_line_1: { type: String, required: true },
        address_line_2: { type: String, required: true },
        town: { type: String, required: true },
        postcode: { type: String, required: true },
        state: { type: String, required: true },
        occupation: { type: String, required: true },
        source_funds: { type: String, required: true },
        intent_invest: { type: String, required: true },
        document_type: { type: String, required: true },
        document_front_url: { type: String },
        document_back_url: { type: String },
        selfi_url: { type: String, required: true },
        utility_bill_url: { type: String },
        bank_statement_url: { type: String },
        address_proof_url: { type: String },
        comments:{type:String},
        status: { type: String }
    },
    { timestamps: true }
)


module.exports = {
    kycs: mongoose.model('kycs', kycSchema),
}
