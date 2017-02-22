$(document).ready(function(){

/*create a defender object*/
var defender = {
  
  name : "",
  hp: 0,
  cap:0,  
  isAttacking:null,
  isOutOfHP:null,
  setDefenderProp : function(name,hp,cap){
     this.name = name;
     this.hp = hp;
     this.cap = cap;  
  },
  isAlive : function(){
      if(this.name!=null && this.cap!=0){
        return true;
      }
      return false;
  }, 
  attackInvoked : function(player){
    console.log("Player lost health points equal to " + this.cap + ".");
    player.hp = parseInt(player.hp) - parseInt(this.cap);
    console.log("Player health points now is equal to " + player.hp + ".");    
  }
  /*,
  attackSuccumbed : function(player){
    console.log("Health Points before defender attacked " + this.hp + " points.");
    this.hp = this.hp - player.ap;
    console.log("Health Points after defender attacked " + this.hp + " points.");    
  }*/

};

/* End of defender object*/

/*create a player object*/
var player = {
  
  name : null,
  hp: 0,
  ap:0,
  bap:0,
  cap:0,  
  isOutOfHP:null,
  isWinner:null,
  enemyList:[],
  setPlayerProp : function(name,hp,ap,bap,cap){
     this.name = name;
     this.hp = hp;
     this.ap = ap;
     this.bap = bap;
     this.cap = cap;  
  },
  isAlive : function(){
      if(this.name!=null && this.ap!=0 && this.cap!=0 && this.bap!=0){
        return true;
      }
      return false;
  },  
  setEnemyList : function(enemyList){
      this.enemyList = enemyList; 
  },  
  attackInvoked : function(defender){
    console.log("Attack Power before attack was invoked " + this.ap + " points.");
    this.ap = parseInt(this.ap) + parseInt(this.bap);
    console.log("Attack Power after attack was invoked " + this.ap + " points");
    console.log("Defender lost health points equal to " + this.ap + ".");
    defender.hp = defender.hp - this.ap;
    console.log("Defender health points now is equal to " + defender.hp + "."); 

  }
  /*,  
  attackSuccumbed : function(defender){
    console.log("Health Points before defender attacked " + this.hp + " points.");
    this.hp = this.hp - defenderCAP;
    console.log("Health Points after defender attacked " + this.hp + " points.");    
  }*/
  
};

/***************************** end of player object************************************************/
/***********create custom event to check if player has run out of health points***********/ 
  
var playerOutOfHealthPoints = function(){
   if(player.isAlive()){
      $("#playerArea").find("#playerHP").text(player.hp);
      $("#playerStatsBrd").append("<div id= \"pstats\"></div>").html("Player Health Points :"+player.hp);
      $("#playerStatsBrd").append("<div id =\"dstats\"></div>").html("Defender Health Points :"+defender.hp);
       if(player.hp<=0)
        {
         var myEvent = new CustomEvent("outOfPower");
         document.body.dispatchEvent(myEvent);
         return true;
        }
       else
         return false;
   } 
 };
   
document.body.addEventListener("outOfPower", playerLost, false);
 
function playerLost(e) {
    //show modal user lost
 $("<div title='Sorry, you ran out of health points!'>Play Again</div>").dialog({    
     close:function() {
            location.reload();
          } 
 /* buttons: [
    {
      text: "OK",
      click: function() {
        $( this ).dialog( "close" );
    }
    }
  ]
*/

 });
player.setPlayerProp("",0,0,0,0);
player.setEnemyList([]);
defender.setDefenderProp("",0,0);

}
/***************************************************************************************************/
/***********create custom event to check if defender has run out of health points***********/ 
  
 var defenderOutOfHealthPoints = function(){

   if(defender.isAlive()){
      $("#defenderArea").find("#defenderHP").text(defender.hp);
      if(defender.hp<=0)
        {
         var myEvent = new CustomEvent("defenderOutOfPower");
         document.body.dispatchEvent(myEvent);
         return true;
        }
       else
         return false;
   } 
 };
   
document.body.addEventListener("defenderOutOfPower", playerWonDefender, false);
 
function playerWonDefender(e) {
    //show modal user lost
 $("<div title='Select Your Next ENEMY'></div>").dialog({     

 });

//remove defender from enemy list
if(!(player.enemyList.indexOf(defender.name) <= -1)){
  var idx = player.enemyList.indexOf(defender.name) ;
  var enemy = player.enemyList.splice(idx,1)[0];
  console.log("enemy removed is"+enemy);
}
console.log("player enemy list length: " + player.enemyList.length);
console.log("defender object: " + defender);
//remove defender from defender area ui
$("#defenderArea").css({
     "visibility": "hidden",
     "disabled": true
});
//Reset defender props 
defender.setDefenderProp("",0,0);
//clear the setInterval function linked to defender invoking attacks is in progress
clearInterval(defender.isAttacking);
//clear the setInterval function linked to spy on defender's HP points
clearInterval(defender.isOutOfHP);
//clear the setInterval function linked to spy on player's HP points
clearInterval(player.isOutOfHP);
//set setInterval variables to null again
defender.isAttacking = null;
defender.isOutOfHP =null;
player.isOutOfHP = null;

}
/********************************end of event*********************************************/

/***********create custom event to check if player won the game defeating all enemies with hp still > or = 0***********/ 
  
var playerConqueredEnemies = function(){
   if(player.isAlive()){
      $("#playerArea").find("#playerHP").text(player.hp);
      if(!(player.hp < 0))
       {
         if(player.enemyList.length <=0){
           var myEvent = new CustomEvent("playerWonGame");
           document.body.dispatchEvent(myEvent);
           return true;
         }
        
      }else
      return false;
   } 
 };
   
document.body.addEventListener("playerWonGame", playerWonGame, false);
 
function playerWonGame(e) {
    //show modal user lost
 $("<div title='All Target Dead!'>Let's play again.</div>").dialog({   
    close:function() {
            location.reload();
          }  
 /* buttons: [
    {
      text: "OK",
      click: function() {
        $( this ).dialog( "close" );
    }
    }
  ]
*/

 });
player.setPlayerProp("",0,0,0,0);
player.setEnemyList([]);
defender.setDefenderProp("",0,0);
clearInterval(isGameOn);

}
/***************************************************************************************************/


/****************************************************************Start the game**************************************************************/

/********************************************************************************************************************************************/
$(".character").click(function(){
  //console.log("i am in the click function");
/**** IF PLAYER IS NOT ALIVE SELECT A NEW PLAYER**************************/
  if($(this).css("disabled")!=true && player.isAlive() === false&& player.isWinner==null){

    //make the player image get hidden 
    $(this).css('visibility', 'hidden');
    // Enable the player object with properties hence the player is alive
    var name =  $(this).attr("name");
    var hp = $(this).attr("data-hp");
    var bap = $(this).attr("data-bap");
    var ap =  $(this).attr("data-ap");
    var cap = $(this).attr("data-cap");
    var imgsrc = $(this).find("img").attr('src');
    player.setPlayerProp(name,hp,ap,bap,cap);
    //Fill the enemy list for the player to fight with
    var enemyList = [];
    $(".character").each(function(index, el) {
      if(($(this).css('visibility')) != "hidden"){
         enemyList.push($(this).attr("name"));
      }
    });
    player.setEnemyList(enemyList);
    console.log(player);
    //display the player image in the playerArea
    $("#playerArea").attr({
      "name": name,
      "data-hp": hp,
      "data-ap":ap,
      "data-bap":bap,
      "data-cap":cap
    });
    $("#playerArea").css({
     "visibility": "visible",
     "disabled": true
    });
    $("#playerArea").find("img").attr('src', imgsrc);
    $("#playerArea").find("#playerName").text(name);
    $("#playerArea").find("#playerHP").text(hp);
    console.log("Player Initialization: " + player);
    return;
  }
/**************************PLAYER SELECTION ENDS**********************************************************/

/**************************DEFENDER SELECTION BEGINS******************************************************/

if($(this).css("disabled")!=true && defender.isAlive() == false && player.isAlive() === true){

    //make the defender image go hidden 
    $(this).css('visibility', 'hidden');
    // Enable the player object with properties hence the player is alive
    var name =  $(this).attr("name");
    var hp = $(this).attr("data-hp");
    var cap = $(this).attr("data-cap");
    var imgsrc = $(this).find("img").attr('src');
     defender.setDefenderProp(name,hp,cap);
    //Fill the enemy list for the player to fight with
    console.log(defender);
    //display the player image in the playerArea
    $("#defenderArea").attr({
      "name": name,
      "data-hp": hp,
      "data-cap":cap
    });
    $("#defenderArea").css({
     "visibility": "visible",
     "disabled": true
    });
    $("#defenderArea").find("img").attr('src', imgsrc);
    $("#defenderArea").find("#defenderName").text(name);
    $("#defenderArea").find("#defenderHP").text(hp);
  }
  console.log("Defender Initialization: " + defender);
  return;

});

/*********end of click for character images**************/

/*********hover event handler for character images*********/


$("div.character").hover(
function(){
  $(this).css("opacity", "0.25");
  $(this).attr('title', 'My name is ' + $(this).attr("name") +". Select me as your player else I will defeat you!");
},
function(){
   $(this).css("opacity", "1");
   $(this).removeAttr("title");
}
);

/***********end of hover event handler for character images********/

/*********************************************attack button event handler**************************************************************************************/
$("#playerAttackBtn").click(function(){
 
  player.attackInvoked(defender);

  if(player.isAlive() && defender.isAlive()){
    var defenderFunc = defender.attackInvoked(player);
    defender.isAttacking = setInterval(defenderFunc,6000);
    console.log("defender.isAttacking: " + defender.isAttacking);
  }

  if(player.isAlive() && defender.isAlive() && player.isOutOfHP == null ){
    player.isOutOfHP = setInterval(playerOutOfHealthPoints,1000);
    console.log("player.isOutOfHP : " + player.isOutOfHP );
  }
  

  if(player.isAlive() && defender.isAlive() && defender.isOutOfHP == null ){
    defender.isOutOfHP = setInterval(defenderOutOfHealthPoints,1000);
    console.log("defender.isOutOfHP: " + defender.isOutOfHP);
  }

  if(player.isAlive() && defender.isAlive() && player.isWinner == null ){
    player.isWinner = setInterval(playerConqueredEnemies,1000);
    console.log("player.isWinner: " + player.isWinner);
  }
  
  console.log(player);
  console.log(defender);


});

/*********************************************end of attack button event handler*****************************************************************/
var isGameOn = setInterval(checkGameOn,1000);

var checkGameOn = function(){
  if(player.isAlive() && defender.isAlive()){
    $("#playerAttackBtn").css('disabled', 'false');
    return true;
  }
   $("#playerAttackBtn").css('disabled', 'true');
   return false;
};
/*****************Action
player.setPlayerProp("Luke Skywalker",150,30,6,50);
defender.setDefenderProp("Yoda",120,50);
console.log("PLAYER NAME: " +player.name + " HP: "+ player.hp);
console.log("DEFENDER NAME: " +defender.name+ 
" HP: "+defender.hp);
player.attackInvoked();
console.log(player);   
player.attackSuccumbed(50);
console.log(player);
player.attackInvoked();
player.attackInvoked();
********************/

    

  
  
  
  
  
  

  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  });