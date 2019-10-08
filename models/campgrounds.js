var mongoose= require("mongoose");
var campgroundSchema = new mongoose.Schema({ //DB Schema
	name: String,
	price:String,
	image: String,
	description: String,
	author: {
		id:{
			type: mongoose.Schema.Types.ObjectId,
            ref: "User"
		},
		username:String
	},
	
	comments : [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Comment"
		}
	]
});
module.exports = mongoose.model("campground", campgroundSchema);
