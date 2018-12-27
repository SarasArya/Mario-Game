const marioIcon =
  "https://vignette.wikia.nocookie.net/nintendo/images/d/d9/Mario_%28New_Super_Mario_Bros._2%29.png/revision/latest?cb=20120709145048&path-prefix=en";
const mushroomIcon =
  "https://www.clipartmax.com/png/middle/19-198312_missile-clipart-super-mario-super-mario-bros-mushroom.png";

const randomNumber = (start, end) => {
  return start + Math.floor(Math.random() * (end - start));
};

const createMarioImage = () => {
  const marioImage = document.createElement("img");
  marioImage.setAttribute("src", marioIcon);
  marioImage.style.height = "50px";
  marioImage.style.width = "50px";
  marioImage.setAttribute("data-name", "marioIcon");
  return marioImage;
};

const fetchMarioLocation = () => {
  const marioPosition = document.querySelectorAll('[data-name="mario"]')[0];
  const marioIcon = document.querySelectorAll('[data-name="marioIcon"]')[0];
  const marioLocation = +marioPosition.getAttribute("data-id");
  return {
    marioPosition,
    marioIcon,
    marioLocation
  };
};

const updateLocation = (newMarioLocation, marioPosition, marioIcon) => {
  const newCellLocation = document.querySelectorAll(
    `[data-id="${newMarioLocation}"]`
  )[0];

  marioPosition.removeAttribute("data-name");
  marioPosition.removeChild(marioIcon);
  newCellLocation.setAttribute("data-name", "mario");
  newCellLocation.appendChild(marioIcon);
};

const direction = {
  up: 38,
  down: 40,
  left: 37,
  right: 39
};

class MarioGame {
  constructor(numberOfRows = 0, numberOfCols = 0) {
    // as response of prompt is string,
    // converting numerOfRows and numberOfCols to number
    this.numberOfRows = +numberOfRows;
    this.numberOfCols = +numberOfCols;
    this.numberOfMushrooms = +numberOfRows;
    this.totalMoves = 0;
    this.coordsOfMushrooms = [];
    this.intervalId = null;
  }

  initializeBoard() {
    // create the table and fill it with grid items
    const table = document.getElementsByClassName("table")[0];
    const totalSquares = this.numberOfRows * this.numberOfCols;
    for (let i = 0; i < totalSquares; i++) {
      const row = document.createElement("div");
      row.classList.add("item");
      row.setAttribute("data-id", i);
      table.appendChild(row);
    }
    // attach grid-template-columns to it
    table.style["grid-template-columns"] = `repeat(${this.numberOfCols}, 1fr)`;
    // initialize mario at 0,0
    const firstElement = document.querySelectorAll('[data-id="0"]')[0];
    const marioImage = createMarioImage();
    firstElement.setAttribute("data-name", "mario");
    firstElement.appendChild(marioImage);

    // initialize mushrooms = number of rows
    // finding range of number - Core JS way
    const arrayOfMushrooms = Array.from(
      {
        length: this.numberOfRows
      },
      (_, i) => i
    );

    // generate unique coordinates for mushrooms to be placed
    let coordsOfMushrooms = [];

    while (coordsOfMushrooms.length < arrayOfMushrooms.length) {
      const generatedNumber = randomNumber(1, totalSquares);
      coordsOfMushrooms.push(generatedNumber);
      coordsOfMushrooms = [...new Set(coordsOfMushrooms)];
    }

    // plant mushrooms in the grid
    coordsOfMushrooms.map(val => {
      const mushroomElement = document.querySelectorAll(
        `[data-id="${val}"]`
      )[0];
      const mushroomImage = document.createElement("img");
      mushroomImage.setAttribute("src", mushroomIcon);
      mushroomImage.style.height = "50px";
      mushroomImage.style.width = "50px";
      mushroomImage.setAttribute("data-name", `mushroom-${val}`);
      mushroomElement.appendChild(mushroomImage);
    });

    this.coordsOfMushrooms = coordsOfMushrooms;

    // and we are doneeee generating a board of course.
  }

  updateGame() {
    // check if any more mushrooms are remaining.
    // If not alert and close the game.
    const marioPosition = document.querySelectorAll('[data-name="mario"]')[0];
    const marioLocation = +marioPosition.getAttribute("data-id");
    if (this.coordsOfMushrooms.includes(marioLocation)) {
      const mushroomNode = document.querySelectorAll(
        `[data-name="mushroom-${marioLocation}"]`
      )[0];
      mushroomNode.parentNode.removeChild(mushroomNode);
      this.coordsOfMushrooms = this.coordsOfMushrooms.filter(
        val => val !== marioLocation
      );
      if (this.coordsOfMushrooms.length === 0) {
        alert(`Game Over, Number of Moves ${this.totalMoves}`);
      }
    }
  }

  checkKey(e) {
    e = e || window.event;
    if (e instanceof KeyboardEvent) {
      this.totalMoves++;
    }
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
    this.intervalId = setInterval(() => {
      switch (e.keyCode) {
        case direction.left:
          this.moveLeft();
          // this.moveSide();
          break;
        case direction.up:
          this.moveUp();
          break;
        case direction.right:
          this.moveRight();
          // this.moveSide();
          break;
        case direction.down:
          this.moveDown();
          break;
        default:
          console.log("Invalid key press");
      }
    }, 400);
  }

  moveRight() {
    // first findOut which row the mario is in currently.
    const { marioPosition, marioIcon, marioLocation } = fetchMarioLocation();

    // compute the next coordinates where mario is supposed to be
    let newMarioLocation;
    const firstElementInRow =
      Math.floor(marioLocation / this.numberOfRows) * this.numberOfRows;
    const lastElementInRow = firstElementInRow + this.numberOfRows - 1;
    if (marioLocation < lastElementInRow) {
      newMarioLocation = marioLocation + 1;
    } else if (marioLocation === lastElementInRow) {
      this.checkKey({
        keyCode: direction.left
      });
      return;
    }

    updateLocation(newMarioLocation, marioPosition, marioIcon);
    this.updateGame();
  }

  moveLeft() {
    const { marioPosition, marioIcon, marioLocation } = fetchMarioLocation();

    // compute the next coordinates where mario is supposed to be
    let newMarioLocation;
    const firstElementInRow =
      Math.floor(marioLocation / this.numberOfRows) * this.numberOfRows;

    if (marioLocation > firstElementInRow) {
      newMarioLocation = marioLocation - 1;
    } else if (marioLocation === firstElementInRow) {
      this.checkKey({
        keyCode: direction.right
      });
      return;
    }

    updateLocation(newMarioLocation, marioPosition, marioIcon);
    this.updateGame();
  }

  moveUp() {
    const { marioPosition, marioIcon, marioLocation } = fetchMarioLocation();

    let newMarioLocation;
    const firstElementInRow =
      Math.floor(marioLocation / this.numberOfRows) * this.numberOfRows;
    const firstElementVertically = marioLocation - firstElementInRow;

    if (marioLocation > firstElementVertically) {
      newMarioLocation = marioLocation - this.numberOfRows;
    } else if (marioLocation === firstElementVertically) {
      this.checkKey({ keyCode: direction.down });
      return;
    }

    updateLocation(newMarioLocation, marioPosition, marioIcon);
    this.updateGame();
  }

  moveDown() {
    let { marioPosition, marioIcon, marioLocation } = fetchMarioLocation();
    // find out the next position of mario
    const firstElementInRow =
      Math.floor(marioLocation / this.numberOfRows) * this.numberOfRows;
    const firstElementVertically = marioLocation - firstElementInRow;
    const lastElementVertically =
      firstElementVertically + (this.numberOfRows - 1) * this.numberOfCols;
    let newMarioLocation = 0;
    if (marioLocation < lastElementVertically) {
      newMarioLocation = marioLocation + this.numberOfRows;
    } else if (marioLocation === lastElementVertically) {
      this.checkKey({
        keyCode: direction.up
      });
      return;
    }

    updateLocation(newMarioLocation, marioPosition, marioIcon);
    this.updateGame();
  }
}

function startGame() {
  const numberOfRows = prompt("Enter the number of rows");
  const numberOfCols = prompt("Enter the number of cols");

  // initial Validation for game
  if (
    numberOfRows === "" ||
    numberOfCols === "" ||
    numberOfRows !== numberOfCols
  ) {
    alert("Invalid Input");
    return;
  }

  // create new Game Instance
  const newGameInstance = new MarioGame(numberOfRows, numberOfCols);

  newGameInstance.initializeBoard();

  // attach an event listener for arrow keys as well while we are at it
  document.onkeydown = newGameInstance.checkKey.bind(newGameInstance);
}

startGame();
