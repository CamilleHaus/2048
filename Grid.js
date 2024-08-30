const GRID_SIZE = 4
const CELL_SIZE = 12
const CELL_GAP = 1

export default class Grid {
  #cells // Torna a variavél private e inacessivel fora da classe Grid

  constructor(gridElement) {
    gridElement.style.setProperty("--grid-size", GRID_SIZE)
    gridElement.style.setProperty("--cell-size", `${CELL_SIZE}vmin`)
    gridElement.style.setProperty("--cell-gap", `${CELL_GAP}vmin`)
    this.#cells = createCellElements(gridElement).map((cellElement, index) => {
      return new Cell(
        cellElement,
        index % GRID_SIZE,
        Math.floor(index / GRID_SIZE)
      )
    })

    // Como um array é retornado, mapeamos sobre ele e para cada cellElement retornado, nós criamos uma nova Cell
    // Precisamos do index para calcular o x e y
    // Para calcular X. Ex: Se o index for 3, fazemos 3 % 4 (Grid_size), o resto vai ser 3 por que 3 não é dividido por 4 nenhuma vez
    //Para calcular Y. Ex: Se dividirmos 6 por 4, vai dar 1.5, ou seja, o index vai retornar 1
  }

  get cells() {
    return this.#cells
  }

  get cellsByRow() {
    return this.#cells.reduce((cellGrid, cell) => {
      cellGrid[cell.y] = cellGrid[cell.y] || []
      cellGrid[cell.y][cell.x] = cell
      return cellGrid
    }, [])
  }

  get cellsByColumn() {
    return this.#cells.reduce((cellGrid, cell) => {
      cellGrid[cell.x] = cellGrid[cell.x] || []
      cellGrid[cell.x][cell.y] = cell
      return cellGrid
    }, [])
  }

  // Criamos aqui um array de arrays, onde o primeiro item é a linha, e o segundo a coluna

  get #emptyCells() {
    return this.#cells.filter(cell => cell.tile == null)
  }

  // Filtra as cells que não estao associadas a um tile

  randomEmptyCell() {
    const randomIndex = Math.floor(Math.random() * this.#emptyCells.length)
    return this.#emptyCells[randomIndex]

    // Essa função vai retornar um numero entre 0 e o número de cells disponiveis
  }
}

class Cell {
  #cellElement
  #x
  #y
  #tile
  #mergeTile

  constructor(cellElement, x, y) {
    this.#cellElement = cellElement
    this.#x = x
    this.#y = y
  }

  get x() {
    return this.#x
  }

  get y() {
    return this.#y
  }

  get tile() {
    return this.#tile
  }

  set tile(value) {
    this.#tile = value
    if (value == null) return
    this.#tile.x = this.#x
    this.#tile.y = this.#y

    // Essa função serve para avisar pro Tile que ele foi movido da sua ultima posição pra sua posição atual
  }

  get mergeTile() {
    return this.#mergeTile
  }

  set mergeTile(value) {
    this.#mergeTile = value
    if (value == null) return
    this.#mergeTile.x = this.#x
    this.#mergeTile.y = this.#y
  }

  canAccept(tile) {
    return (
      this.tile == null ||
      (this.mergeTile == null && this.tile.value === tile.value)
    )
  }

  mergeTiles() {
    if (this.tile == null || this.mergeTile == null) return
    this.tile.value = this.tile.value + this.mergeTile.value
    this.mergeTile.remove()
    this.mergeTile = null
  }
}

function createCellElements(gridElement) {
  const cells = []
  for (let i = 0; i < GRID_SIZE * GRID_SIZE; i++) {
    const cell = document.createElement("div")
    cell.classList.add("cell")
    cells.push(cell)
    gridElement.append(cell)
  }
  return cells
}

// Aqui, ao invés de criarmos as "cells no proprio HTML, estamos criando o número necessário através de um LOOP"
// Depois, entamos criando cada cell individualmente como uma div e adicionando a classe "cell" e colocando no array
// e depois adicionando a pagina (append)

