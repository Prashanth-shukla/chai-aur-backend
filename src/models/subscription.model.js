import mongoos,{Schema} from "mongoos"

const subscriptionSchema=new Schema({
    subscriber:{
        type:Schema.Types.ObjectId,//one who is suscribing
        ref:"User"
    },
    channel:{
        type:Schema.Types.ObjectId,//one who is suscribing
        ref:"User"
    }
},{timestamps:true})




export const Subscription=mongoose.model("Substription",subscriptionSchema)