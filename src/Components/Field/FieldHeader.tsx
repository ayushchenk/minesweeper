import React from "react";

export interface FieldHeaderProps {
    minesCount: number;
    flagsCount: number;
}

export class FieldHeader extends React.Component<FieldHeaderProps>{
    public render(): React.ReactNode {
        return (
            <div className="field__header">
                <label>Flags: {this.props.flagsCount}</label>
            </div>
        );
    }
}