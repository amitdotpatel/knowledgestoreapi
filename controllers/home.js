/*
* purpose - home controller
* created on 17 Oct 2013
* */

//get - "/"
exports.index = function(req, res){
  if(req.user){
      res.send("Let's start creating awesome, " + req.user.firstName);
  } else {
      res.send("User not found. Did not login yet");
  }

}
