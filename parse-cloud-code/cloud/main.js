
// Use Parse.Cloud.define to define as many cloud functions as you want.
// For example:
Parse.Cloud.define("hello", function(request, response) {
  response.success("Hello world!");
});

Parse.Cloud.define("castvote", function(request, response){

	//get request params
	var city = request.params.city;
	var party = request.params.party;
	var uuid = request.params.uuid;
	var status = "pending";
	var activationCode = Math.floor(Math.random()*90000) + 10000;

	//allow master opperations
	Parse.Cloud.useMasterKey();

	//check if vote with this uuid exist
	var votes = Parse.Object.extend('Votes');
	var query = new Parse.Query(votes);
	query.equalTo("userUUID", uuid);
	query.first({
      success: function(oldVote) {
        if (oldVote) {
        	//this vote is not uniquee so update instead
        	oldVote.set('city', city);
			oldVote.set('party', party);
			oldVote.save().then(function(){
				//ssend activation code
				sendActivationCode(uuid, oldVote.get('activationCode')).then(function(){
					response.success("Activation code send successfully");
				},function(error){
					response.error(error);
				});

				response.success("Vote saved successfully as updated vote");
			},function(error){
				response.error(error);
			});
        	
        } else {
        	
        	//if this vote is unique
        	var newVote  = new Parse.Object('Votes');
			newVote.save({
				city: city,
				party: party,
				userUUID: uuid,
				status: status,
				activationCode: activationCode.toString(),

			}).then(function(){
				//ssend activation code
				sendActivationCode(uuid, activationCode.toString());

				response.success("Vote saved successfull as new vote");
			},function(error){
				response.error(error);
			});
        }
      },
      error: function(error) {
        response.error("Error while trying to check uniquee id of vote");
      }
    });
	//var txt = "Ok this is why i got someone("+uuid+") form "+city+" voted for "+party+" but status is still "+status+" need to use "+activationCode;
});


Parse.Cloud.define("sendcode", function(request, response){
	var uuid = "0f3dd070-cf7e-63ab-5356-620052199291";
	sendActivationCode(uuid, "3131").then(function(){
		response.success("send ok")
	}, function(error){
		response.error(error);
	});
})

Parse.Cloud.define("activatevote", function(request, response){

	//get request params
	var activationCode = request.params.code;
	var uuid = request.params.uuid;

	//allow master opperations
	Parse.Cloud.useMasterKey();

	//check if vote with this uuid exist
	var votes = Parse.Object.extend('Votes');
	var query = new Parse.Query(votes);
	query.equalTo("userUUID", uuid);
	query.first({
      success: function(oldVote) {
        if (oldVote) {
        	//this vote is not uniquee so update instead
        	var oldCode = oldVote.get('activationCode');
        	if(oldCode === activationCode)
        	{
        		oldVote.set('status', 'approved');
        		oldVote.save().then(function()
        		{
					response.success("Vote is activated successfully!");
				},function(error){
					response.error(error);
				});
        	}
        	else
        	{
        		response.error("Activation code is not correct");
        	}
        	
        } else {
        	response.error("No vote found with provided information.");
        }
      },
      error: function(error) {
        response.error("Error while trying to get vote information");
      }
    });
	//var txt = "Ok this is why i got someone("+uuid+") form "+city+" voted for "+party+" but status is still "+status+" need to use "+activationCode;
});






/*=========================================== Push Notifications ======================================================================*/

var sendActivationCode = function(uuid, activationCode){
	var query = new Parse.Query(Parse.Installation);
	query.equalTo('installationId', uuid);
	 
	return Parse.Push.send({
	  where: query, // Set our Installation query
	  data: {
	    alert: "Onay Kodu: "+activationCode,
	  }
	}, {
	  success: function() {
	    // Push was successful
	  },
	  error: function(error) {
	    // Handle error
	  }
	});
}











/*=========================================== Background Jobs ======================================================================*/

Parse.Cloud.job("CalculateVotes", function(request, status) {

	Parse.Cloud.useMasterKey();

	//total votes
	var trVotes = {};
	var totalVotes = 100;

	var votes = Parse.Object.extend('Votes');
	var query = new Parse.Query(votes);
	//query.equalTo("status", "approved");//set this in production
  	query.each(function(vote) 
  	{
  		totalVotes += 1;
  		var city = vote.get("city");
  		var party = vote.get("party");

  		if(trVotes[party]){
  			trVotes[party] += 1;	
  		}else{
  			switch(party)
  			{
	  			case "82":{trVotes[party] = 40;}break;					//akp
	  			case "83":{trVotes[party] = 30;}break;					//chp
	  			case "84":{trVotes[party] = 15;}break;					//mhp
	  			case "85":{trVotes[party] = 12;}break;					//hdp
	  			case "88":{trVotes[party] = 5;}break;					//bagimsiz
	  			case "93":{trVotes[party] = 1;}break;					//saadet
	  			default:{trVotes[party] = 1;}							//default
  			}
  		}
  		
	}).then(function() 
	{
		status.success("Votes calculated successfully.");

		//Save results object
		var Results = Parse.Object.extend('Results');
		var query = new Parse.Query(Results);

		//Update total results
		var result = new Results();
		result.id = "1fIJaTQ9oK";
		trVotes = convertCount2Percent(trVotes,totalVotes); 
		result.set("votes", trVotes);
		result.save(null).then(function(){
			status.success("Votes calculated and saved successfully.");
		}, function(){
			status.success("Votes calculated but error while saving. Error: "+error);
		});

	}, function(error) 
	{
		status.error("Error: "+error);
	});
});



/*=========================================== Internal functions ======================================================================*/

var convertCount2Percent = function(list, total){
	for (var key in list) {
		percent = ((list[key]/total) * 100);
		list[key] = Math.round(percent * 100) / 100; 	//decimal point set
	}
	return list;
}