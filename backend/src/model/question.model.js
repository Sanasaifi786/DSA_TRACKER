import mongoose,{Schema} from "mongoose";

const questionSchema = new Schema({
    title:{
        type: String,
        required: true,
        trim:true
    },
    topic:{
        type:String,
        required: true,
        trim:true
    },
    difficulty:{
        type: String,
        required: true,
        enum: ['Easy','Medium','Hard']
    },
    link:{
        type :String
    },
    order:{
        type:Number,
        required:true
    },

},{
    timestamps:true
})

export const Question = mongoose.model("Question",questionSchema);