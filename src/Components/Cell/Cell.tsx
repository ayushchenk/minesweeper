import React from "react";
import FieldContext from "../../Contexts/FieldContext";
import { FlagIcon } from "../Icons/FlagIcon";
import { MineIcon } from "../Icons/MineIcon";
import { IconForNumber } from "../Icons/Numbers/IconForNumber";

export interface CellProps {
    minesNearby: number;
    row: number;
    column: number;
    hasMine: boolean;
    canPutFlags: boolean;
    isOpen: boolean;
    isFlagged: boolean;
    cellFlagged: (isFlagged: boolean, row: number, column: number) => void;
    cellOpened: (hasMine: boolean, row: number, column: number) => void;
}

export interface CellState {
    isFlagged: boolean;
    isOpen: boolean;
}

export class Cell extends React.Component<CellProps, CellState>{
    static contextType = FieldContext;
    context!: React.ContextType<typeof FieldContext>;

    public constructor(props: CellProps) {
        super(props);

        this.state = {
            isFlagged: false,
            isOpen: this.props.isOpen
        };
    }

    public render(): React.ReactNode {
        const size = this.context.cellWidth;

        const cellStyles = {
            width: `${size}px`,
            height: `${size}px`
        };

        const cellClasses = `cell ${this.state.isOpen ? 'cell--open' : 'cell--closed'}`;

        return (
            <div style={cellStyles} className={cellClasses} onContextMenu={(event) => this.cellRightClickHandler(event)} onClick={() => this.cellLeftClickHandler()}>
                {this.state.isFlagged && !this.state.isOpen && <FlagIcon></FlagIcon>}
                {this.state.isOpen && !this.props.hasMine && <IconForNumber>{this.props.minesNearby}</IconForNumber>}
                {this.state.isOpen && this.props.hasMine && <MineIcon></MineIcon>}
            </div>
        );
    }

    public static getDerivedStateFromProps(nextProps: CellProps): CellState {
        const state: CellState = {
            isFlagged: nextProps.isFlagged,
            isOpen: nextProps.isOpen
        };

        return state;
    }

    private cellRightClickHandler(event: React.MouseEvent<HTMLDivElement, MouseEvent>): void {
        event.preventDefault();

        if (!this.state.isOpen && (this.props.canPutFlags || (!this.props.canPutFlags && this.state.isFlagged))) {
            const newState = !this.state.isFlagged;
            this.setState({ isFlagged: newState });
            this.props.cellFlagged(newState, this.props.row, this.props.column);
        }
    }

    private cellLeftClickHandler(): void {
        if (!this.state.isFlagged) {
            this.props.cellOpened(this.props.hasMine, this.props.row, this.props.column);

            this.setState({
                isFlagged: false,
                isOpen: true
            });
        }
    }
}