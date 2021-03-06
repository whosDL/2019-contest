let level = 1, stage = 1, steps = 0, count = 0, memo = [], memoIdx = 0, puzzle

const imgMap = {
  0: 'empty',
  1: 'wall',
  2: 'space',
  3: 'target',
  4: 'box',
  5: 'box_red',
  6: 'worker'
}

// puzzles:
// level 1: 2 boxes
// level 2: 3 boxes
// level 3: 4 boxes
const puzzles = [
[
  [
    ['0','0','0','0','1','1','1','1','1','1','0','0','0','0','0'],
    ['1','1','1','1','1','2','2','2','2','1','1','1','1','1','1'],
    ['1','2','2','2','1','2','2','2','6','2','2','1','2','2','1'],
    ['1','2','2','4','3','2','2','2','2','2','2','3','4','2','1'],
    ['1','1','1','1','2','2','2','2','1','2','2','1','2','2','1'],
    ['0','0','0','1','1','2','2','2','1','2','2','2','2','1','1'],
    ['0','0','0','0','1','1','1','1','1','1','1','1','1','1','0'],
  ],
  [
    ['1','1','1','1','0','0','1','1','1','1'],
    ['1','2','2','1','1','1','1','2','2','1'],
    ['1','2','2','2','2','2','2','2','2','1'],
    ['1','2','2','1','1','1','1','2','2','1'],
    ['1','1','6','1','1','3','2','4','1','1'],
    ['1','2','2','1','3','4','2','2','1','0'],
    ['1','2','2','2','2','2','2','1','1','0'],
    ['1','2','2','1','2','2','1','1','0','0'],
    ['1','1','1','1','1','1','1','0','0','0'],
  ],
],
[
  [
    ['1','1','1','1','1','1','1','1'],
    ['1','1','6','2','2','2','1','1'],
    ['1','1','1','4','2','2','2','1'],
    ['1','1','1','2','3','2','2','1'],
    ['1','2','4','2','1','4','1','1'],
    ['1','2','3','2','2','3','1','1'],
    ['1','1','1','1','2','2','1','1'],
    ['1','1','1','1','1','1','1','1'],
  ],
  [
    ['1','1','1','1','1','1','1','1'],
    ['1','1','1','1','1','1','1','1'],
    ['1','1','2','2','3','2','1','1'],
    ['1','1','6','1','2','5','1','1'],
    ['1','1','2','2','4','2','1','1'],
    ['1','1','2','1','5','2','1','1'],
    ['1','1','2','2','2','2','1','1'],
    ['1','1','1','1','1','1','1','1'],
  ],
],
[
  [
    ['0','1','1','1','1','1','0'],
    ['0','1','2','2','2','1','0'],
    ['0','1','3','1','4','1','1'],
    ['0','1','2','2','2','2','1'],
    ['0','1','3','1','4','2','1'],
    ['0','1','2','2','2','1','1'],
    ['0','1','3','1','4','1','0'],
    ['1','1','2','2','2','1','0'],
    ['1','2','3','1','4','1','0'],
    ['1','2','6','2','2','1','0'],
    ['1','2','2','1','1','1','0'],
    ['1','1','1','1','0','0','0'],
  ],
  [
    ['1','1','1','1','1','1','1','1','1','0'],
    ['1','2','3','6','3','4','3','2','1','0'],
    ['1','2','1','2','4','2','2','2','1','0'],
    ['1','2','1','1','4','1','1','1','1','0'],
    ['1','2','2','2','4','2','2','1','1','0'],
    ['1','1','1','2','3','2','2','2','1','1'],
    ['0','0','1','1','1','2','2','2','2','1'],
    ['0','0','0','0','1','1','2','2','2','1'],
    ['0','0','0','0','0','1','1','1','1','1'],
  ],
],
]

const choosePuzzle = (level, stage) => {
  return puzzles[level - 1][stage - 1].concat([]).map(x => x.concat([]))
}

const findWorker = (puzzle) => {
  for (let i = 0; i < puzzle.length; i++) {
    for (let j = 0; j < puzzle[i].length; j++) {
      if (puzzle[i][j] === '6') return [i, j]
    }
  }
}

const storeCopy = (puzzle, steps, count) => {
  const copy = {
    puzzle,
    steps,
    count,
  }
  memoIdx++
  memo[memoIdx] = (JSON.stringify(copy))
}

const preCount = (puzzle) => {
  for (let i = 0; i < puzzle.length; i++) {
    for (let j = 0; j < puzzle[i].length; j++) {
      if (puzzle[i][j] === '5') count++
    }
  }
}

const findNextPos = (wY, wX, direction) => {
  switch (direction) {
    case 'up': return [wY - 1, wX]
    case 'right': return [wY, wX + 1]
    case 'down': return [wY + 1, wX]
    case 'left': return [wY, wX - 1]
  }
}

const handleBoxMove = (ly, lx, ty, tx) => {
  if (puzzles[level - 1][stage - 1][ly][lx] === '3' || puzzles[level - 1][stage - 1][ly][lx] === '5') count--
  if (puzzles[level - 1][stage - 1][ty][tx] === '3' || puzzles[level - 1][stage - 1][ty][tx] === '5') count++
}

const handleMove = (puzzle, direction) => {
  const [workerY, workerX] = findWorker(puzzle)
  const [tryY, tryX] = findNextPos(workerY, workerX, direction)
  // normal
  if (puzzle[tryY][tryX] === '2' || puzzle[tryY][tryX] === '3' ) {
    puzzle[tryY][tryX] = '6'
    puzzle[workerY][workerX] = puzzles[level - 1][stage - 1][workerY][workerX] === '3' || puzzles[level - 1][stage - 1][workerY][workerX] === '5' ? '3' : '2'
    return [[workerY, workerX], [tryY, tryX]]
  }
  // box
  if (puzzle[tryY][tryX] === '4' || puzzle[tryY][tryX] === '5' ) {
    const nextBoxY = 2 * tryY - workerY
    const nextBoxX = 2 * tryX - workerX
    // will only to space or target
    if (puzzle[nextBoxY][nextBoxX] === '2' || puzzle[nextBoxY][nextBoxX] === '3') {
      puzzle[nextBoxY][nextBoxX] = `${+puzzle[nextBoxY][nextBoxX] + 2}`
      puzzle[tryY][tryX] = '6'
      puzzle[workerY][workerX] = puzzles[level - 1][stage - 1][workerY][workerX] === '3' || puzzles[level - 1][stage - 1][workerY][workerX] === '5' ? '3' : '2'
      handleBoxMove(tryY, tryX, nextBoxY, nextBoxX)
      return [[workerY, workerX], [tryY, tryX], [nextBoxY, nextBoxX]]
    }
    return false
  }
  // wall
  return false
}

const move = (domMap, puzzle, direction) => {
  const result = handleMove(puzzle, direction)
  if (result) {
    const [[y1, x1], [y2, x2], changePos3] = result
    const bg1 = imgMap[puzzle[y1][x1]]
    const bg2 = imgMap[puzzle[y2][x2]]
    
    domMap[y1].children[x1].setAttribute('class', `cell ${bg1}`)
    domMap[y2].children[x2].setAttribute('class', `cell ${bg2}`)
    if (changePos3) {
      const [y3, x3] = changePos3
      const bg3 = imgMap[puzzle[y3][x3]]
      domMap[y3].children[x3].setAttribute('class', `cell ${bg3}`)
    }
    steps++
    stepUpdater()

    // store copy & clean seq
    memo.splice(memoIdx+1)
    storeCopy(puzzle, steps, count)

    if (count === level+1) {
      onEnd()
    }
  }
}

const refreshMap = (puzzle) => {
  const container = document.getElementById('container')
  container.remove()
  const content = document.getElementById('content')
  const newContainer = document.createElement('main')
  newContainer.setAttribute('id', 'container')
  content.appendChild(newContainer);

  renderMap(puzzle, document.getElementById('container'))
}

const renderMap = (puzzle, domContainer) => {
  for (let i = 0; i < puzzle.length; i++) {
    const line = document.createElement('div')
    line.setAttribute('class', 'line')
    for (let j = 0; j < puzzle[i].length; j++) {
      const cell = document.createElement('div')
      const bg = imgMap[puzzle[i][j]]
      cell.setAttribute('class', `cell ${bg}`)
      line.appendChild(cell)
    }
    domContainer.appendChild(line)
  }
}

const highlightLevel = () => {
  if (stage === 1) {
    const s = document.getElementsByClassName('stage1')
    s[level - 1].style.backgroundColor = 'coral'
  } else {
    const s = document.getElementsByClassName('stage2')
    s[level - 1].style.backgroundColor = 'coral'
  }
}

const cancelHighlight = () => {
  const s = document.getElementsByClassName('stage')
  for (let i of s) {
    i.style = ''
  }
}

const initialize = () => {
  cancelHighlight()
  puzzle = choosePuzzle(level, stage)
  steps = 0
  count = 0
  memo = []
  memoIdx = -1

  refreshMap(puzzle)
  preCount(puzzle)

  storeCopy(puzzle, steps, count)
  highlightLevel()
}

const handleUndo = () => {
  if (memoIdx > 0) {
    memoIdx--
    const copy = JSON.parse(memo[memoIdx])
    steps = copy.steps
    puzzle = copy.puzzle
    count = copy.count

    refreshMap(puzzle)
    stepUpdater()
  }
}

const handleRedo = () => {
  if (memoIdx < memo.length - 1) {
    memoIdx++
    const copy = JSON.parse(memo[memoIdx])
    steps = copy.steps
    puzzle = copy.puzzle
    count = copy.count

    refreshMap(puzzle)
    stepUpdater()
  }
}

const handleReplay = () => {
  initialize()
  stepUpdater()
}

const stepUpdater = () => {
  document.getElementById('step').innerHTML = `Steps: ${steps}`
}

const handleKeyup = (e) => {
  const domMap = document.getElementsByClassName('line')
  switch (e.key) {
    case 'w': move(domMap, puzzle, 'up')
    break
    case 'd': move(domMap, puzzle, 'right')
    break
    case 's': move(domMap, puzzle, 'down')
    break
    case 'a': move(domMap, puzzle, 'left')
    break
    case 'ArrowUp': move(domMap, puzzle, 'up')
    break
    case 'ArrowRight': move(domMap, puzzle, 'right')
    break
    case 'ArrowDown': move(domMap, puzzle, 'down')
    break
    case 'ArrowLeft': move(domMap, puzzle, 'left')
    break
  }
}

const addStageEvent = () => {
  const stagesButtons1 = document.getElementsByClassName('stage1')
  const stagesButtons2 = document.getElementsByClassName('stage2')
  for (let i = 0; i < stagesButtons1.length; i++) {
    stagesButtons1[i].addEventListener('click', () => {level = i+1; stage = 1; initialize(); stepUpdater()}, false)
  }
  for (let i = 0; i < stagesButtons2.length; i++) {
    stagesButtons2[i].addEventListener('click', () => {level = i+1; stage = 2; initialize(); stepUpdater()}, false)
  }
}

const addControler = () => {
  const replayButton = document.getElementById('replay')
  replayButton.addEventListener('click', handleReplay, false)
  const redoButton = document.getElementById('redo')
  redoButton.addEventListener('click', handleRedo, false)
  const undoButton = document.getElementById('undo')
  undoButton.addEventListener('click', handleUndo, false)
}

const onStart = () => {
  window.addEventListener('keyup', handleKeyup, false)
  addStageEvent()
  addControler()
  initialize()
  stepUpdater()
}

const onEnd = () => {
  window.removeEventListener('keyup', handleKeyup, false)
  alert(`闯关成功，共使用 ${steps} 步。`)
  if (stage < puzzles[level - 1].length) {
    stage++
    onStart()
  } else if (level < puzzles.length) {
    stage = 1
    level++
    onStart()
  } else {
    alert('恭喜完成所有关卡！')
  }
}

window.onload = onStart