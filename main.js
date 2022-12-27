document.addEventListener("DOMContentLoaded", () => {
  (function (d, w) {
    "use strict";
    function candyCrush() {
      const board = d.querySelector(".board"),
        timebox = d.querySelector(".timeleft span"),
        alertbox = d.querySelector(".alert"),
        alertboxScore = alertbox.querySelector("span"),
        shadowbox = d.querySelector(".shadow");
      let time = 0,
        colorDragged,
        colorReplaced,
        timeinterval,
        interval,
        score,
        scorestart = false,
        draggedPositionX = board.offsetLeft + board.offsetWidth / 2,
        draggedPositionY = board.offsetTop + board.offsetHeight / 2,
        boxIndexDragged = 0,
        firstBoxColor,
        boxIndexReplaced = 0,
        validMove = [];
      const start = () => {
        timebox.innerHTML = 40;
        score = 0;
        time = 40;
        shadowbox.style.display = "none";
        interval = w.setInterval(() => {
          dropBoxes(), checkColumnForFive();
          checkRowForFive(),
            checkRowForFour(),
            checkColumnForFour(),
            checkRowForThree(),
            checkColumnForThree();
        }, 100);
        timeinterval = w.setInterval(() => {
          if (time > 0) {
            time--;
            timebox.innerHTML = time;
          } else {
            reset();
          }
        }, 1000);
      };
      const randomColor = (box) => {
        let candyIndex = Math.floor(Math.random() * 6);
        box.style.background = candyImages[candyIndex];
      };
      const reset = () => {
        alertbox.style.display = "block";
        shadowbox.style.display = "flex";
        alertboxScore.innerHTML = score;
        increaseScore(-score);

        for (let i = 0; i < 5; i++) {}
        for (let i = 0; i < 63; i++) {
          randomColor(boxes[i]);
        }
        setTimeout(() => {
          w.clearInterval(interval);
        }, 3000);
        scorestart = false;
        w.clearInterval(timeinterval);
      };
      document.querySelector(".start").addEventListener("click", start); // TODO: rename image names when time permits
      const candyImages = [
        "url(images/pupp1.jpg)",
        "url(images/pupp2.jpg)",
        "url(images/pupp3.jpg)",
        "url(images/pupp4.jpg)",
        "url(images/pupp5.jpg)",
        "url(images/pupp6.jpg)",
      ];
      const boxes = [];
      const scoreBox = document.querySelector(".score");
      const dot = document.querySelector(".dot");
      const animate = () => {
        let firstBoxBackground = firstBoxColor.split("/")[1].split(".")[0];
        dot.style.left = draggedPositionX + "px";
        dot.style.top = draggedPositionY + "px";
        let boxAnimation = `0 0 20px 100px ${firstBoxBackground}`;
        dot.style.transform = "scale(1)";
        dot.style.opacity = ".8";
        dot.style.background = `${firstBoxBackground}`;
        dot.style.boxShadow = boxAnimation;
        setTimeout(() => {
          dot.style.transform = "scale(1.2)";
          dot.style.opacity = "0";
        }, 200);
        setTimeout(() => {
          dot.style.transform = "scale(0)";
          dot.style.opacity = "0";
        }, 400);
        validMove = [];
      };
      const increaseScore = (increaseBy) => {
        if (scorestart) {
          score += increaseBy;
          scoreBox.innerHTML = score;
        }
      };
      const createBoard = () => {
        for (let i = 0; i < 64; i++) {
          let box = d.createElement("div");
          box.setAttribute("id", i);
          box.setAttribute("draggable", true);
          box.setAttribute("class", "box");
          // box.innerHTML = i;
          randomColor(box);
          boxes.push(box);
          board.appendChild(box);
        }
      };
      createBoard();

      const dragStart = (e) => {
        validMove = [];
        colorDragged = e.target.style.background;
        boxIndexDragged = parseInt(e.target.attributes.id.value);
      };
      const dragEnter = (e) => {
        e.preventDefault();
      };
      const dragOver = (e) => {
        e.preventDefault();
      };
      const dragLeave = (e) => {
        e.preventDefault();
      };

      const dragEnd = (e) => {
        scorestart = true;
        e.preventDefault();
        draggedPositionX = e.clientX;
        draggedPositionY = e.clientY;
      };

      const drop = (e) => {
        colorReplaced = e.target.style.background;
        boxIndexReplaced = parseInt(e.target.attributes.id.value);
        let validMoves = [
          boxIndexDragged - 1,
          boxIndexDragged + 1,
          boxIndexDragged - 8,
          boxIndexDragged + 8,
        ];
        let validMove = validMoves.includes(boxIndexReplaced);
        if ((boxIndexDragged || boxIndexDragged == 0) && validMove) {
          e.target.style.background = colorDragged;
          boxes[boxIndexDragged].style.background = colorReplaced;
        }
        setTimeout(checkValidMove, 100);
      };
      const changeColor = (arrIndex, color) => {
        arrIndex.forEach((a) => {
          boxes[a].style.background = color;
        });
      };
      const checkValidMove = () => {
        if (validMove.length == 0) {
          boxes[boxIndexDragged].style.background = colorDragged;
          boxes[boxIndexReplaced].style.background = colorReplaced;
        }
      };
      const checkRowForThree = () => {
        for (let i = 0; i < 62; i++) {
          firstBoxColor = boxes[i].style.background;
          let secondBoxColor = boxes[i + 1].style.background;
          let thirdBoxColor = boxes[i + 2].style.background;
          let invalidFirstBoxes = [
            6, 7, 14, 15, 22, 23, 30, 31, 46, 47, 54, 55,
          ];
          let invalidFirstBox = invalidFirstBoxes.includes(i);
          if (
            !invalidFirstBox &&
            firstBoxColor == secondBoxColor &&
            firstBoxColor == thirdBoxColor &&
            firstBoxColor != ""
          ) {
            changeColor([i, i + 1, i + 2], "");
            increaseScore(3);
            animate();
            validMove.push(true);
          }
        }
      };
      const checkColumnForThree = () => {
        for (let i = 0; i < 48; i++) {
          let allboxes = [i, i + 8, i + 16];
          firstBoxColor = boxes[i].style.background;
          let secondBoxColor = boxes[i + 8].style.background;
          let thirdBoxColor = boxes[i + 16].style.background;
          if (
            firstBoxColor == secondBoxColor &&
            firstBoxColor == thirdBoxColor &&
            firstBoxColor != ""
          ) {
            changeColor(allboxes, "");
            increaseScore(3);
            animate();
            validMove.push(true);
          }
        }
      };
      const checkColumnForFour = () => {
        for (let i = 0; i < 37; i++) {
          let allboxes = [i, i + 8, i + 16, i + 24];

          firstBoxColor = boxes[i].style.background;
          let secondBoxColor = boxes[i + 8].style.background;
          let thirdBoxColor = boxes[i + 16].style.background;
          let fourthBoxColor = boxes[i + 24].style.background;
          if (
            firstBoxColor == secondBoxColor &&
            firstBoxColor == thirdBoxColor &&
            firstBoxColor == fourthBoxColor &&
            firstBoxColor != ""
          ) {
            changeColor(allboxes, "");
            increaseScore(4);
            validMove.push(true);
            animate();
          }
        }
      };
      const checkRowForFour = () => {
        for (let i = 0; i < 61; i++) {
          let allboxes = [i, i + 1, i + 2, i + 3];
          firstBoxColor = boxes[i].style.background;
          let secondBoxColor = boxes[i + 1].style.background;
          let thirdBoxColor = boxes[i + 2].style.background;
          let fourthBoxColor = boxes[i + 3].style.background;

          let invalidFirstBoxes = [
            5, 6, 7, 13, 14, 15, 21, 22, 23, 29, 30, 31, 45, 46, 47, 53, 54, 55,
          ];
          let invalidFirstBox = invalidFirstBoxes.includes(i);
          if (
            !invalidFirstBox &&
            firstBoxColor == secondBoxColor &&
            firstBoxColor == thirdBoxColor &&
            firstBoxColor == fourthBoxColor &&
            firstBoxColor != ""
          ) {
            changeColor(allboxes, "");
            boxes[i + 1].style.background = "";
            boxes[i].style.background = "";
            boxes[i + 2].style.background = "";
            boxes[i + 3].style.background = "";
            increaseScore(4);
            validMove.push(true);
            animate();
          }
        }
      };
      const checkRowForFive = () => {
        for (let i = 0; i < 60; i++) {
          let allboxes = [i, i + 1, i + 2, i + 3, i + 4];
          firstBoxColor = boxes[i].style.background;
          let secondBoxColor = boxes[i + 1].style.background;
          let thirdBoxColor = boxes[i + 2].style.background;
          let fourthBoxColor = boxes[i + 3].style.background;
          let fifthBoxColor = boxes[i + 4].style.background;
          let invalidFirstBoxes = [
            4, 5, 6, 7, 12, 13, 14, 15, 20, 21, 22, 23, 28, 29, 30, 31, 44, 45,
            46, 47, 52, 53, 54, 55,
          ];
          let invalidFirstBox = invalidFirstBoxes.includes(i);
          if (
            !invalidFirstBox &&
            firstBoxColor == secondBoxColor &&
            firstBoxColor == thirdBoxColor &&
            firstBoxColor == fourthBoxColor &&
            firstBoxColor == fifthBoxColor &&
            firstBoxColor != ""
          ) {
            boxes[i + 1].style.background = "";
            boxes[i].style.background = "";
            boxes[i + 2].style.background = "";
            boxes[i + 3].style.background = "";
            boxes[i + 4].style.background = "";
            increaseScore(5);
            validMove.push(true);
            animate();
          }
        }
      };
      const checkColumnForFive = () => {
        for (let i = 0; i < 32; i++) {
          let allboxes = [i, i + 8, i + 16, i + 24, i + 32];
          firstBoxColor = boxes[i].style.background;
          let secondBoxColor = boxes[i + 8].style.background;
          let thirdBoxColor = boxes[i + 16].style.background;
          let fourthBoxColor = boxes[i + 24].style.background;
          let fifthBoxColor = boxes[i + 32].style.background;
          if (
            firstBoxColor == secondBoxColor &&
            firstBoxColor == thirdBoxColor &&
            firstBoxColor == fourthBoxColor &&
            firstBoxColor == fifthBoxColor &&
            firstBoxColor != ""
          ) {
            changeColor(allboxes, "");
            increaseScore(5);
            validMove.push(true);
            animate();
          }
        }
      };
      let fristRow = [0, 1, 2, 3, 4, 5, 6, 7];
      const dropBoxes = () => {
        for (let i = 8; i < 64; i++) {
          if (boxes[i].style.background == "") {
            boxIndexReplaced = i;
            let upperColor = boxes[i - 8].style.background;
            boxes[i].style.background = upperColor;
            boxes[i - 8].style.background = "";
          }
        }
        for (let i = 0; i < 8; i++) {
          if (boxes[i].style.background == "") {
            boxIndexReplaced = i;
            randomColor(boxes[i]);
          }
        }
      };

      d.addEventListener("dragstart", dragStart.bind(this));
      d.addEventListener("dragenter", dragEnter);
      d.addEventListener("dragover", dragOver);
      d.addEventListener("dragleave", dragLeave);
      d.addEventListener("dragend", dragEnd);
      d.addEventListener("drop", drop);
    }
    new candyCrush();
  })(document, window);
});
