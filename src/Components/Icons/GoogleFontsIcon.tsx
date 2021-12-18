import React from "react";

export interface GoogleFontsIconProps {
    color: string;
    isOutlined: boolean;
}

export class GoogleFontsIcon extends React.Component<GoogleFontsIconProps> {
    public render(): React.ReactNode {
        const styles = { color: `${this.props.color}` };
        const className = this.props.isOutlined ? "material-icons-outlined" : "material-icons";

        return (<i className={className} style={styles}>{this.props.children}</i>);
    }
}