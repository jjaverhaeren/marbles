const getPosition = element => {
  const rect = element.getBoundingClientRect();
  return rect.left;
};

const getBounds = () => {
  const refLeft = document.querySelector("#ref-left");
  const leftBound = getPosition(refLeft);
  const refRight = document.querySelector("#ref-right");
  const rightBound = getPosition(refRight);
  return [leftBound, rightBound];
};

const randomNewPosition = () => {
  const [min, max] = getBounds();
  let randomNum = Math.floor(Math.random() * max) + min;
  return (randomNum *= Math.round(Math.random()));
};

const getMarblesArray = () => {
  const marbles = document.querySelectorAll(".marble");
  return Array.from(marbles);
};

const getOtherMarblesArray = marble => {
  const marblesArray = getMarblesArray();
  const current = marble.id;
  return marblesArray.filter(other => {
    return other.id !== current;
  });
};

// const turn = (marblePos, otherPos) => {
//   const distanceToTravel = Math.round(Math.abs(marblePos - otherPos)).toFixed(
//     2
//   );
//   const circumference = 50 * Math.PI;
//   const numberOfRotations = distanceToTravel / circumference;
//   const degreesToTurn = 360 * numberOfRotations;
//   return degreesToTurn;
// };

const checkCollisions = (marble, currentPosition, newPosition) => {
  const otherMarbles = getOtherMarblesArray(marble);
  let otherPosArray = [];
  otherMarbles.forEach(other => {
    const range = {};
    range.marble = other;
    range.posMinus = Math.round(getPosition(other)) - 50;
    range.posPlus = Math.round(getPosition(other)) + 50;

    otherPosArray.push(range);
  });

  const currentPositionMinus = currentPosition - 50;
  const currentPositionPlus = currentPosition + 50;

  otherPosArray.forEach(otherPos => {
    if (
      currentPositionMinus - otherPos.posMinus < 0 &&
      newPosition > otherPos.posMinus
    ) {
      newPosition = otherPos.posMinus;
      marble.style.left = `${newPosition}px`;
      // const degreesToTurn = turn(currentPosition, otherPos.posMinus);
      // marble.style.transform = `rotate(${degreesToTurn}deg)`;
    } else if (
      currentPositionPlus - otherPos.posPlus > 0 &&
      newPosition < otherPos.posPlus
    ) {
      newPosition = otherPos.posPlus;
      marble.style.left = `${newPosition}px`;
      // const degreesToTurn = turn(currentPosition, otherPos.posPlus);
      // marble.style.transform = `rotate(${degreesToTurn}deg)`;
    }
  });

  const checkingTheBalls = setInterval(() => {
    const posNow = Math.round(getPosition(marble));
    if (posNow > newPosition - 51 && posNow < newPosition + 51) {
      clearInterval(checkingTheBalls);

      otherPosArray.forEach(other => {
        const distanceToTravel = Math.round(
          Math.abs(currentPosition - other.posMinus)
        ).toFixed(2);
        // const degreesToTurn = turn(currentPosition, other.posMinus);
        // console.log(degreesToTurn);

        let timeOut = (100 / distanceToTravel) * 2500;
        if (timeOut > 900) {
          timeOut = 900;
        }
        // console.log(timeOut);
        if (posNow < other.posMinus && posNow > other.posMinus - 60) {
          setTimeout(() => {
            other.marble.style.transitionDuration = `1000ms`;
            other.marble.style.transitionTimingFunction = `ease-out`;
            other.marble.style.left = `${other.posPlus + 20}px`;

            marble.style.transitionDuration = `1000ms`;
            marble.style.transitionTimingFunction = `ease-out`;
            marble.style.left = `${newPosition - 10}px`;
          }, timeOut);
        } else if (posNow > other.posPlus && posNow < other.posPlus + 60) {
          setTimeout(() => {
            other.marble.style.transitionDuration = `1000ms`;
            other.marble.style.transitionTimingFunction = `ease-out`;
            other.marble.style.left = `${other.posMinus - 20}px`;

            marble.style.transitionDuration = `1000ms`;
            marble.style.transitionTimingFunction = `ease-out`;
            marble.style.left = `${newPosition + 10}px`;
          }, timeOut);
        }
      });
    }
  }, 3);
};

const move = marble => {
  const currentPosition = getPosition(marble);
  let newPosition = randomNewPosition();
  if (newPosition === Math.round(currentPosition)) {
    newPosition += 200;
  }
  marble.style.transitionDuration = `1000ms`;
  marble.style.transitionTimingFunction = `cubic-bezier(0.2, 0.7, 0.3, 0.9)`;
  marble.style.left = `${newPosition}px`;

  checkCollisions(marble, currentPosition, newPosition);
};

const action = event => {
  const marble = event.target;
  move(marble);
};

const marbleEventListeners = () => {
  const marblesArray = getMarblesArray();
  marblesArray.forEach(marble => {
    marble.addEventListener("click", action);
  });
};

marbleEventListeners();
