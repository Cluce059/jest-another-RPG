const inquirer = require('inquirer');
const Enemy = require('./Enemy');
const Player = require('./Player');

class Game{
    constructor(){
    this.roundNumber = 0;
    this.isPlayerTurn = false;
    this.enemies =[];
    this.currentEnemy;
    this.Player;
}

initializeGame(){
    this.enemies.push(new Enemy('goblin', 'sword'));
    this.enemies.push(new Enemy('orc', 'mace'));
    this.enemies.push(new Enemy('skeleton', 'axe'));
    //capture which enemy if=s fighting player
    this.currentEnemy = this.enemies[0];

    inquirer
    .prompt({
        type: 'text',
        name: 'name',
        message: 'What is your name?'
    })
    //destructure name from obj
    .then(({name}) => {
        this.player =new Player(name);
        //test obj creation
        //console.log(this.currentEnemy, this.player);
        this.startNewBattle();
    });
};
startNewBattle(){
    if(this.player.agility > this.currentEnemy.agility){
        this.isPlayerTurn = true;
    } else{
        this.isPlayerturn = false;
    }
    console.log('your stats are as folows:');
    console.table(this.player.getStats());
    console.log(this.currentEnemy.getDescription());
    this.battle();
};
battle(){
    if(this.isPlayerTurn){
        //player prompts
        inquirer
        .prompt({
            type: 'list',
            message: 'What would you like to do?',
            name: 'action',
            choices: ['ATTACK!', 'Use Potion']
        })
        .then(({action}) =>{
            if(action === 'Use Potion'){
                if(!this.player.getInventory()){
                    console.log("you don't have any potions");
                    return this.checkEndOfBattle();
                }
                inquirer
                .prompt({
                    type: 'list',
                    message: 'Which potion would you like to use?',
                    name: 'action',
                    choices: this.player.getInventory().map((item, index) => `${index +1}: ${item.name}`)
                })
                .then(({action}) =>{
                    const potionDetails = action.split(`: `);
                    this.player.usePotion(potionDetails[0] - 1);
                    console.log(`You used a ${potionDetails[1]} potion`);
                    this.checkEndOfBattle();
                });
            } else{
                const damage = this.player.getAttackValue();
                this.player.reduceHealth(damage);

                console.log(`You attacked the ${this.currentEnemy.name}`);
                console.log(this.player.getHealth());

                this.checkEndOfBattle();
            }
        });
    } else{
        const damage = this.currentEnemy.getAttackValue();
        this.player.reduceHealth(damage);

        console.log(`You were attacked by ${this.currentEnemy.name}`);
        console.log(this.player.getHealth());

        this.checkEndOfBattle();
    }
};
checkEndOfBattle(){
    if(this.player.isAlive() && this.currentEnemy.isAlive()){
        this.isPlayerTurn = !this.isPlayerTurn;
        this.battle();
    }
    else if (this.player.isAlive() && !this.currentEnemy.isAlive()) {
        console.log(`You've defeated the ${this.currentEnemy.name}`);
    
        this.player.addPotion(this.currentEnemy.potion);
        console.log(`${this.player.name} found a ${this.currentEnemy.potion.name} potion`);
    
        this.roundNumber++;
    
        if (this.roundNumber < this.enemies.length) {
          this.currentEnemy = this.enemies[this.roundNumber];
          this.startNewBattle();
        } else {
          console.log('You win!');
        }
      } else {
        console.log("You've been defeated!");
      }
    }
};


module.exports = Game;