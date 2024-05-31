$(document).ready(function(){

	//Flash the button once at frequency 200ms
	var flashInterval = null;
	//After click start, run at frequency of 1s to display 3,2,1
	var startGameInterval = null;
	//var flashCnt = 0;
	var startGameCnt = 3;
	//Time of currently flash button
	var flashTime = null;
	//Time of click the currently flash button
	var clickTime = null;
	//var flashingColor = "";
	var flashingIndex = -1;
	//The continue flashing number
	var continueFlashNum = 1;
	//Count flash times for fail
	var times = 0;
	//If user does not response in 5 seconds
	var flashAllInterval = null;

	//Click the start button
	$("#btnCenter").click(function() {
		if ($(this).html() == "START") {
			$("#userColor").val("");
			$("#systemColor").val("");
			continueFlashNum = 0;
			flashingIndex = -1;
			$(".spot").css("background-color", "green");
			//Game starts after 3s, display 3,2,1 at interval of 1s
			$("#btnCenter").html(startGameCnt);
			startGameInterval = setInterval(startGame, 1000);	
		}
	});

	//Start Game to flash random button
	function startGame() {
		startGameCnt--;	
		clearTimeout(flashAllInterval);
		times = 0;
		if (parseInt(startGameCnt) == 0) {
			//After 3s, play the game and top count for 3,2,1
			$("#btnCenter").html("Running");
			clearInterval(startGameInterval);
			//flashInterval = setInterval(flashButton, 200);
			flashButton();			
		} else {
			$("#btnCenter").html(startGameCnt);
		}		
	}
	
	//isSystem: true-if press by system, false-if press by user
	function setDarkColor(color, isSystem) {
		// if ($("#btnCenter").html().toLowerCase() != "running") {
		// 	return;
		// }
		//When flashing by sytem, user should not press		
		if (parseInt(continueFlashNum) == 0 || isSystem == true) {			
			if(color == "1") {
				$("#roundGreen").css("background", "linear-gradient(to bottom, #006622, #009933)");	
			} else if(color == "2") {
				$("#roundRed").css("background", "linear-gradient(to bottom, #b30000, #ff3333)");	
			} else if (color == "3") {
				$("#roundYellow").css("background", "linear-gradient(to bottom, #b38f00, #e6b800)");
			} else if (color == "4") {
				$("#roundBlue").css("background", "linear-gradient(to bottom, #001a66, #002db3)");
			} 
		}
	}

	function setNormalColor(color) {
		if(color == "1") {
			$("#roundGreen").css("background", "linear-gradient(to bottom, green, #00cc00)");
		} else if(color == "2") {
			$("#roundRed").css("background", "linear-gradient(to bottom, red, #ff6666)");
		} else if (color == "3") {
			$("#roundYellow").css("background", "linear-gradient(to bottom, #ffcc00, #ffe066)");
		} else if (color == "4") {
			$("#roundBlue").css("background", "linear-gradient(to bottom, #0033cc, #6666ff)");
		} 
	}

	//colorIndex: 1-green, 2-red, 3-yellow, 4-blue, 0-flash all buttons
	function setButtonColor(colorIndex) {
		if (parseInt(colorIndex) == 1 || colorIndex == 0) {
			setColor("green");
		} 
		if (parseInt(colorIndex) == 2 || colorIndex == 0) {
			setColor("red");
		} 
		if (parseInt(colorIndex) == 3 || colorIndex == 0) {
			setColor("yellow");			
		} 
		if (parseInt(colorIndex) == 4 || colorIndex == 0) {
			setColor("blue");			
		}
	} 
	
	//Flash buttons
	function flashButton() {		
		//How many buttons should flash
		continueFlashNum = parseInt($("#btnRight").html()) + 1;
		if (parseInt(continueFlashNum) == 1) {
			//First time, flash only 1 button
			flashingIndex = Math.floor((Math.random() * 4) + 1);
			setDarkColor(flashingIndex, true); 
			setTimeout(function() {				
				setNormalColor(flashingIndex);				
			}, 200); 
			$("#systemColor").val($("#systemColor").val()+flashingIndex);
			flashTime = new Date();
			continueFlashNum = parseInt(continueFlashNum) - 1;
			//clearInterval(flashInterval);
			clearTimeout(flashAllInterval);
			times = 0;
			flashAllInterval = setTimeout(flashAllButtons, 5000);
			return;
		} 
		else {
			var speed = 1000;
		    var rightVal = parseInt($("#btnRight").html());
			//Speed up after 5, 9, 13
			if (parseInt(rightVal) >= 5 && parseInt(rightVal) < 9) {			
				speed = 700;
			} else if (parseInt(rightVal) >= 9 && parseInt(rightVal) < 13) {
				speed = 400;
			} else if (parseInt(rightVal) >= 13) {
				speed = 100;
			}		
			//Flash more than 1 buttons, duplicate the previous sequence first
			var previousSeq = $("#systemColor").val();
			flashingIndex = previousSeq.substr(previousSeq.length-continueFlashNum+1, 1); 
			//Repeat continueFlashNum times
			flashInterval = setInterval(function() {
				if (parseInt(continueFlashNum) == 0) {
					//After flashing continueFlashNum times, stop
					flashTime = new Date();
					clearInterval(flashInterval);
					clearTimeout(flashAllInterval);
					times = 0;
					flashAllInterval = setTimeout(flashAllButtons, 5000);
					return;
				}
				setDarkColor(flashingIndex, true); 
				setTimeout(function() {
					setNormalColor(flashingIndex); 
					$("#systemColor").val($("#systemColor").val()+flashingIndex);
					previousSeq = previousSeq.substr(1);
					if (continueFlashNum == 1) {
						flashingIndex = Math.floor((Math.random() * 4) + 1);
					} else {
						flashingIndex = previousSeq.substr(previousSeq.length-continueFlashNum+1, 1);
					}
				}, 200); 
				continueFlashNum = parseInt(continueFlashNum) - 1;				
			}, parseInt(speed)); 
		}		
	}

	//Set Fail and flash all buttons for 5 times
	function flashAllButtons() {
		$("#btnRight").html("00");		
		$(".spot").css("background-color", "red");
		$("#btnCenter").html("START");		
		//Flash all buttons
		for(var i = 1; i <= 4; i++) {
			setDarkColor(i, true);
		}
		setTimeout(function() {		
			for(var i = 1; i <= 4; i++) {		
				setNormalColor(i);			
			}
			times = times + 1;
			if (parseInt(times) < 5) {
				setTimeout(flashAllButtons, 200);
			}
		}, 200); 
		stopGame();
	}

	//Stop game and revert to initial
	function stopGame() {
		//times = 0;
		clearTimeout(flashAllInterval);
		startGameCnt = 3;
		flashingIndex = -1;
	}
	
	$("#roundGreen").mousedown(function(){
		setDarkColor(1, false);
	});

	$("#roundGreen").mouseup(function(){
		setNormalColor(1);
	});

	$("#roundRed").mousedown(function(){
		setDarkColor(2, false);	
	});

	$("#roundRed").mouseup(function(){
		setNormalColor(2);
	});

	$("#roundYellow").mousedown(function(){
		setDarkColor(3, false);
	});

	$("#roundYellow").mouseup(function(){
		setNormalColor(3);
	});

	$("#roundBlue").mousedown(function(){
		setDarkColor(4, false);
	});

	$("#roundBlue").mouseup(function(){
		setNormalColor(4);
	});

	function getCorlorIndex(colorName) {
		if(colorName.toLowerCase() == "green") {
			return 1;
		} else if(colorName.toLowerCase() == "red") {
			return 2;
		} else if(colorName.toLowerCase() == "yellow") {
			return 3;
		} else if(colorName.toLowerCase() == "blue") {
			return 4;
		}
	}

	//Click the round buttons
	$(".round").click(function() {
		clearTimeout(flashAllInterval);
		times = 0;
		flashAllInterval = setTimeout(flashAllButtons, 5000);
		//debugger;	
		if ($("#btnCenter").html().toLowerCase() != "running") {
			//User can click only when the game is running
			return;
		}			
		if (parseInt(continueFlashNum) > 0) {
			//Before system stops flashing, user click will not be counted
			return;
		}		
		var id = $(this).attr("id");
		$("#userColor").val($("#userColor").val() + getCorlorIndex(id.substring(5)));
		//If user has not finishing clicking
		if ($("#userColor").val().length < $("#systemColor").val().length) {
			return;
		}
		clickTime = new Date();
		//Time difference in seconds
		var dif = (clickTime - flashTime)/1000;
		//alert(dif);
		if (dif < 5 && $("#userColor").val() == $("#systemColor").val()) {
			//If click the correct button within 5 seconds, success
			var valSucceedCnt = parseInt($("#btnRight").html()) + 1;
			if (valSucceedCnt.toLocaleString().length == 1) {
				valSucceedCnt = "0" + valSucceedCnt;
			}
			$("#btnRight").html(valSucceedCnt);
			//Highest record
			var valHighestCnt = parseInt($("#btnLeft").html());
			if (parseInt(valSucceedCnt) > parseInt(valHighestCnt)) {
				$("#btnLeft").html(valSucceedCnt);
			}
			//Continue to flash next random button
			stopGame();
			continueFlashNum = valSucceedCnt;
			//Contine the game
			flashButton();
			
			// setTimeout(() => {		
			// 	flashInterval = setInterval(flashButton, 200);				
			// }, 1000);					
		} else {
			//Set fail and flash all buttons for 5 times		
			flashAllButtons();	
		}
	});
	
});
