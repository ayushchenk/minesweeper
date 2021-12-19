import React from "react";

export interface FieldHeaderProps {
    minesCount: number;
    flagsCount: number;
}

export interface FieldHeaderState {
    secondsElapsed: number;
    intervalId: NodeJS.Timer | null;
}

export class FieldHeader extends React.Component<FieldHeaderProps, FieldHeaderState>{
    public constructor(props: FieldHeaderProps){
        super(props);

        this.state = {
            secondsElapsed: 0,
            intervalId: null
        }
    }

    public componentDidMount() {
        this.setState({
            secondsElapsed: 0,
            intervalId: setInterval(() => {
                this.setState({
                    secondsElapsed: this.state.secondsElapsed + 1
                })
            }, 1000)
        });
    }

    public render(): React.ReactNode {
        return (
            <div className="field__header">
                <label>Flags: {this.props.flagsCount}</label>
                <label>{this.state.secondsElapsed}</label>
            </div>
        );
    }
}