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
        required: true
    },
    link:{
        type :String,
        enum: ['Easy','Medium','Hard']
    },
    order:{
        type:Number,
        required:true
    },

},{
    timestamps:true
})

export const Question = mongoose.model("Question",questionSchema);