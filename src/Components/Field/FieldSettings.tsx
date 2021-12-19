import React from "react";

export interface FieldSettingsProps {
    rowsChanged: (rowsCount: number) => void;
    columnsChanged: (columnsCount: number) => void;
    minesChanged: (minesCount: number) => void;
}

export interface FieldSettingsState {
    rowsCount: number;
    columnsCount: number;
    minesCount: number;
}

const defaultSettings: FieldSettingsState = {
    rowsCount: 10,
    columnsCount: 10,
    minesCount: 25
};

export default defaultSettings;

export class FieldSettings extends React.Component<FieldSettingsProps, FieldSettingsState>{
    public constructor(props: FieldSettingsProps) {
        super(props);

        this.state = defaultSettings;
    }

    public render(): React.ReactNode {
        return (
            <div>
                <div className="field__settings__row">
                    <label>Rows</label>
                    <label>Columns</label>
                    <label>Mines</label>
                </div>
                <div className="field__settings__row">
                    <input
                        type="number"
                        onChange={(event) => this.props.rowsChanged(Number.parseInt(event.target.value))}
                        min={5}
                        max={25}
                        defaultValue={this.state.rowsCount}>
                    </input>
                    <input
                        type="number"
                        onChange={(event) => this.props.columnsChanged(Number.parseInt(event.target.value))}
                        min={5}
                        max={50}
                        defaultValue={this.state.columnsCount}>
                    </input>
                    <input
                        type="number"
                        onChange={(event) => this.props.minesChanged(Number.parseInt(event.target.value))}
                        min={5}
                        max={1000}
                        defaultValue={this.state.minesCount}>
                    </input>
                </div>

            </div>
        );
    }

    public componentDidMount() {
        this.props.rowsChanged(this.state.rowsCount);
        this.props.columnsChanged(this.state.columnsCount);
        this.props.minesChanged(this.state.minesCount);
    }
}