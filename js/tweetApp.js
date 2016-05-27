/*==================================
* Global variables
*==================================*/
/* ============================================
===============================================
Authors & copyright: (c) 2016 LemaxDigital.com | tweetApp.js - MIT License
===============================================
=============================================== */

var table,
    row,
    cell1,
    cell2,
    absoluteDate,
    relativeDate,
    displayDate,
    day,
    msgIcon = "",
    msgTilte = "",
    msgSender = "",
    msgDate = "",
    msgText = "",
    monthName = [],
	hashConverted = "",
	startDate,
	currentDate,
	convertedText,
	initDateFormat = localStorage.getItem("initDateFormat");

monthName[0] = "January";
monthName[1] = "February";
monthName[2] = "March";
monthName[3] = "April";
monthName[4] = "May";
monthName[5] = "June";
monthName[6] = "July";
monthName[7] = "August";
monthName[8] = "September";
monthName[9] = "October";
monthName[10] = "November";
monthName[11] = "December";

/*==================================
* Get all tweets
*==================================*/

var data = tweetData;

/*==================================
* Sort all tweets by dates (Most recent first)
*==================================*/

// --1. Change values of all created_at key for every object of the array so we can use it for our sort function
for (var i = 0, x = data.length; i < x; i++) {
	data[i].created_at = new Date(data[i].created_at).getTime();
}

// --2. Sort the data array by date -- Descending
data.sort(function(a, b) {
	return b.created_at - a.created_at;
});

/*==================================
* Get the five most recent Tweets
*==================================*/

var	recentTweets = data.slice(0, 5);

/*==================================
* Format recentTweets
*==================================*/

// Create the function which finds any word starting with #... or http... then make it clickable
var hash_Http_Filter = function(toBeConverted) {
    // Find word starting with #...
    var toConvertText = toBeConverted,
		hashMatches = toConvertText.match(/#\w+/g),
		hashLink = "<a href='#' title='Clickable link'>" + hashMatches + "</a>";

	if(hashMatches !== null){		
		// Convert each #... word into link
		for (var j = 0, y = hashMatches.length; j < y; j++) {
			// Find the #... word within the string 
			var hashFound = hashMatches[j];
			// And convert it into a link		
			var hashLink = "<a href='#' title='Clickable link'>" + hashFound + "</a>";
			toConvertText = toConvertText.replace(hashFound, hashLink);
		}
	}
	
	// Find word starting with http...	
	var httpMatches = toConvertText.match(/[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi);

	if(httpMatches !== null){
		// Convert each http... word into link
		for (var k = 0, z = httpMatches.length; k < z; k++) {
			var httpFound = httpMatches[k];
			var httpLink = "<a href='#' title='Clickable link'>" + httpFound + "</a>";
			toConvertText = toConvertText.replace(httpFound, httpLink);
		}
	}
    return toConvertText;
}

/*==================================
* Display recentTweets
*==================================*/
// Once all tweets sorted by date, get the five most recent tweets then format and display these
var displayTweets = function(){
		
	// Display the 5 latest tweets on the page
	for (var i = 0, x = 5; i < x; i++) {
		// Get and format the details
		table = document.getElementById("messages");
		row = table.insertRow(-1);
		cell1 = row.insertCell(0);
		cell2 = row.insertCell(1);
		var replyTo = recentTweets[i].in_reply_to_screen_name;

		// Only display the replyTo user when there is one
		if (replyTo == null) {
			replyTo = "";
		} else {
			replyTo = "@" + recentTweets[i].in_reply_to_screen_name;;
		}

		// Get Relative tweet date
		// Get Tweet date
		startDate = new Date(recentTweets[i].created_at),
		// Get today's date
		currentDate = new Date();
		// Calculate difference and return the result	
		relativeDate = Math.round((currentDate - startDate) / (1000 * 60 * 60 * 24)) + " days ago";

		// Get Absolute tweet date
		// Format the absolute date
		day = startDate.getDate();
		year = startDate.getFullYear();
		absoluteDate = day + " " + monthName[startDate.getMonth()] + " " + year;

		// Call to #..., http... Filter function
		convertedText = hash_Http_Filter(recentTweets[i].text);

		// Create tables row/columns with recentTweets into it for each user
		var msgIcon = "<img class='flt-l' src='" + recentTweets[i].user.profile_image_url + "' alt='Profile Image'/>",
			msgTilte = "<span class='flt-l msgTitle'>" + recentTweets[i].user.screen_name + "</span>",
			msgSender = "<span class='flt-l msgSender'>" + replyTo + "</span>",
			relDate = "<span class='flt-r msgDate relativeDate show'>" + relativeDate + "</span>",
			absDate = "<span class='flt-r msgDate absoluteDate hide'>" + absoluteDate + "</span>",
			msgText = "<p class='flt-l msgText'>" + convertedText + "</p>"; // 

		// Add recentTweets to the page
		cell1.innerHTML = msgIcon;
		cell2.innerHTML = msgTilte + msgSender + relDate + absDate + msgText;
	}
	
    // On Hover the display corresponding absolute/relative tweet date
    $("#mainContent table tr").hover(
        // On mousseIn
        function() {
            var node = $(this);
            if (node.find("td span.msgDate").hasClass("relativeDate show")) {
                node.find("td span.msgDate.relativeDate").removeClass("show");
                node.find("td span.msgDate.relativeDate").addClass("hide");
                node.find("td span.msgDate.absoluteDate").removeClass("hide");
                node.find("td span.msgDate.absoluteDate").addClass("show");
            } else {
                node.find("td span.msgDate.absoluteDate").removeClass("show");
                node.find("td span.msgDate.absoluteDate").addClass("hide");
                node.find("td span.msgDate.relativeDate").removeClass("hide");
                node.find("td span.msgDate.relativeDate").addClass("show");
            }
        },
        // On mousseOut
        function() {
            var node = $(this);
            if (node.find("td span.msgDate").hasClass("relativeDate show")) {
                node.find("td span.msgDate.relativeDate").removeClass("show");
                node.find("td span.msgDate.relativeDate").addClass("hide");
                node.find("td span.msgDate.absoluteDate").removeClass("hide");
                node.find("td span.msgDate.absoluteDate").addClass("show");
            } else {
                node.find("td span.msgDate.absoluteDate").removeClass("show");
                node.find("td span.msgDate.absoluteDate").addClass("hide");
                node.find("td span.msgDate.relativeDate").removeClass("hide");
                node.find("td span.msgDate.relativeDate").addClass("show");
            }
        });
};



// Process tweetAppForm submission
var sendTweetMsg = function(){
	
	
	// Create the new object (the new object has default values for all property except the text one)
	var newTweet = {
		"created_at": new Date().getTime(),
		"id": recentTweets.length + 1,
		"text": document.getElementById("tweetInput").value,
		"in_reply_to_screen_name": null,
		"user":  {
		  "id": recentTweets.length + 1000,
		  "screen_name": "Lemax",
		  "profile_image_url": "http://media.indiatimes.in/media/content/2012/Oct/2_1323245261_1350018808_460x460.jpg"
		}
	}
	
	// Clear form input
	document.getElementById("tweetInput").value = "";
	
	// Add the new object to the Array
  	recentTweets.unshift(newTweet);	
	
	// Reformat the Array to only have 5 tweets including the added one
	recentTweets = recentTweets.slice(0, 5);
	
	// Delete any tweets from the page if there are some
	var myTable = document.getElementById("tweetBody");
	myTable.innerHTML = "";
	
	//Display the new tweets data
	displayTweets();
};

// On Document Ready
$(document).ready(function() {
	
	//Display tweet
	displayTweets();
	
    // Get initDateFormat from the localStorage in order to display to the corret Date Format
    if (initDateFormat == "absDateFormat") {
        $("td span.msgDate.relativeDate").removeClass("show");
        $("td span.msgDate.relativeDate").addClass("hide");
        $("td span.msgDate.absoluteDate").removeClass("hide");
        $("td span.msgDate.absoluteDate").addClass("show");
        $("#tweetDateFormat #relativeTrigger").removeClass("active");
        $("#tweetDateFormat #absoluteTrigger").addClass("active");
    } else {
        $("td span.msgDate.absoluteDate").removeClass("show");
        $("td span.msgDate.absoluteDate").addClass("hide");
        $("td span.msgDate.relativeDate").removeClass("hide");
        $("td span.msgDate.relativeDate").addClass("show");
        $("#tweetDateFormat #absoluteTrigger").removeClass("active");
        $("#tweetDateFormat #relativeTrigger").addClass("active");
    }

    // Toggle absolute Tweet Date display
    $("#tweetDateFormat a#absoluteTrigger").click(function(e) {
        e.preventDefault();
        localStorage.initDateFormat = "absDateFormat";
        // Display latest tweet with absolute date
        $("td span.msgDate.relativeDate").removeClass("show");
        $("td span.msgDate.relativeDate").addClass("hide");
        $("td span.msgDate.absoluteDate").removeClass("hide");
        $("td span.msgDate.absoluteDate").addClass("show");
        $("#tweetDateFormat #relativeTrigger").removeClass("active");
        $("#tweetDateFormat #absoluteTrigger").addClass("active");
    });

    // Toggle relative Tweet Date display
    $("#tweetDateFormat a#relativeTrigger").click(function(e) {
        e.preventDefault();
        localStorage.initDateFormat = "relDateFormat";
        // Display latest tweet with relative date
        $("td span.msgDate.absoluteDate").removeClass("show");
        $("td span.msgDate.absoluteDate").addClass("hide");
        $("td span.msgDate.relativeDate").removeClass("hide");
        $("td span.msgDate.relativeDate").addClass("show");
        $("#tweetDateFormat #absoluteTrigger").removeClass("active");
        $("#tweetDateFormat #relativeTrigger").addClass("active");
    });
});