var express     		  =require("express"),
	app		   			  =express(),
	bodyParser 			  =require("body-parser"),
	mongoose   			  =require("mongoose"),
	campground 			  =require("./models/campgrounds.js"),
	seedDB     			  =require("./seed"),
	flash       		  = require("connect-flash"),
	Comment    			  =require("./models/comments.js"),
	passport			  =require("passport"),
	localStrategy         =require("passport-local"),
	//passportLocalMongoose =require("passport-local-mongoose"),
	User				  =require("./models/user.js"),
	campgroundRoute=require("./routes/campgrounds"),
	commentRoute=require("./routes/comments"),
	indexRoute=require("./routes/index"),
	methodOverride   = require("method-override");


app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride("_method"));

//mongoose.connect("mongodb://localhost/Campooo");
//mongodb+srv://yash:<password>@campooo-ejfxp.mongodb.net/test?retryWrites=true&w=majority
// app.use(express.static(__dirname + "/public"));
mongoose.connect('mongodb+srv://yash:pass@campooo-ejfxp.mongodb.net/test?retryWrites=true&w=majority', {
	useNewUrlParser: true,
	useCreateIndex: true
}).then(() => {
	console.log('Connected to DB!');
}).catch(err => {
	console.log('ERROR:', err.message);
});


app.use(require("express-session")({
    secret: "HI",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(flash());



app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   res.locals.error = req.flash("error");
   res.locals.success = req.flash("success");
   next();
});

 // seedDB();
app.use("/",indexRoute);
app.use("/campgrounds", campgroundRoute);
app.use("/campgrounds/:id/comment", commentRoute);
app.listen(process.env.PORT || 9000, function(){
	console.log("Server has started");
});