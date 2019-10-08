var express=require ("express");
var router=express.Router({mergeParams: true});
var campground=require("../models/campgrounds.js");
var Comment=require("../models/comments.js");
var middleware = require("../middleware");


router.get("/new", middleware.isLoggedIn, function(req, res){
	campground.findById(req.params.id, function(err, foundCampground){
		if(err){
			req.flash("error", err.message);
		}
		else{
			res.render("newCom.ejs", {campground /*inside show.ejs*/: foundCampground});
			//console.log(foundCampground);
		}
	});
});

router.post("/", function(req, res){
   //lookup campground using ID
   campground.findById(req.params.id, function(err, campground){
       if(err){
           console.log(err);
		   	req.flash("error", err.message);
           res.redirect("/campgrounds");
       } else {
        Comment.create(req.body.comment, function(err, comment){
           if(err){
               console.log(err);
           } else {
			   console.log(req.user.username);
			   comment.author.id = req.user._id;
               comment.author.username = req.user.username;
             
               comment.save();
               campground.comments.push(comment);
               campground.save();
			   req.flash("success", "Successfully added comment");
               res.redirect('/campgrounds/' + campground._id);
           }
        });
       }
   });
 
});

router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
	campground.findById(req.params.id, function(err, foundCampground){
		if(err|| !foundCampground){
			req.flash("error", "campground not found");
			res.redirect("back");
		}Comment.findById(req.params.comment_id, function(err, foundComment){
		  if(err){
			  req.flash("error", err.message);
			  res.redirect("back");
		  } else {
			res.render("editCom.ejs", {campground_id: req.params.id, comment: foundComment});
		  }
	   });
});

		
	});
   
// COMMENT UPDATE
router.put("/:comment_id", middleware.checkCommentOwnership,  function(req, res){
   Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
      if(err){
		  req.flash("error", "OOPS an error occured");
          res.redirect("back");
      } else {
          res.redirect("/campgrounds/" + req.params.id );
      }
   });
});

// COMMENT DESTROY ROUTE
router.delete("/:comment_id",  middleware.checkCommentOwnership, function(req, res){
    //findByIdAndRemove
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
       if(err){
		   req.flash("error", "OOPS an error occured");
           res.redirect("back");
       } else {
		   req.flash("success", "Comment deleted");
           res.redirect("/campgrounds/" + req.params.id);
       }
    });
});


module.exports=router;