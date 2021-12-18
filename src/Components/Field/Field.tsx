import React from "react";
import { Cell, CellProps } from "../Cell/Cell";
import FieldContext from "../../Contexts/FieldContext";
import { FieldHeader } from "./FieldHeader";

export interface FieldProps {
    rows: number;
    columns: number;
    minesCount: number;
}

export interface FieldState {
    flagsCount: number;
    cells: CellProps[];
    minesSpawned: boolean;
}

export class Field extends React.Component<FieldProps, FieldState>{
    public static contextType = FieldContext;
    public context!: React.ContextType<typeof FieldContext>;

    public constructor(props: FieldProps) {
        super(props);

        this.state = {
            flagsCount: props.minesCount,
            cells: [],
            minesSpawned: false
        };

        for (let i = 0; i < this.props.columns * this.props.rows; i++) {
            this.state.cells.push({
                isOpen: false,
                minesNearby: 0,
                number: i,
                hasMine: false,
                canPutFlags: true,
                cellFlagged: (isFlagged) => this.handleCellFlagged(isFlagged),
                cellOpened: (hasMine, number) => this.handleCellOpened(hasMine, number),
            });
        }
    }

    public render(): React.ReactNode {
        const fieldStyles = {
            display: 'grid',
            gridTemplateColumns: `repeat(${this.props.columns}, ${this.context.cellWidth}px)`,
            gridTemplateRows: `repeat(${this.props.rows}, ${this.context.cellWidth}px)`,
            gridGap: '2px'
        };

        const cells = this.getCellsFromProps();

        return (
            <div>
                <FieldHeader minesCount={this.props.minesCount} flagsCount={this.state.flagsCount}></FieldHeader>
                <div style={fieldStyles}>
                    {cells}
                </div>
            </div>
        );
    }

    private handleCellFlagged(isFlagged: boolean) {
        const newCount = this.state.flagsCount + (isFlagged ? -1 : 1);

        const canPutFlags = newCount > 0;

        const newCellsProps = [...this.state.cells];
        newCellsProps.forEach(prop => prop.canPutFlags = canPutFlags);

        this.setState({
            cells: newCellsProps,
            flagsCount: newCount
        });
    }

    private handleCellOpened(hasMine: boolean, number: number) {
        if (!this.state.minesSpawned) {
            this.setState({ minesSpawned: true });
            this.spawnMines(number);
        }

        const newCells = [...this.state.cells];
        newCells[number].isOpen = true;

        this.setState({ cells: newCells });
    }

    private getCellsFromProps(): JSX.Element[] {
        return this.state.cells.map(prop => <Cell
            isOpen={prop.isOpen}
            minesNearby={prop.minesNearby}
            number={prop.number}
            canPutFlags={prop.canPutFlags}
            cellFlagged={prop.cellFlagged}
            cellOpened={prop.cellOpened}
            hasMine={prop.hasMine}
            key={prop.number}
        ></Cell>);
    }

    private spawnMines(cellNumber: number): void {
        const columns = this.props.columns;

        const cellsNearbyClicked = this.cellsNearby(cellNumber);
        cellsNearbyClicked.push(cellNumber);

        let cellsWithMines: number[] = [];

        while (cellsWithMines.length != this.props.minesCount) {
            let index = Math.round(Math.random() * (this.state.cells.length - 1));

            if (cellsWithMines.indexOf(index) != -1 || cellsNearbyClicked.indexOf(index) != -1) {
                continue;
            }

            cellsWithMines.push(index);
        }

        const newCellsProps = [...this.state.cells];

        cellsWithMines.forEach(number => newCellsProps[number].hasMine = true);

        for (let i = 0; i < newCellsProps.length; i++) {
            let minesNearby = 0;

            if (newCellsProps[i - 1]?.hasMine) minesNearby++;
            if (newCellsProps[i - 1 - columns]?.hasMine) minesNearby++;
            if (newCellsProps[i - columns]?.hasMine) minesNearby++;
            if (newCellsProps[i + 1 - columns]?.hasMine) minesNearby++;
            if (newCellsProps[i + 1]?.hasMine) minesNearby++;
            if (newCellsProps[i + 1 + columns]?.hasMine) minesNearby++;
            if (newCellsProps[i + columns]?.hasMine) minesNearby++;
            if (newCellsProps[i - 1 + columns]?.hasMine) minesNearby++;

            newCellsProps[i].minesNearby = minesNearby;
            newCellsProps[i].isOpen = minesNearby === 0;
        }

        this.setState({ cells: newCellsProps });
    }

    private cellsNearby(cellNumber: number): number[] {
        const columns = this.props.columns;

        return [
            cellNumber - 1,
            cellNumber - 1 - columns,
            cellNumber - columns,
            cellNumber + 1 - columns,
            cellNumber + 1,
            cellNumber + 1 + columns,
            cellNumber + columns,
            cellNumber - 1 + columns
        ];
    }
}