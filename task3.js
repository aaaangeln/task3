const crypto = require('crypto');
const readline = require('readline');
const key = crypto.randomBytes(32).toString('hex');
const moves = process.argv.slice(2);

function HMAC(key, data) {
  const hmac = crypto.createHmac('sha256', key);
  hmac.update(data);
  return hmac.digest('hex');
}

function Win(user, computer, moves) {
  const half = Math.floor(moves.length / 2);
  const index = moves.indexOf(user);
  const win = moves.slice(index + 1, index + 1 + half);
  const lose = moves.slice(index - half, index);
  
  if (win.includes(computer)) {
    return 'You WIN';
  } else if (lose.includes(computer)) {
    return 'You LOSE';
  } else {
    return 'It is DRAW';
  }
}

function Help(moves) {
    console.log('You choice:');
    moves.forEach((move, index) => {
      console.log(`${index + 1} - ${move}`);
    });
    console.log('0 - exit');
    console.log('? - help');
  }

function HelpTable(moves) {
    const header = '+-------------+';
    const separator = '|';
    const line = '+-------------+';
    const rowLength = moves.length;
  
    let table = `${header}${'-'.repeat(rowLength * 8)}+\n`;
    table += `| v PC||User > ${separator}`;
  
    moves.forEach((move) => {
      table += ` ${move} ${separator}`;
    });
    table += '\n';
  
    table += `${line}${'-'.repeat(rowLength * 8)}+\n`;
  
    moves.forEach((move1) => {
      table += `| ${move1} ${separator}`;
      moves.forEach((move2) => {
        const result = Win(move1, move2, moves);
        table += ` ${result} ${separator}`;
      });
      table += '\n';
      table += `${line}${'-'.repeat(rowLength * 8)}+\n`;
    });
  
    console.log(table);
  }

function Play(moves) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  console.log(`HMAC key: ${key}`);
  Help(moves);

  rl.on('line', (input) => {
    if (input === '0') {
      rl.close();
    } else if (input === '?') {
        Help(moves);
    } else if (input >= 1 && input <= moves.length) {
      const user = moves[input - 1];
      const computer = moves[Math.floor(Math.random() * moves.length)];
      const hmac = HMAC(key, computer);

      console.log(`Your choice: ${user}`);
      console.log(`Computer choice: ${computer}`);
      console.log(Win(user, computer, moves));
      console.log(`HMAC: ${hmac}`);
      HelpTable(moves);
      rl.close();
    } else {
      console.log('Invalid input');
    }
  });
}

if (moves.length < 3 || moves.length % 2 === 0) {
  console.log('Please moves >=3');
} else {
  Play(moves);
}
