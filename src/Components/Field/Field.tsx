import React from "react";
import { Cell, CellProps } from "../Cell/Cell";
import FieldContext from "../../Contexts/FieldContext";
import { FieldHeader } from "./FieldHeader";
import { FieldSettings } from "./FieldSettings";
import DefaultSettings from "./FieldSettings";

export interface FieldState {
    rows: number;
    columns: number;
    minesCount: number;
    flagsCount: number;
    cells: CellProps[][];
    minesSpawned: boolean;
}

export class Field extends React.Component<{}, FieldState>{
    public static contextType = FieldContext;
    public context!: React.ContextType<typeof FieldContext>;

    public constructor(props: {}) {
        super(props);

        this.state = {
            rows: DefaultSettings.rowsCount,
            columns: DefaultSettings.columnsCount,
            minesCount: DefaultSettings.minesCount,
            flagsCount: DefaultSettings.minesCount,
            cells: this.prepareNewCells(10, 10),
            minesSpawned: false
        };
    }

    public render(): React.ReactNode {
        const fieldStyles = {
            display: 'grid',
            gridTemplateColumns: `repeat(${this.state.columns}, ${this.context.cellWidth}px)`,
            gridTemplateRows: `repeat(${this.state.rows}, ${this.context.cellWidth}px)`,
            gridGap: '2px'
        };

        const cells = this.getCellsFromProps();

        const rowsChanged = (newRows: number) => {
            this.restart(newRows, this.state.columns, this.state.minesCount);
        }

        const columnsChanged = (newColumns: number) => {
            this.restart(this.state.rows, newColumns, this.state.minesCount);
        }

        const minesChanged = (newMines: number) => {
            this.restart(this.state.rows, this.state.columns, newMines);
        }

        return (
            <div>
                <FieldHeader minesCount={this.state.minesCount} flagsCount={this.state.flagsCount}></FieldHeader>
                <div style={fieldStyles}>
                    {cells}
                </div>
                <FieldSettings rowsChanged={rowsChanged} minesChanged={minesChanged} columnsChanged={columnsChanged}></FieldSettings>
            </div>
        );
    }

    private handleCellFlagged(isFlagged: boolean, row: number, column: number) {
        const newFlagsCount = this.state.flagsCount + (isFlagged ? -1 : 1);

        const canPutFlags = newFlagsCount > 0;

        const newCells = [...this.state.cells];

        for (let i = 0; i < this.state.rows; i++) {
            for (let j = 0; j < this.state.columns; j++) {
                newCells[i][j].canPutFlags = canPutFlags;
            }
        }

        newCells[row][column].isFlagged = true;

        this.setState({
            cells: newCells,
            flagsCount: newFlagsCount
        });
    }

    private handleCellOpened(hasMine: boolean, row: number, column: number) {
        if (!this.state.minesSpawned) {
            this.setState({ minesSpawned: true });
            this.spawnMines(row, column);
        }

        const newCells = [...this.state.cells];
        newCells[row][column].isOpen = true;

        this.setState({ cells: newCells });

        if (hasMine) {
            alert("Game over");
        }
    }

    private getCellsFromProps(): JSX.Element[] {
        const cells: JSX.Element[] = [];

        for (let i = 0; i < this.state.rows; i++) {
            for (let j = 0; j < this.state.columns; j++) {
                cells.push(<Cell
                    isOpen={this.state.cells[i][j].isOpen}
                    minesNearby={this.state.cells[i][j].minesNearby}
                    row={this.state.cells[i][j].row}
                    column={this.state.cells[i][j].column}
                    canPutFlags={this.state.cells[i][j].canPutFlags}
                    cellFlagged={this.state.cells[i][j].cellFlagged}
                    cellOpened={this.state.cells[i][j].cellOpened}
                    isFlagged={this.state.cells[i][j].isFlagged}
                    hasMine={this.state.cells[i][j].hasMine}
                    key={`${i}-${j}`}
                ></Cell>);
            }
        }

        return cells;
    }

    private spawnMines(clickedRow: number, clickedColumn: number): void {
        const cellsNearbyClicked = this.cellsNearby(this.state.cells, clickedRow, clickedColumn);
        cellsNearbyClicked.push(this.state.cells[clickedRow][clickedColumn]);

        const minePositions: Array<[number, number]> = [];

        while (minePositions.length !== this.state.minesCount) {
            let row = Math.round(Math.random() * (this.state.rows - 1));
            let column = Math.round(Math.random() * (this.state.columns - 1));

            if (minePositions.indexOf([row, column]) !== -1
                || cellsNearbyClicked.filter(cell => cell.row === row && cell.column === column).length !== 0) {
                continue;
            }

            minePositions.push([row, column]);
        }

        const newCellsProps = [...this.state.cells];

        for (let minePosition of minePositions) {
            newCellsProps[minePosition[0]][minePosition[1]].hasMine = true;
        }

        for (let i = 0; i < this.state.rows; i++) {
            for (let j = 0; j < this.state.columns; j++) {
                newCellsProps[i][j].minesNearby = this.cellsNearby(newCellsProps, i, j).filter(cell => cell.hasMine).length;
            }
        }

        const traversedCells: CellProps[] = [];
        this.cellsForInitialOpen(newCellsProps, clickedRow, clickedColumn, traversedCells);

        this.setState({ cells: newCellsProps });
    }

    private cellsNearby(props: CellProps[][], i: number, j: number): CellProps[] {
        const result: CellProps[] = [];

        result.push(props[i]?.[j - 1]);
        result.push(props[i - 1]?.[j - 1]);
        result.push(props[i - 1]?.[j]);
        result.push(props[i - 1]?.[j + 1]);
        result.push(props[i]?.[j + 1]);
        result.push(props[i + 1]?.[j + 1]);
        result.push(props[i + 1]?.[j]);
        result.push(props[i + 1]?.[j - 1]);

        return result.filter(r => r);
    }

    private cellsForInitialOpen(props: CellProps[][], i: number, j: number, traversed: CellProps[]): void {
        const nearby = this.cellsNearby(props, i, j).filter(cell => !cell.hasMine && traversed.indexOf(cell) === -1);

        nearby.forEach(cell => {
            traversed.push(cell);
            cell.isOpen = true;
            if (cell.minesNearby === 0) {
                this.cellsForInitialOpen(props, cell.row, cell.column, traversed);
            }
        });
    }

    private restart(rows: number, columns: number, mines: number): void {
        this.setState({
            cells: this.prepareNewCells(rows, columns),
            minesSpawned: false,
            rows: rows,
            columns: columns,
            flagsCount: mines,
            minesCount: mines
        });
    }

    private prepareNewCells(rows: number, columns: number): CellProps[][] {
        const newCells: CellProps[][] = [];

        for (let i = 0; i < rows; i++) {
            newCells[i] = [];

            for (let j = 0; j < columns; j++) {
                newCells[i].push({
                    isOpen: false,
                    minesNearby: 0,
                    row: i,
                    column: j,
                    hasMine: false,
                    canPutFlags: true,
                    isFlagged: false,
                    cellFlagged: (isFlagged, row, column) => this.handleCellFlagged(isFlagged, row, column),
                    cellOpened: (hasMine, row, column) => this.handleCellOpened(hasMine, row, column),
                });
            }
        }

        return newCells;
    }
}