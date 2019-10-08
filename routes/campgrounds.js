var express=require("express");
var router=express.Router();
var campground=require("../models/campgrounds.js");
var Comment=require("../models/comments.js");
var middleware = require("../middleware");




router.get("/",function(req, res){ //campground page
	campground.find({}, function(err, allCampground){
		if(err)
			req.flash("error", "OOPS an error occured");
		else
			res.render("index.ejs", {campgrounds:allCampground, currentUser:req.user});//passing array
	});
});

router.post("/", middleware.isLoggedIn, function(req, res){
	var name=req.body.name;//check name in new.ejs
	var price=req.body.price;
	var image=req.body.image;
	var description=req.body.description;
	var author={
		id:req.user._id,
		username:req.user.username
	}
	
	var newCampground={name:name ,price:price, image:image , description:description, author:author}; //creating an element of campground array
	campground.create(newCampground, function(err, newData){
		if(err)
			req.flash("error", "OOPS an error occured");
		else
			res.redirect("/campgrounds");
	});
});

//CREATE - add new campground to DB

router.get("/new", middleware.isLoggedIn, function(req, res){
	res.render("new.ejs");
});

router.get("/:id", function(req, res){
	campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
		if(err || !foundCampground){
			req.flash("error", "OOPS an error occured");
			res.redirect("back");
		}
		
		
		else{
			res.render("show.ejs", {campground /*inside show.ejs*/: foundCampground});
			//console.log(foundCampground);
		}
	});
});
router.get("/:id/edit", middleware.checkCampgroundOwnership,function(req, res){
	campground.findById(req.params.id, function(err, foundCampground){
		if(err){
			req.flash("error", "OOPS an error occured");
			res.redirect("/");
		}else
			
			res.render("editCamp.ejs", {campground:foundCampground});
	});
});
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
    // find and update the correct campground
    campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
       if(err){
		  req.flash("error", "OOPS an error occured");
           res.redirect("/campgrounds");
       } else {
           //redirect somewhere(show page)
		   console.log(req.body.campground);
		   req.flash("success", "Successfully edited");
           res.redirect("/campgrounds/" + req.params.id);
       }
    });
});

router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
   campground.findByIdAndRemove(req.params.id, function(err){
      if(err){
		  req.flash("error", "OOPS an error occured");
          res.redirect("/campgrounds");
      } else {
          res.redirect("/campgrounds");
      }
   });
});

module.exports=router;