const crypto = require('crypto');

function generateHmac(hmacKey, move) {
  const hmac = crypto.createHmac('sha256', hmacKey);
  hmac.update(move);
  return hmac.digest('hex');
}

function Computer(moves) {
  const randomIndex = Math.floor(Math.random() * moves.length);
  return moves[randomIndex];
}

function Win(User, Computer, moves) {
  const indexUser = moves.indexOf(User);
  const half = moves.length / 2;
  const lose = moves.slice(indexUser + 1, indexUser + half + 1);
  if (indexUser + half >= moves.length) {
    lose.push(...moves.slice(0, half - lose.length));
  }

  if (lose.includes(Computer)) {
    return 'You WIN';
  } else if (User === Computer) {
    return 'It is DRAW';
  } else {
    return 'You LOSE';
  }
}

function generateTable(moves) {
  const table = [['Moves', ...moves]];
  for (let i = 0; i < moves.length; i++) {
    const row = [moves[i]];
    for (let j = 0; j < moves.length; j++) {
      if (i === j) {
        row.push('DRAW');
      } else if ((j - i + moves.length) % moves.length <= moves.length / 2) {
        row.push('WIN');
      } else {
        row.push('LOSE');
      }
    }
    table.push(row);
  }
  console.table(table);
}


function startGame() {
  const moves = process.argv.slice(2);

  if (moves.length < 3 || moves.length % 2 === 0 || new Set(moves).size !== moves.length) {
    console.error('Invalid input >=3');
    process.exit(1);
  }

  const hmacKey = crypto.randomBytes(32).toString('hex');
  console.log(`HMAC key: ${hmacKey}`);

  console.log('You choice:');
    moves.forEach((move, index) => {
      console.log(`${index + 1} - ${move}`);
    });
    console.log('0 - exit');
    console.log('? - help');
  process.stdin.setEncoding('utf8');
  process.stdin.on('readable', () => {
    let input = process.stdin.read();
    if (input !== null) {
      input = input.trim();
      if (input === '0') {
        process.exit(0);
      } else if (input.toLowerCase() === 'help') {
        console.log("You need to choose one of the options, after which the computer will make its choice, and you will see the result and a summary data table");
      } else {
        const choice = moves[input - 1];
        if (choice) {
          const computer = Computer(moves);
          const hmac = generateHmac(hmacKey, computer);
          console.log(`Computer: ${computer}`);
          console.log(`HMAC: ${hmac}`);
          console.log(Win(choice, computer, moves));
          console.log(`HMAC key: ${hmacKey}`);
          const table = generateTable(moves);
        } else {
          console.log('Invalid input. Please try again.');
        }
      }
    }
  });
}

startGame();
