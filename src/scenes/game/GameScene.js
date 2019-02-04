import 'phaser';
import isEqual from 'is-equal';
import { watchStore } from '../../utils/watchStore';
import { store, gameSlice } from './store';

export default class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'Game' });

    this.keyPress = null;
    this.pointer = null;
    this.player = null;
    this.platforms = null;
    this.stars = null;
    this.bombs = null;
    this.scoreText = null;

    // The store (a redux store) and change handlers
    this.store = store;
    this.gameOver = this.gameOver.bind(this);
    this.handleMovePlayer = this.handleMovePlayer.bind(this);
    this.renderScoreValue = this.renderScoreValue.bind(this);

    // Used in update() to limit dispatch calls
    this.lastMoveTo = null;
  }

  init() { }

  preload() {
    // Images
    this.load.image('sky', 'assets/sky.png');
    this.load.image('ground', 'assets/platform.png');
    this.load.image('star', 'assets/star.png');
    this.load.image('bomb', 'assets/bomb.png');
    this.load.spritesheet('dude', 'assets/dude.png', { frameWidth: 32, frameHeight: 48 });

    // When state.objectPath change, run onChange function
    // For example: When gameSlice.velocity change, run handleMovePlayer
    const storeMonitor = [
      { objectPath: 'gameSlice.gameOver', onChange: this.gameOver },
      { objectPath: 'gameSlice.score', onChange: this.renderScoreValue },
      { objectPath: 'gameSlice.velocity', onChange: this.handleMovePlayer }
    ];
    watchStore(store, storeMonitor);
  }

  create() {
    // A simple background for our game
    this.add.image(400, 300, 'sky');

    // The platforms contains the ground and the ledges we can jump on
    this.platforms = createPlatforms(this);

    // The player and its settings
    this.player = createPlayer(this);

    // Player animations
    createAnimations(this);

    // Input Events
    this.keyPress = this.input.keyboard.createCursorKeys();
    this.input.on('pointerdown', function (pointer) {
      // eslint-disable-next-line no-invalid-this
      this.pointer = {
        isDown: 25,
        x: pointer.x,
        y: pointer.y
      };
    }, this);

    //  Some stars to collect
    this.stars = createStars(this);

    // The enemy
    this.bombs = this.physics.add.group();

    // Add one bomb 
    addBomb(this.bombs, this.player);

    //  The score
    this.scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#000' });

    //  Collide the player, stars and bombs with the platforms
    this.physics.add.collider(this.player, this.platforms);
    this.physics.add.collider(this.stars, this.platforms);
    this.physics.add.collider(this.bombs, this.platforms);

    //  Checks to see if the player overlaps with any of the stars, if he does call the collectStar function
    this.physics.add.overlap(this.player, this.stars, this.collectStar, null, this);

    //  Checks to see if the player collides with any ot the bombs.
    this.physics.add.collider(this.player, this.bombs, this.hitBomb, null, this);
  }

  // eslint-disable-next-line no-unused-vars
  update(time, delta) {
    // Return if gameOver
    if (this.store.getState().gameSlice.gameOver) {
      return;
    }

    // Input
    const nextMoveTo = getNextMoveTo(this);

    // Launch moveTo action in game. This action sets velocity
    if (!isEqual(nextMoveTo, this.lastMoveTo)) {
      this.lastMoveTo = nextMoveTo;
      this.store.dispatch(gameSlice.actions.moveTo(nextMoveTo));
    }

    // Save info into state
    saveInfo(this);
  }

  // eslint-disable-next-line no-unused-vars
  gameOver(newVal, oldVal, objectPath) {
    if (newVal) {
      this.physics.pause();
      this.player.setTint(0xff0000);
      this.player.anims.play('turn');
    }
  }

  // eslint-disable-next-line no-unused-vars
  handleMovePlayer(newVal, oldVal, objectPath) {
    this.player.setVelocityX(newVal.x);
    this.player.setVelocityY(newVal.y);
    this.player.anims.play(newVal.animation, true);
  }

  // eslint-disable-next-line no-unused-vars
  renderScoreValue(newVal, oldVal, objectPath) {
    this.scoreText.setText('Score: ' + newVal);
  }

  // eslint-disable-next-line no-unused-vars
  collectStar(player, star) {
    star.disableBody(true, true);

    // Update the score
    this.store.dispatch(gameSlice.actions.incrementScore('star'));
    if (this.stars.countActive(true) === 0) {
      //  A new batch of stars to collect      
      this.stars.children.iterate(child => {
        child.enableBody(true, child.x, 0, true, true);
      });

      // Create a new bomb
      addBomb(this.bombs, this.player);
    }
  }

  // eslint-disable-next-line no-unused-vars
  hitBomb(player, bomb) {
    // GAME OVER
    this.store.dispatch(gameSlice.actions.setGameOver(true));
  }
}

const getNextMoveTo = (that) => {
  let next = {
    left: false,
    right: false,
    up: false
  };

  // Pointer
  if (that.pointer && that.pointer.isDown > 0) {
    const difX = Math.abs(that.pointer.x - that.player.body.position.x);
    const difY = Math.abs(that.pointer.y - that.player.body.position.y);
    if (difY > difX) {
      next.up = that.pointer.y < that.player.body.position.y;
    } else {
      next.right = that.pointer.x > that.player.body.position.x;
      next.left = that.pointer.x < that.player.body.position.x;
    }
    that.pointer.isDown--;
  } else {
    // Keyboard
    next = {
      left: that.keyPress.left.isDown,
      right: that.keyPress.right.isDown,
      up: that.keyPress.up.isDown
    };
  }

  return next;
};


const saveInfo = (that) => {
  const info = {
    player: {
      x: parseInt(that.player.body.position.x),
      y: parseInt(that.player.body.position.y)
    }
  };
  that.store.dispatch(gameSlice.actions.setInfo(info));
};

const createPlayer = (that) => {
  // The player and its settings
  const player = that.physics.add.sprite(100, 450, 'dude');

  //  Player physics properties. Give the little guy a slight bounce.
  player.setBounce(0.2);
  player.setCollideWorldBounds(true);

  return player;
};

const createPlatforms = (that) => {
  //  The platforms group contains the ground and the 2 ledges we can jump on
  const platforms = that.physics.add.staticGroup();

  //  Here we create the ground.
  //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
  platforms.create(400, 568, 'ground').setScale(2).refreshBody();

  //  Now let's create some ledges
  platforms.create(600, 400, 'ground');
  platforms.create(50, 250, 'ground');
  platforms.create(750, 220, 'ground');

  return platforms;
};

const createAnimations = (that) => {
  //  Our player animations, turning, walking left and walking right.
  that.anims.create({
    key: 'left',
    frames: that.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
    frameRate: 10,
    repeat: -1
  });

  that.anims.create({
    key: 'turn',
    frames: [{ key: 'dude', frame: 4 }],
    frameRate: 20
  });

  that.anims.create({
    key: 'right',
    frames: that.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
    frameRate: 10,
    repeat: -1
  });
};

const createStars = (that) => {
  const configStars = 12;
  const configStepX = parseInt(that.game.config.width / (configStars + 1));

  //  Some stars to collect
  const stars = that.physics.add.group({
    key: 'star',
    repeat: configStars - 1 ,
    setXY: { x: configStars / 2, y: 0, stepX: configStepX }
  });
  stars.children.iterate(function (child) {
    //  Give each star a slightly different bounce
    child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
  });

  return stars;
};

const addBomb = (bombs, player) => {
  // Add a bomb to bombs group, near of player position
  const x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);
  const bomb = bombs.create(x, 16, 'bomb');
  bomb.setBounce(1);
  bomb.setCollideWorldBounds(true);
  bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
  bomb.allowGravity = false;
};
